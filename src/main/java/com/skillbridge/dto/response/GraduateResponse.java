package com.skillbridge.dto.response;

import com.skillbridge.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GraduateResponse {

    private UUID id;
    private String fullName;
    private String email;
    private String profilePicture;
    private String headline;
    private String bio;
    private String linkedInUrl;
    private boolean isVerified;
    private boolean isProfileComplete;
    @Builder.Default
    private Role role = Role.GRADUATE;
    private List<SkillResponse> skills;
    private List<String> jobsCanDo;
    private List<EducationResponse> educations;
    private List<WorkExperienceResponse> workExperiences;
    private List<CertificationResponse> certifications;
    private List<CourseResourceResponse> recommendedCourses;
    private LocalDateTime createdAt;
}
