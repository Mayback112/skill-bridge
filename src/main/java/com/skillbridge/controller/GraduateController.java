package com.skillbridge.controller;

import com.skillbridge.common.ApiResponse;
import com.skillbridge.dto.request.GraduateUpdateRequest;
import com.skillbridge.dto.response.GraduateCardResponse;
import com.skillbridge.dto.response.GraduateResponse;
import com.skillbridge.dto.response.ParsedProfileDto;
import com.skillbridge.service.GraduateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/graduates")
@RequiredArgsConstructor
public class GraduateController {

    private final GraduateService graduateService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GraduateCardResponse>>> getAllGraduates() {
        List<GraduateCardResponse> graduates = graduateService.getAllGraduates();
        return ResponseEntity.ok(ApiResponse.success("Graduates retrieved", graduates));
    }

    @GetMapping("/me/profile-status")
    public ResponseEntity<ApiResponse<Boolean>> checkProfileStatus(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        boolean isComplete = graduateService.isProfileComplete(userId);
        return ResponseEntity.ok(ApiResponse.success("Profile status retrieved", isComplete));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GraduateResponse>> getGraduateById(@PathVariable UUID id) {
        GraduateResponse graduate = graduateService.getGraduateById(id);
        return ResponseEntity.ok(ApiResponse.success("Graduate profile retrieved", graduate));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GraduateResponse>> updateProfile(
            @PathVariable UUID id,
            @Valid @RequestBody GraduateUpdateRequest request,
            Authentication authentication) {

        UUID requestingUserId = (UUID) authentication.getPrincipal();
        GraduateResponse updated = graduateService.updateProfile(id, request, requestingUserId);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PostMapping("/upload-pdf")
    public ResponseEntity<ApiResponse<ParsedProfileDto>> uploadPdf(
            @RequestParam("file") MultipartFile file) {

        ParsedProfileDto parsed = graduateService.uploadAndParsePdf(file);
        return ResponseEntity.ok(ApiResponse.success("PDF parsed successfully. Please review and confirm.", parsed));
    }
}
