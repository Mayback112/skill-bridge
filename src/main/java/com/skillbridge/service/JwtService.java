package com.skillbridge.service;

import com.skillbridge.enums.Role;
import com.skillbridge.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtUtil jwtUtil;

    public String issueToken(UUID userId, String email, Role role) {
        return jwtUtil.generateToken(userId, email, role);
    }

    public String issueVerificationToken(UUID userId, String email) {
        return jwtUtil.generateVerificationToken(userId, email);
    }
}
