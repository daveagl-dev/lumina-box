package com.luminabox.security;

import com.luminabox.error.ApiException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/** Requires a valid Bearer token and exposes it to controllers as the "user" request attribute. */
@Component
public class AuthInterceptor implements HandlerInterceptor {
    public static final String USER_ATTRIBUTE = "user";

    private final JwtService jwt;

    public AuthInterceptor(JwtService jwt) {
        this.jwt = jwt;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.startsWith("Bearer ") || header.length() == 7) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        try {
            request.setAttribute(USER_ATTRIBUTE, jwt.verify(header.substring(7)));
        } catch (JwtException | IllegalArgumentException e) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
        }
        return true;
    }
}
