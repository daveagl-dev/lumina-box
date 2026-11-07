package com.luminabox.controller;

import com.luminabox.error.ApiException;
import com.luminabox.model.User;
import com.luminabox.repository.UserRepository;
import com.luminabox.security.AuthInterceptor;
import com.luminabox.security.AuthUser;
import com.luminabox.security.JwtService;
import com.luminabox.service.StorageService;
import java.io.IOException;
import java.time.Duration;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private static final Pattern EMAIL = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final Duration AVATAR_URL_TTL = Duration.ofDays(7); // the max for a presigned URL
    private static final long MAX_AVATAR_BYTES = 5L * 1024 * 1024;

    public record RegisterRequest(String name, String email, String password) {}

    public record LoginRequest(String email, String password) {}

    public record PublicUser(String id, String name, String email, String avatarUrl) {}

    public record AuthResponse(String token, PublicUser user) {}

    public record UserResponse(PublicUser user) {}

    private final UserRepository users;
    private final JwtService jwt;
    private final StorageService storage;
    private final BCryptPasswordEncoder passwords = new BCryptPasswordEncoder(10);

    public AuthController(UserRepository users, JwtService jwt, StorageService storage) {
        this.users = users;
        this.jwt = jwt;
        this.storage = storage;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    AuthResponse register(@RequestBody(required = false) RegisterRequest body) {
        String name = body == null ? null : body.name();
        String email = body == null ? null : body.email();
        String password = body == null ? null : body.password();

        if (name == null || name.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Name is required");
        }
        if (email == null || password == null || !EMAIL.matcher(email).matches() || password.length() < 8) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST, "Valid email and password (min 8 characters) are required");
        }

        String normalized = email.trim().toLowerCase(Locale.ROOT);
        if (users.findByEmail(normalized).isPresent()) {
            throw emailTaken();
        }

        User user;
        try {
            user = users.save(new User(name.trim(), normalized, passwords.encode(password)));
        } catch (DuplicateKeyException e) {
            throw emailTaken();
        }
        return new AuthResponse(jwt.sign(user), toPublicUser(user));
    }

    @PostMapping("/login")
    AuthResponse login(@RequestBody(required = false) LoginRequest body) {
        if (body == null || isEmpty(body.email()) || isEmpty(body.password())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email and password are required");
        }

        User user = users.findByEmail(body.email().trim().toLowerCase(Locale.ROOT))
                .filter(u -> passwords.matches(body.password(), u.getPasswordHash()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        return new AuthResponse(jwt.sign(user), toPublicUser(user));
    }

    @GetMapping("/me")
    UserResponse me(@RequestAttribute(AuthInterceptor.USER_ATTRIBUTE) AuthUser auth) {
        return new UserResponse(toPublicUser(findUser(auth)));
    }

    @PostMapping("/avatar")
    UserResponse uploadAvatar(
            @RequestAttribute(AuthInterceptor.USER_ATTRIBUTE) AuthUser auth,
            @RequestParam(value = "avatar", required = false) MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "No image provided");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Only image files are allowed");
        }
        if (file.getSize() > MAX_AVATAR_BYTES) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "File too large");
        }

        User user = findUser(auth);
        try {
            String original = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();
            String extension = original.contains(".")
                    ? original.substring(original.lastIndexOf('.') + 1).replaceAll("[^a-zA-Z0-9]", "")
                    : "";
            String newKey = "avatars/" + user.getId() + "-" + UUID.randomUUID() + "."
                    + (extension.isEmpty() ? "jpg" : extension);

            storage.put(newKey, file.getInputStream(), file.getSize(), contentType);

            String previousKey = user.getAvatarKey();
            user.setAvatarKey(newKey);
            users.save(user);

            if (previousKey != null) {
                try {
                    storage.delete(previousKey);
                } catch (RuntimeException e) {
                    log.error("Failed to remove previous avatar", e);
                }
            }
            return new UserResponse(toPublicUser(user));
        } catch (IOException | RuntimeException e) {
            log.error("Avatar upload failed", e);
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload profile picture");
        }
    }

    private User findUser(AuthUser auth) {
        return users.findById(auth.id()).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private PublicUser toPublicUser(User user) {
        String avatarUrl = user.getAvatarKey() == null ? null : storage.presignGet(user.getAvatarKey(), AVATAR_URL_TTL);
        return new PublicUser(user.getId(), user.getName(), user.getEmail(), avatarUrl);
    }

    private static ApiException emailTaken() {
        return new ApiException(HttpStatus.CONFLICT, "An account with this email already exists");
    }

    private static boolean isEmpty(String s) {
        return s == null || s.isEmpty();
    }
}
