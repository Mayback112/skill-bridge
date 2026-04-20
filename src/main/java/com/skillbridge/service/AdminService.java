package com.skillbridge.service;

import com.skillbridge.dto.request.AdminLoginRequest;
import com.skillbridge.dto.response.AdminStatsResponse;
import com.skillbridge.dto.response.AuthResponse;
import com.skillbridge.entity.Admin;
import com.skillbridge.enums.Role;
import com.skillbridge.exception.CustomExceptions.*;
import com.skillbridge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final GraduateRepository graduateRepository;
    private final EmployerRepository employerRepository;
    private final JobPostingRepository jobPostingRepository;
    private final CourseResourceRepository courseResourceRepository;
    private final SkillRepository skillRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-email}")
    private String defaultAdminEmail;

    @Value("${app.admin.default-password}")
    private String defaultAdminPassword;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedDefaultAdmin() {
        if (!adminRepository.existsByEmail(defaultAdminEmail)) {
            Admin admin = Admin.builder()
                .email(defaultAdminEmail)
                .passwordHash(passwordEncoder.encode(defaultAdminPassword))
                .build();
            adminRepository.save(admin);
        }
    }

    public AuthResponse login(AdminLoginRequest request) {
        Admin admin = adminRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String token = jwtService.issueToken(admin.getId(), admin.getEmail(), Role.ADMIN);
        return AuthResponse.builder()
            .token(token)
            .user(AuthResponse.UserResponse.builder()
                .id(admin.getId())
                .email(admin.getEmail())
                .fullName("Administrator")
                .role(Role.ADMIN)
                .isProfileComplete(true)
                .build())
            .build();
    }

    public AdminStatsResponse getStats() {
        List<Object[]> topSkillsRaw = skillRepository.findTopSkills();
        Map<String, Long> topSkills = new LinkedHashMap<>();
        for (Object[] row : topSkillsRaw) {
            if (topSkills.size() >= 10) break;
            topSkills.put((String) row[0], (Long) row[1]);
        }

        return AdminStatsResponse.builder()
            .totalGraduates(graduateRepository.countVerified())
            .totalEmployers(employerRepository.count())
            .totalJobPostings(jobPostingRepository.count())
            .totalActiveJobPostings(jobPostingRepository.findByIsActiveTrue().size())
            .totalCourseResources(courseResourceRepository.count())
            .topSkills(topSkills)
            .build();
    }

    @Transactional
    public void deleteGraduate(UUID id) {
        if (!graduateRepository.existsById(id)) {
            throw new EntityNotFoundException("Graduate not found");
        }
        graduateRepository.deleteById(id);
    }

    @Transactional
    public void deleteJobPosting(UUID id) {
        if (!jobPostingRepository.existsById(id)) {
            throw new EntityNotFoundException("Job posting not found");
        }
        jobPostingRepository.deleteById(id);
    }
}
