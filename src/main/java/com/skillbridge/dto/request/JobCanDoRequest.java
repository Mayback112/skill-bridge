package com.skillbridge.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JobCanDoRequest {

    @NotBlank(message = "Job title is required")
    private String jobTitle;
}
