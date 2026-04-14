package com.skillbridge.controller;

import com.skillbridge.common.ApiResponse;
import com.skillbridge.dto.request.CourseResourceRequest;
import com.skillbridge.dto.response.CourseResourceResponse;
import com.skillbridge.service.CourseResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseResourceController {

    private final CourseResourceService courseResourceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseResourceResponse>>> getCourses(
            @RequestParam(required = false) String skillTag) {

        List<CourseResourceResponse> courses = courseResourceService.getCourses(skillTag);
        return ResponseEntity.ok(ApiResponse.success("Course resources retrieved", courses));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CourseResourceResponse>> addCourse(
            @Valid @RequestBody CourseResourceRequest request,
            Authentication authentication) {

        UUID adminId = (UUID) authentication.getPrincipal();
        CourseResourceResponse course = courseResourceService.addCourse(request, adminId);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Course resource added successfully", course));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(
            @PathVariable UUID id) {

        courseResourceService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course resource deleted successfully"));
    }
}
