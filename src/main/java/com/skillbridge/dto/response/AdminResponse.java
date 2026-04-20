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
public class AdminResponse {
    private UUID id;
    private String email;
    @Builder.Default
    private String fullName = "Administrator";
    @Builder.Default
    private Role role = Role.ADMIN;
}
