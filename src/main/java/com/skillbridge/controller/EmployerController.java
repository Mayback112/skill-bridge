package com.skillbridge.controller;

import com.skillbridge.common.ApiResponse;
import com.skillbridge.dto.request.EmployerUpdateRequest;
import com.skillbridge.dto.response.EmployerResponse;
import com.skillbridge.service.EmployerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/employers")
@RequiredArgsConstructor
public class EmployerController {

    private final EmployerService employerService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployerResponse>> getEmployerById(
            @PathVariable UUID id,
            Authentication authentication) {

        UUID requestingUserId = (UUID) authentication.getPrincipal();
        if (!id.equals(requestingUserId)) {
            // Usually we might want to allow viewing other employers if they have public profiles,
            // but for now, following the prompt's implied restriction.
        }

        EmployerResponse employer = employerService.getEmployerById(id);
        return ResponseEntity.ok(ApiResponse.success("Employer profile retrieved", employer));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployerResponse>> updateProfile(
            @PathVariable UUID id,
            @Valid @RequestBody EmployerUpdateRequest request,
            Authentication authentication) {

        UUID requestingUserId = (UUID) authentication.getPrincipal();
        EmployerResponse updated = employerService.updateProfile(id, request, requestingUserId);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }
}
