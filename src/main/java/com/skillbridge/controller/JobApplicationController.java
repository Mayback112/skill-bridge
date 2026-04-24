package com.skillbridge.controller;

import com.skillbridge.common.ApiResponse;
import com.skillbridge.dto.response.JobApplicationResponse;
import com.skillbridge.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/job-applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @PostMapping("/apply/{jobPostingId}")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> applyForJob(
            @PathVariable UUID jobPostingId,
            Authentication authentication) {

        UUID graduateId = (UUID) authentication.getPrincipal();
        JobApplicationResponse application = jobApplicationService.applyForJob(jobPostingId, graduateId);
        return ResponseEntity.ok(ApiResponse.success("Application submitted successfully", application));
    }

    @GetMapping("/job/{jobPostingId}")
    public ResponseEntity<ApiResponse<List<JobApplicationResponse>>> getApplicationsByJob(
            @PathVariable UUID jobPostingId,
            Authentication authentication) {

        List<JobApplicationResponse> applications = jobApplicationService.getApplicationsByJobPosting(jobPostingId);
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved", applications));
    }

    @GetMapping("/employer")
    public ResponseEntity<ApiResponse<List<JobApplicationResponse>>> getEmployerApplications(
            Authentication authentication) {

        UUID employerId = (UUID) authentication.getPrincipal();
        List<JobApplicationResponse> applications = jobApplicationService.getApplicationsByEmployer(employerId);
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved", applications));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<ApiResponse<List<JobApplicationResponse>>> getGraduateApplications(
            Authentication authentication) {

        UUID graduateId = (UUID) authentication.getPrincipal();
        List<JobApplicationResponse> applications = jobApplicationService.getApplicationsByGraduate(graduateId);
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved", applications));
    }

    @GetMapping("/check/{jobPostingId}")
    public ResponseEntity<ApiResponse<Boolean>> checkApplicationStatus(
            @PathVariable UUID jobPostingId,
            Authentication authentication) {

        UUID graduateId = (UUID) authentication.getPrincipal();
        boolean hasApplied = jobApplicationService.hasApplied(jobPostingId, graduateId);
        return ResponseEntity.ok(ApiResponse.success("Application status checked", hasApplied));
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<ApiResponse<Void>> updateApplicationStatus(
            @PathVariable UUID applicationId,
            @RequestBody StatusUpdateRequest request,
            Authentication authentication) {

        jobApplicationService.updateApplicationStatus(applicationId, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Application status updated"));
    }

    @lombok.Data
    public static class StatusUpdateRequest {
        private String status;
    }
}
