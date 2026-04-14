package com.skillbridge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {

    private long totalGraduates;
    private long totalEmployers;
    private long totalJobPostings;
    private long totalActiveJobPostings;
    private long totalCourseResources;
    private Map<String, Long> topSkills;
}
