package com.skillbridge.util;

import com.skillbridge.enums.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(secret));
    }

    public String generateToken(UUID userId, String email, Role role) {
        return Jwts.builder()
            .subject(userId.toString())
            .claim("email", email)
            .claim("role", role.name())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey())
            .compact();
    }

    public String generateVerificationToken(UUID userId, String email) {
        return Jwts.builder()
            .subject(userId.toString())
            .claim("email", email)
            .claim("type", "EMAIL_VERIFICATION")
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 86_400_000L)) // 24 hours
            .signWith(getSigningKey())
            .compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public UUID extractUserId(String token) {
        return UUID.fromString(extractAllClaims(token).getSubject());
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).get("email", String.class);
    }

    public Role extractRole(String token) {
        return Role.valueOf(extractAllClaims(token).get("role", String.class));
    }

    public boolean isTokenValid(String token) {
        try {
            return extractAllClaims(token).getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isVerificationToken(String token) {
        try {
            String type = extractAllClaims(token).get("type", String.class);
            return "EMAIL_VERIFICATION".equals(type);
        } catch (Exception e) {
            return false;
        }
    }
}
