package com.luminabox.controller;

import com.luminabox.error.ApiException;
import com.luminabox.security.AuthInterceptor;
import com.luminabox.security.AuthUser;
import com.luminabox.service.StorageService;
import com.luminabox.service.StorageService.StoredObject;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

@RestController
@RequestMapping("/api/files")
public class FilesController {
    private static final Logger log = LoggerFactory.getLogger(FilesController.class);
    private static final int MAX_TEXT_BYTES = 1024 * 1024;

    public record UploadResponse(String key, String originalName, long size, String mimeType) {}

    public record FileListResponse(List<StoredObject> files) {}

    private final StorageService storage;

    public FilesController(StorageService storage) {
        this.storage = storage;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    UploadResponse upload(
            @RequestAttribute(AuthInterceptor.USER_ATTRIBUTE) AuthUser user,
            @RequestParam("file") MultipartFile file) {
        String originalName = file.getOriginalFilename() == null ? "file" : file.getOriginalFilename();
        String key = UUID.randomUUID() + "-" + originalName.replaceAll("[^a-zA-Z0-9._-]", "_");

        try {
            storage.put(userPrefix(user) + key, file.getInputStream(), file.getSize(), file.getContentType());
        } catch (IOException | RuntimeException e) {
            log.error("Upload failed", e);
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload file to Backblaze");
        }
        return new UploadResponse(key, originalName, file.getSize(), file.getContentType());
    }

    @GetMapping
    FileListResponse list(@RequestAttribute(AuthInterceptor.USER_ATTRIBUTE) AuthUser user) {
        try {
            return new FileListResponse(storage.list(userPrefix(user)));
        } catch (RuntimeException e) {
            log.error("List files failed", e);
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to list files from Backblaze");
        }
    }

    @GetMapping("/{key}/download")
    Map<String, String> downloadUrl(
            @RequestAttribute(AuthInterceptor.USER_ATTRIBUTE) AuthUser user, @PathVariable String key) {
        try {
            return Map.of("url", storage.presignGet(userPrefix(user) + key, Duration.ofSeconds(300)));
        } catch (RuntimeException e) {
            log.error("Get download URL failed", e);
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to generate download URL");
        }
    }

    @GetMapping("/{key}/content")
    Map<String, Object> textContent(
            @RequestAttribute(AuthInterceptor.USER_ATTRIBUTE) AuthUser user, @PathVariable String key) {
        try {
            ResponseBytes<GetObjectResponse> object = storage.getFirstBytes(userPrefix(user) + key, MAX_TEXT_BYTES);
            GetObjectResponse head = object.response();
            // "bytes 0-1048575/total" when ranged, otherwise the whole object was returned
            long total = head.contentRange() != null
                    ? Long.parseLong(head.contentRange().substring(head.contentRange().indexOf('/') + 1))
                    : head.contentLength();
            return Map.of("text", object.asString(StandardCharsets.UTF_8), "truncated", total > MAX_TEXT_BYTES);
        } catch (RuntimeException e) {
            log.error("Get text content failed", e);
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to read file content");
        }
    }

    @DeleteMapping("/{key}")
    ResponseEntity<Void> delete(
            @RequestAttribute(AuthInterceptor.USER_ATTRIBUTE) AuthUser user, @PathVariable String key) {
        try {
            storage.delete(userPrefix(user) + key);
        } catch (RuntimeException e) {
            log.error("Delete failed", e);
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete file from Backblaze");
        }
        return ResponseEntity.noContent().build();
    }

    private static String userPrefix(AuthUser user) {
        return user.id() + "/";
    }
}
