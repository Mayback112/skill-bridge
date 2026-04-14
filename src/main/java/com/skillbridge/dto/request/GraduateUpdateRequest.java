package com.skillbridge.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class GraduateUpdateRequest {

    private String fullName;

    private String profilePicture;

    private String headline;

    private String bio;

    @Pattern(
        regexp = "^(https?://)?(www\\.)?linkedin\\.com/.*$",
        message = "Invalid LinkedIn URL format"
    )
    private String linkedInUrl;

    @Valid
    @Size(min = 1, message = "At least one skill is required")
    private List<SkillRequest> skills;

    @Valid
    private List<JobCanDoRequest> jobsCanDo;

    @Valid
    private List<EducationRequest> educations;

    @Valid
    private List<WorkExperienceRequest> workExperiences;

    @Valid
    private List<CertificationRequest> certifications;
}
