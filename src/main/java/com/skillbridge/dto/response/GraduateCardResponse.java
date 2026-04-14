package com.skillbridge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GraduateCardResponse {

    private UUID id;
    private String fullName;
    private String profilePicture;
    private String headline;
    private List<SkillResponse> skills;
    private List<String> jobsCanDo;
}
