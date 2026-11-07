package com.luminabox.security;

import com.luminabox.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/** HS256 tokens with the same claims (sub, email, name) the Node server issued. */
@Service
public class JwtService {
    private static final Duration TTL = Duration.ofDays(7);

    private final SecretKey key;

    public JwtService(@Value("${app.jwt-secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String sign(User user) {
        Date now = new Date();
        return Jwts.builder()
                .subject(user.getId())
                .claim("email", user.getEmail())
                .claim("name", user.getName())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + TTL.toMillis()))
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    /** @throws JwtException if the token is malformed, tampered with or expired */
    public AuthUser verify(String token) {
        Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
        return new AuthUser(claims.getSubject(), claims.get("email", String.class), claims.get("name", String.class));
    }
}
