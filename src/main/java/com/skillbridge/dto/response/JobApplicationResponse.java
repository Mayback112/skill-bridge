package com.skillbridge.dto.response;

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
public class JobApplicationResponse {
    private UUID id;
    private UUID jobPostingId;
    private String jobTitle;
    private String companyName;
    private UUID graduateId;
    private String graduateFullName;
    private String graduateEmail;
    private String graduateHeadline;
    private String graduateProfilePicture;
    private List<SkillResponse> graduateSkills;
    private String status;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}
