package com.skillbridge.controller;

import com.skillbridge.common.ApiResponse;
import com.skillbridge.entity.Employer;
import com.skillbridge.service.EmployerService;
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
    public ResponseEntity<ApiResponse<Employer>> getEmployerById(
            @PathVariable UUID id,
            Authentication authentication) {

        UUID requestingUserId = (UUID) authentication.getPrincipal();
        if (!id.equals(requestingUserId)) {
            return ResponseEntity.status(403)
                .body(ApiResponse.error("You can only view your own employer profile"));
        }

        Employer employer = employerService.getEmployerById(id);
        return ResponseEntity.ok(ApiResponse.success("Employer profile retrieved", employer));
    }
}
