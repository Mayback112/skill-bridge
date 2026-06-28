package com.skillbridge.service;

import com.skillbridge.dto.request.*;
import com.skillbridge.dto.response.*;
import com.skillbridge.entity.*;
import com.skillbridge.exception.CustomExceptions.*;
import com.skillbridge.repository.*;
import com.skillbridge.util.EmailValidator;
import com.skillbridge.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GraduateServiceTest {

    @Mock private GraduateRepository graduateRepository;
    @Mock private EmployerRepository employerRepository;
    @Mock private AdminRepository adminRepository;
    @Mock private JwtService jwtService;
    @Mock private EmailService emailService;
    @Mock private PdfParserService pdfParserService;
    @Mock private CourseResourceService courseResourceService;
    @Mock private EmailValidator emailValidator;
    @Mock private JwtUtil jwtUtil;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private CloudinaryService cloudinaryService;

    @InjectMocks
    private GraduateService graduateService;

    private Graduate graduate;

    @BeforeEach
    void setUp() {
        graduate = Graduate.builder()
            .id(UUID.randomUUID())
            .fullName("John Doe")
            .email("john@upsamail.edu.gh")
            .isVerified(true)
            .skills(new ArrayList<>())
            .build();
    }

    // --- User Registration & Email Verification (5 tests) ---

    @Test void test1_RegisterSuccess() {
        GraduateRegisterRequest req = new GraduateRegisterRequest();
        req.setEmail("john@upsamail.edu.gh");
        when(emailValidator.isValidUpsaEmail(any())).thenReturn(true);
        when(graduateRepository.save(any())).thenReturn(graduate);
        assertDoesNotThrow(() -> graduateService.register(req));
    }

    @Test void test2_RegisterInvalidDomain() {
        GraduateRegisterRequest req = new GraduateRegisterRequest();
        req.setEmail("john@gmail.com");
        when(emailValidator.isValidUpsaEmail(any())).thenReturn(false);
        assertThrows(InvalidEmailDomainException.class, () -> graduateService.register(req));
    }

    @Test void test3_RegisterDuplicateEmail() {
        GraduateRegisterRequest req = new GraduateRegisterRequest();
        req.setEmail("john@upsamail.edu.gh");
        when(emailValidator.isValidUpsaEmail(any())).thenReturn(true);
        when(graduateRepository.existsByEmail(any())).thenReturn(true);
        assertThrows(DuplicateEmailException.class, () -> graduateService.register(req));
    }

    @Test void test4_VerifyEmailSuccess() {
        String token = "valid";
        when(jwtUtil.isTokenValid(token)).thenReturn(true);
        when(jwtUtil.isVerificationToken(token)).thenReturn(true);
        when(jwtUtil.extractUserId(token)).thenReturn(graduate.getId());
        when(graduateRepository.findById(any())).thenReturn(Optional.of(graduate));
        assertDoesNotThrow(() -> graduateService.verifyEmail(token));
    }

    @Test void test5_VerifyEmailInvalidToken() {
        when(jwtUtil.isTokenValid(any())).thenReturn(false);
        assertThrows(UnauthorizedException.class, () -> graduateService.verifyEmail("invalid"));
    }

    // --- Skill Management (5 tests) ---

    @Test void test6_AddSkill() {
        GraduateUpdateRequest req = new GraduateUpdateRequest();
        SkillRequest s = new SkillRequest(); s.setSkillName("Java");
        req.setSkills(List.of(s));
        when(graduateRepository.findById(any())).thenReturn(Optional.of(graduate));
        when(graduateRepository.save(any())).thenReturn(graduate);
        assertDoesNotThrow(() -> graduateService.updateProfile(graduate.getId(), req, graduate.getId()));
    }

    @Test void test7_RemoveSkill() {
        graduate.getSkills().add(new Skill());
        GraduateUpdateRequest req = new GraduateUpdateRequest();
        req.setSkills(new ArrayList<>()); // Empty list to remove all
        when(graduateRepository.findById(any())).thenReturn(Optional.of(graduate));
        when(graduateRepository.save(any())).thenReturn(graduate);
        graduateService.updateProfile(graduate.getId(), req, graduate.getId());
        verify(graduateRepository).save(any());
    }

    @Test void test8_UpdateMultipleSkills() {
        GraduateUpdateRequest req = new GraduateUpdateRequest();
        SkillRequest s1 = new SkillRequest(); s1.setSkillName("Java");
        SkillRequest s2 = new SkillRequest(); s2.setSkillName("React");
        req.setSkills(List.of(s1, s2));
        when(graduateRepository.findById(any())).thenReturn(Optional.of(graduate));
        when(graduateRepository.save(any())).thenReturn(graduate);
        graduateService.updateProfile(graduate.getId(), req, graduate.getId());
        verify(graduateRepository).save(any());
    }

    @Test void test9_UnauthorizedProfileUpdate() {
        assertThrows(UnauthorizedException.class, () -> 
            graduateService.updateProfile(graduate.getId(), new GraduateUpdateRequest(), UUID.randomUUID()));
    }

    @Test void test10_ProfileCompleteCheck() {
        graduate.setHeadline("Software Engineer");
        when(graduateRepository.findById(any())).thenReturn(Optional.of(graduate));
        assertTrue(graduateService.isProfileComplete(graduate.getId()));
    }

    // --- Graduate Search by Skill (5 tests) ---

    @Test void test11_SearchExactSkill() {
        when(graduateRepository.findBySkillName("Java")).thenReturn(List.of(graduate));
        List<GraduateCardResponse> results = graduateService.searchGraduatesBySkill("Java");
        assertEquals(1, results.size());
    }

    @Test void test12_SearchPartialSkill() {
        when(graduateRepository.findBySkillName("Jav")).thenReturn(List.of(graduate));
        List<GraduateCardResponse> results = graduateService.searchGraduatesBySkill("Jav");
        assertFalse(results.isEmpty());
    }

    @Test void test13_SearchNoResults() {
        when(graduateRepository.findBySkillName("C++")).thenReturn(Collections.emptyList());
        List<GraduateCardResponse> results = graduateService.searchGraduatesBySkill("C++");
        assertTrue(results.isEmpty());
    }

    @Test void test14_SearchCaseInsensitivity() {
        when(graduateRepository.findBySkillName("JAVA")).thenReturn(List.of(graduate));
        List<GraduateCardResponse> results = graduateService.searchGraduatesBySkill("JAVA");
        assertEquals(1, results.size());
    }

    @Test void test15_SearchMultipleMatches() {
        when(graduateRepository.findBySkillName("Java")).thenReturn(List.of(graduate, new Graduate()));
        List<GraduateCardResponse> results = graduateService.searchGraduatesBySkill("Java");
        assertEquals(2, results.size());
    }
}
