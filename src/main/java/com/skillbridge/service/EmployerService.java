package com.skillbridge.service;

import com.skillbridge.dto.response.AuthResponse;
import com.skillbridge.entity.Employer;
import com.skillbridge.enums.Role;
import com.skillbridge.exception.CustomExceptions.*;
import com.skillbridge.repository.EmployerRepository;
import com.skillbridge.util.EmailValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EmployerService {

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
                return employerRepository.save(newEmployer);
            });

        String token = jwtService.issueToken(employer.getId(), employer.getEmail(), Role.EMPLOYER);
        return AuthResponse.builder()
            .token(token)
            .userId(employer.getId())
            .email(employer.getEmail())
            .role(Role.EMPLOYER)
            .build();
    }

    public Employer getEmployerById(java.util.UUID id) {
        return employerRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Employer not found"));
    }
}
