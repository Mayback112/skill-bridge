package com.skillbridge.service;

import com.skillbridge.dto.request.EmployerUpdateRequest;
import com.skillbridge.dto.response.AuthResponse;
import com.skillbridge.dto.response.EmployerResponse;
import com.skillbridge.entity.Employer;
import com.skillbridge.enums.Role;
import com.skillbridge.exception.CustomExceptions.*;
import com.skillbridge.repository.EmployerRepository;
import com.skillbridge.util.EmailValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger; // Added import
import org.slf4j.LoggerFactory; // Added import

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmployerService {

    private static final Logger log = LoggerFactory.getLogger(EmployerService.class); // Added logger declaration

    private final EmployerRepository employerRepository;
    private final JwtService jwtService;
    private final EmailValidator emailValidator;

    @Transactional
    public AuthResponse findOrCreateEmployer(String googleId, String email, String companyName, String profilePicture) {
        if (!emailValidator.isValidGmailEmail(email)) {
            throw new InvalidEmailDomainException("Only Gmail accounts (@gmail.com) are allowed for employers");
        }

        Employer employer = employerRepository.findByGoogleId(googleId)
                .orElseGet(() -> {
                    Employer newEmployer = Employer.builder()
                            .googleId(googleId)
                            .email(email)
                            .companyName(companyName != null ? companyName : email.split("@")[0])
                            .profilePicture(profilePicture)
                            .isVerified(true)
                            .build();
                    try {
                        return employerRepository.save(newEmployer);
                    } catch (Exception e) {
                        log.error("Failed to save new employer with email {}: {}", email, e.getMessage(), e);
                        throw new RuntimeException("Failed to create employer account", e);
                    }
                });

        String token;
        try {
            token = jwtService.issueToken(employer.getId(), employer.getEmail(), Role.EMPLOYER);
        } catch (Exception e) {
            log.error("Failed to issue JWT for employer with email {}: {}", email, e.getMessage(), e);
            throw new RuntimeException("Failed to generate authentication token", e);
        }

        AuthResponse.UserResponse userResponse = AuthResponse.UserResponse.builder()
                .id(employer.getId())
                .email(employer.getEmail())
                .role(Role.EMPLOYER)
                .fullName(employer.getCompanyName())
                .isProfileComplete(employer.isVerified())
                .build();

        return AuthResponse.builder()
                .token(token)
                .user(userResponse)
                .build();
    }

    public EmployerResponse getEmployerById(UUID id) {
        Employer employer = employerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employer not found"));
        return toResponse(employer);
    }

    @Transactional
    public EmployerResponse updateProfile(UUID id, EmployerUpdateRequest request, UUID requestingUserId) {
        if (!id.equals(requestingUserId)) {
            throw new UnauthorizedException("You can only update your own profile");
        }

        Employer employer = employerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employer not found"));

        if (request.getCompanyName() != null) employer.setCompanyName(request.getCompanyName());
        if (request.getProfilePicture() != null) employer.setProfilePicture(request.getProfilePicture());

        return toResponse(employerRepository.save(employer));
    }

    private EmployerResponse toResponse(Employer e) {
        return EmployerResponse.builder()
                .id(e.getId())
                .companyName(e.getCompanyName())
                .email(e.getEmail())
                .profilePicture(e.getProfilePicture())
                .isVerified(e.isVerified())
                .build();
    }
}