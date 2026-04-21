package com.skillbridge.controller;

import com.skillbridge.common.ApiResponse;
import com.skillbridge.dto.request.JobPostingRequest;
import com.skillbridge.dto.response.JobPostingResponse;
import com.skillbridge.service.JobPostingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobPostingController {

    private final JobPostingService jobPostingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<JobPostingResponse>>> getAllJobs() {
        List<JobPostingResponse> jobs = jobPostingService.getAllActiveJobs();
        return ResponseEntity.ok(ApiResponse.success("Job postings retrieved", jobs));
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<ApiResponse<List<JobPostingResponse>>> getMyJobs(Authentication authentication) {
        UUID employerId = (UUID) authentication.getPrincipal();
        List<JobPostingResponse> jobs = jobPostingService.getJobsByEmployer(employerId);
        return ResponseEntity.ok(ApiResponse.success("Your job postings retrieved", jobs));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<JobPostingResponse>>> getRecommendations(Authentication authentication) {
        UUID graduateId = (UUID) authentication.getPrincipal();
        List<JobPostingResponse> recommendations = jobPostingService.getRecommendedJobsForGraduate(graduateId);
        return ResponseEntity.ok(ApiResponse.success("Recommended jobs retrieved", recommendations));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobPostingResponse>> getJobById(@PathVariable UUID id) {
        JobPostingResponse job = jobPostingService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.success("Job posting retrieved", job));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<JobPostingResponse>> createJob(
            @Valid @RequestBody JobPostingRequest request,
            Authentication authentication) {

        UUID employerId = (UUID) authentication.getPrincipal();
        JobPostingResponse job = jobPostingService.createJob(request, employerId);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Job posting created successfully", job));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<JobPostingResponse>> updateJob(
            @PathVariable UUID id,
            @Valid @RequestBody JobPostingRequest request,
            Authentication authentication) {

        UUID employerId = (UUID) authentication.getPrincipal();
        JobPostingResponse job = jobPostingService.updateJob(id, request, employerId);
        return ResponseEntity.ok(ApiResponse.success("Job posting updated successfully", job));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteJob(
            @PathVariable UUID id,
            Authentication authentication) {

        UUID employerId = (UUID) authentication.getPrincipal();
        jobPostingService.deleteJob(id, employerId);
        return ResponseEntity.ok(ApiResponse.success("Job posting deleted successfully"));
    }
}
