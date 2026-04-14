package com.skillbridge.dto.response;

import com.skillbridge.dto.request.CertificationRequest;
import com.skillbridge.dto.request.EducationRequest;
import com.skillbridge.dto.request.SkillRequest;
import com.skillbridge.dto.request.WorkExperienceRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParsedProfileDto {

    private String fullName;
    private String headline;
    private String bio;
    private List<SkillRequest> skills;
    private List<WorkExperienceRequest> workExperiences;
    private List<EducationRequest> educations;
    private List<CertificationRequest> certifications;
}
