package com.skillbridge.auth.controller;

import com.skillbridge.common.ApiResponse;
import com.skillbridge.dto.request.AdminLoginRequest;
import com.skillbridge.dto.request.GraduateLoginRequest;
import com.skillbridge.dto.request.GraduateRegisterRequest;
import com.skillbridge.dto.response.AuthResponse;
import com.skillbridge.service.AdminService;
import com.skillbridge.service.GraduateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final GraduateService graduateService;
    private final AdminService adminService;

    // ── Graduate Auth ─────────────────────────────────────────────

    @PostMapping("/graduate/register")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody GraduateRegisterRequest request) {
        graduateService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Registration successful. Please check your UPSA email to verify your account."));
    }

    @GetMapping("/graduate/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestParam String token) {
        graduateService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.success("Email verified successfully. You can now log in."));
    }

    @PostMapping("/graduate/login")
    public ResponseEntity<ApiResponse<AuthResponse>> graduateLogin(@Valid @RequestBody GraduateLoginRequest request) {
        AuthResponse authResponse = graduateService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> unifiedLogin(@Valid @RequestBody GraduateLoginRequest request) {
        try {
            // Try Graduate first
            AuthResponse authResponse = graduateService.login(request);
            return ResponseEntity.ok(ApiResponse.success("Graduate login successful", authResponse));
        } catch (Exception e) {
            // Try Admin next
            try {
                AdminLoginRequest adminRequest = new AdminLoginRequest();
                adminRequest.setEmail(request.getEmail());
                adminRequest.setPassword(request.getPassword());
                AuthResponse authResponse = adminService.login(adminRequest);
                return ResponseEntity.ok(ApiResponse.success("Admin login successful", authResponse));
            } catch (Exception e2) {
                // If both fail, rethrow original or a generic one
                throw e; 
            }
        }
    }

    // ── Employer Auth (Google OAuth2) ─────────────────────────────

    @GetMapping("/employer/google")
    public ResponseEntity<Void> googleLogin() {
        // Redirect to Spring Security's OAuth2 authorization endpoint
        return ResponseEntity.status(HttpStatus.FOUND)
            .header("Location", "/oauth2/authorization/google")
            .build();
    }

    // ── Admin Auth ────────────────────────────────────────────────

    @PostMapping("/admin/login")
    public ResponseEntity<ApiResponse<AuthResponse>> adminLogin(@Valid @RequestBody AdminLoginRequest request) {
        AuthResponse authResponse = adminService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Admin login successful", authResponse));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Object>> getCurrentUser(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof UUID)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Invalid authentication principal"));
        }

        UUID userId = (UUID) principal;
        Object userProfile = graduateService.getUserProfile(userId);
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved", userProfile));
    }
}
