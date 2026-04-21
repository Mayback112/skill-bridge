package com.skillbridge.service;

import com.skillbridge.dto.request.*;
import com.skillbridge.dto.response.*;
import com.skillbridge.entity.*;
import com.skillbridge.enums.Role;
import com.skillbridge.exception.CustomExceptions.*;
import com.skillbridge.repository.*;
import com.skillbridge.util.EmailValidator;
import com.skillbridge.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GraduateService {

    private final GraduateRepository graduateRepository;
    private final EmployerRepository employerRepository;
    private final AdminRepository adminRepository;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final PdfParserService pdfParserService;
    private final CourseResourceService courseResourceService;
    private final EmailValidator emailValidator;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void register(GraduateRegisterRequest request) {
        if (!emailValidator.isValidUpsaEmail(request.getEmail())) {
            throw new InvalidEmailDomainException("Only UPSA email accounts (@upsa.edu.gh) are allowed");
        }
        if (graduateRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("An account with this email already exists");
        }

        Graduate graduate = Graduate.builder()
            .fullName(request.getFullName())
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .isVerified(false)
            .build();

        graduate = graduateRepository.save(graduate);

        String verificationToken = jwtService.issueVerificationToken(graduate.getId(), graduate.getEmail());
        emailService.sendVerificationEmail(graduate.getEmail(), graduate.getFullName(), verificationToken);
    }

    @Transactional
    public void verifyEmail(String token) {
        if (!jwtUtil.isTokenValid(token) || !jwtUtil.isVerificationToken(token)) {
            throw new UnauthorizedException("Invalid or expired verification link");
        }

        UUID graduateId = jwtUtil.extractUserId(token);
        Graduate graduate = graduateRepository.findById(graduateId)
            .orElseThrow(() -> new EntityNotFoundException("Graduate not found"));

        graduate.setVerified(true);
        graduateRepository.save(graduate);
    }

    public AuthResponse login(GraduateLoginRequest request) {
        Graduate graduate = graduateRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!graduate.isVerified()) {
            throw new EmailNotVerifiedException("Please verify your email before logging in");
        }
        if (!passwordEncoder.matches(request.getPassword(), graduate.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtService.issueToken(graduate.getId(), graduate.getEmail(), Role.GRADUATE);
        boolean isProfileComplete = graduate.getHeadline() != null && !graduate.getHeadline().isEmpty();
        
        return AuthResponse.builder()
            .token(token)
            .user(AuthResponse.UserResponse.builder()
                .id(graduate.getId())
                .email(graduate.getEmail())
                .fullName(graduate.getFullName())
                .role(Role.GRADUATE)
                .isProfileComplete(isProfileComplete)
                .build())
            .build();
    }

    public boolean isProfileComplete(UUID userId) {
        Graduate graduate = graduateRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("Graduate not found"));
        return graduate.getHeadline() != null && !graduate.getHeadline().isEmpty();
    }

    public List<GraduateCardResponse> getAllGraduates() {
        return graduateRepository.findAll().stream()
            .filter(Graduate::isVerified)
            .map(this::toCardResponse)
            .collect(Collectors.toList());
    }

    public GraduateResponse getGraduateById(UUID id) {
        Graduate graduate = graduateRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Graduate not found"));
        return toFullResponse(graduate);
    }

    @Transactional
    public GraduateResponse updateProfile(UUID id, GraduateUpdateRequest request, UUID requestingUserId) {
        if (!id.equals(requestingUserId)) {
            throw new UnauthorizedException("You can only update your own profile");
        }

        Graduate graduate = graduateRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Graduate not found"));

        if (request.getFullName() != null) graduate.setFullName(request.getFullName());
        if (request.getProfilePicture() != null) graduate.setProfilePicture(request.getProfilePicture());
        if (request.getHeadline() != null) graduate.setHeadline(request.getHeadline());
        if (request.getBio() != null) graduate.setBio(request.getBio());
        if (request.getLinkedInUrl() != null) graduate.setLinkedInUrl(request.getLinkedInUrl());

        if (request.getSkills() != null) {
            graduate.getSkills().clear();
            request.getSkills().forEach(s -> {
                Skill skill = Skill.builder()
                    .graduate(graduate)
                    .skillName(s.getSkillName())
                    .proficiencyLevel(s.getProficiencyLevel())
                    .build();
                graduate.getSkills().add(skill);
            });
        }

        if (request.getJobsCanDo() != null) {
            graduate.getJobsCanDo().clear();
            request.getJobsCanDo().forEach(j -> {
                JobCanDo jobCanDo = JobCanDo.builder()
                    .graduate(graduate)
                    .jobTitle(j.getJobTitle())
                    .build();
                graduate.getJobsCanDo().add(jobCanDo);
            });
        }

        if (request.getEducations() != null) {
            graduate.getEducations().clear();
            request.getEducations().forEach(e -> {
                Education edu = Education.builder()
                    .graduate(graduate)
                    .institution(e.getInstitution())
                    .degree(e.getDegree())
                    .fieldOfStudy(e.getFieldOfStudy())
                    .startDate(e.getStartDate())
                    .endDate(e.getEndDate())
                    .build();
                graduate.getEducations().add(edu);
            });
        }

        if (request.getWorkExperiences() != null) {
            graduate.getWorkExperiences().clear();
            request.getWorkExperiences().forEach(w -> {
                WorkExperience we = WorkExperience.builder()
                    .graduate(graduate)
                    .jobTitle(w.getJobTitle())
                    .company(w.getCompany())
                    .startDate(w.getStartDate())
                    .endDate(w.getEndDate())
                    .description(w.getDescription())
                    .build();
                graduate.getWorkExperiences().add(we);
            });
        }

        if (request.getCertifications() != null) {
            graduate.getCertifications().clear();
            request.getCertifications().forEach(c -> {
                Certification cert = Certification.builder()
                    .graduate(graduate)
                    .name(c.getName())
                    .issuingOrganization(c.getIssuingOrganization())
                    .issueDate(c.getIssueDate())
                    .build();
                graduate.getCertifications().add(cert);
            });
        }

        return toFullResponse(graduateRepository.save(graduate));
    }

    public ParsedProfileDto uploadAndParsePdf(MultipartFile file) {
        return pdfParserService.parseLinkedInPdf(file);
    }

    public Object getUserProfile(UUID userId) {
        // Try Graduate
        var grad = graduateRepository.findById(userId);
        if (grad.isPresent()) return toFullResponse(grad.get());

        // Try Employer
        var emp = employerRepository.findById(userId);
        if (emp.isPresent()) return toEmployerResponse(emp.get());

        // Try Admin
        var admin = adminRepository.findById(userId);
        if (admin.isPresent()) return toAdminResponse(admin.get());

        throw new EntityNotFoundException("User not found");
    }

    private GraduateCardResponse toCardResponse(Graduate g) {
        return GraduateCardResponse.builder()
            .id(g.getId())
            .fullName(g.getFullName())
            .profilePicture(g.getProfilePicture())
            .headline(g.getHeadline())
            .skills(g.getSkills().stream().map(s -> SkillResponse.builder()
                .id(s.getId()).skillName(s.getSkillName()).proficiencyLevel(s.getProficiencyLevel()).build())
                .collect(Collectors.toList()))
            .jobsCanDo(g.getJobsCanDo().stream().map(JobCanDo::getJobTitle).collect(Collectors.toList()))
            .build();
    }

    private GraduateResponse toFullResponse(Graduate g) {
        List<String> skillNames = g.getSkills().stream()
            .map(Skill::getSkillName)
            .collect(Collectors.toList());

        boolean isProfileComplete = g.getHeadline() != null && !g.getHeadline().isEmpty();

        return GraduateResponse.builder()
            .id(g.getId())
            .fullName(g.getFullName())
            .email(g.getEmail())
            .profilePicture(g.getProfilePicture())
            .headline(g.getHeadline())
            .bio(g.getBio())
            .linkedInUrl(g.getLinkedInUrl())
            .isVerified(g.isVerified())
            .isProfileComplete(isProfileComplete)
            .role(Role.GRADUATE)
            .skills(g.getSkills().stream().map(s -> SkillResponse.builder()
                .id(s.getId()).skillName(s.getSkillName()).proficiencyLevel(s.getProficiencyLevel()).build())
                .collect(Collectors.toList()))
            .jobsCanDo(g.getJobsCanDo().stream().map(JobCanDo::getJobTitle).collect(Collectors.toList()))
            .educations(g.getEducations().stream().map(e -> EducationResponse.builder()
                .id(e.getId()).institution(e.getInstitution()).degree(e.getDegree())
                .fieldOfStudy(e.getFieldOfStudy()).startDate(e.getStartDate()).endDate(e.getEndDate()).build())
                .collect(Collectors.toList()))
            .workExperiences(g.getWorkExperiences().stream().map(w -> WorkExperienceResponse.builder()
                .id(w.getId()).jobTitle(w.getJobTitle()).company(w.getCompany())
                .startDate(w.getStartDate()).endDate(w.getEndDate()).description(w.getDescription()).build())
                .collect(Collectors.toList()))
            .certifications(g.getCertifications().stream().map(c -> CertificationResponse.builder()
                .id(c.getId()).name(c.getName()).issuingOrganization(c.getIssuingOrganization()).issueDate(c.getIssueDate()).build())
                .collect(Collectors.toList()))
            .recommendedCourses(courseResourceService.getRecommendedCourses(skillNames))
            .createdAt(g.getCreatedAt())
            .build();
    }

    private EmployerResponse toEmployerResponse(Employer e) {
        return EmployerResponse.builder()
            .id(e.getId())
            .companyName(e.getCompanyName())
            .fullName(e.getCompanyName())
            .email(e.getEmail())
            .profilePicture(e.getProfilePicture())
            .isVerified(e.isVerified())
            .role(Role.EMPLOYER)
            .build();
    }

    private AdminResponse toAdminResponse(Admin a) {
        return AdminResponse.builder()
            .id(a.getId())
            .email(a.getEmail())
            .fullName("Administrator")
            .role(Role.ADMIN)
            .build();
    }
}
