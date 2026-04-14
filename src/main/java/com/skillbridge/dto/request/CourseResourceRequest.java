package com.skillbridge.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CourseResourceRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "URL is required")
    private String url;

    private String platform;

    @NotBlank(message = "Skill tag is required")
    private String skillTag;
}
