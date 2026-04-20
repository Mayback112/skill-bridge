package com.skillbridge.dto.response;

import com.skillbridge.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployerResponse {
    private UUID id;
    private String companyName;
    private String fullName; // Map companyName to fullName for generic User type
    private String email;
    private String profilePicture;
    private boolean isVerified;
    @Builder.Default
    private Role role = Role.EMPLOYER;
}
