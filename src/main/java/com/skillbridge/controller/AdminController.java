package com.skillbridge.controller;

import com.skillbridge.common.ApiResponse;
import com.skillbridge.dto.response.AdminStatsResponse;
import com.skillbridge.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getStats() {
        AdminStatsResponse stats = adminService.getStats();
        return ResponseEntity.ok(ApiResponse.success("Platform stats retrieved", stats));
    }

    @DeleteMapping("/graduates/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGraduate(@PathVariable UUID id) {
        adminService.deleteGraduate(id);
        return ResponseEntity.ok(ApiResponse.success("Graduate removed from platform"));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteJobPosting(@PathVariable UUID id) {
        adminService.deleteJobPosting(id);
        return ResponseEntity.ok(ApiResponse.success("Job posting removed from platform"));
    }
}
