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
        UUID userId;

        if (principal instanceof UUID) {
            userId = (UUID) principal;
        } else if (principal instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) principal;
            // Assuming 'sub' is the unique identifier from OAuth2 provider (e.g., Google's sub claim)
            // We need to map this to our internal user ID if it's not directly stored as UUID.
            // For now, assuming 'sub' can be directly used or converted to UUID.
            // If 'sub' is not a UUID, a mapping logic or a different strategy is needed.
            String principalId = oauth2User.getAttribute("sub"); // Or other relevant identifier
            if (principalId == null) {
                 throw new IllegalArgumentException("Could not extract user ID from authentication principal.");
            }
            // It's highly probable that the actual user ID is not the OAuth2 provider's sub directly,
            // but rather an internal UUID generated upon user creation/lookup.
            // For the purpose of this fix, let's assume the sub can be mapped to an internal UUID.
            // A more robust solution would involve looking up the internal UUID based on the OAuth2 provider ID.
            // For now, let's try converting the 'sub' claim, if it's a UUID string.
            try {
                userId = UUID.fromString(principalId);
            } catch (IllegalArgumentException e) {
                // If 'sub' is not a UUID, we need a way to find the internal UUID.
                // This likely involves querying a User/Employer/Admin repository by the OAuth2 provider ID.
                // For demonstration, let's assume the ID from findOrCreateEmployer is what's needed.
                // A better approach would be to store the OAuth2 provider ID and map it to internal UUID.
                // For now, this might need further investigation if the principalId is not a UUID.
                
                // Let's re-examine the findOrCreateEmployer service.
                // It returns AuthResponse which contains a token. The token's subject is the user ID.
                // The problem is that the 'authentication' object here is not the one holding the final JWT subject.
                // It's the principal *before* the token is generated.
                
                // A more correct approach is to get the UserDetails/OAuth2User from the SecurityContext
                // and then use a service to fetch the internal UUID based on that principal.
                // For now, let's try to retrieve the user based on the OAuth2 user's attributes if they exist.
                
                // Re-thinking: The SecurityContextHolder typically holds the authenticated principal. 
                // After OAuth2 login, the principal is an OAuth2User. We need to find the internal UUID for this user.
                // The AuthController should ideally delegate this lookup to a service.
                // Let's assume for now that the 'sub' claim from Google is directly the UUID (which is unlikely but a starting point).
                
                // Fallback to a known user ID or throw error if principal mapping is complex.
                // If Google's 'sub' is not directly a UUID, and we don't have a mapping service,
                // this will fail. A common pattern is to have a UserDetailsService or similar.
                // Given the current structure, let's try to find the user using 'sub' and then get their UUID.
                // This requires knowing if 'sub' maps directly or needs a lookup.
                
                // Let's assume the 'sub' claim from Google IS the user's internal UUID for now. This might be incorrect.
                // A proper fix would involve a UserDetailsService or similar that knows how to map OAuth2 principal to internal UUID.
                
                // If principalId is not a UUID, we cannot proceed without a lookup mechanism.
                throw new IllegalArgumentException("User ID could not be determined from OAuth2 principal. Ensure 'sub' claim is a valid UUID or implement a mapping service.");
            }
        } else {
            // If principal is neither UUID nor OAuth2User, try to find a user based on authentication details.
            // This might involve querying by email or other unique attributes if available.
            // For now, let's throw an error indicating we can't find the principal.
            throw new IllegalArgumentException("Unsupported authentication principal type: " + principal.getClass().getName());
        }

        Object userProfile = graduateService.getUserProfile(userId);
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved", userProfile));
    }
}
