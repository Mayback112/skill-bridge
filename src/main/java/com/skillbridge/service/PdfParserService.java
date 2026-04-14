package com.skillbridge.service;

import com.skillbridge.dto.request.CertificationRequest;
import com.skillbridge.dto.request.EducationRequest;
import com.skillbridge.dto.request.SkillRequest;
import com.skillbridge.dto.request.WorkExperienceRequest;
import com.skillbridge.dto.response.ParsedProfileDto;
import com.skillbridge.exception.CustomExceptions.PdfParseException;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@Slf4j
public class PdfParserService {

    private static final List<String> ALLOWED_TYPES = Arrays.asList(
        "application/pdf", "application/x-pdf"
    );

    public ParsedProfileDto parseLinkedInPdf(MultipartFile file) {
        validatePdfFile(file);

        try {
            byte[] bytes = file.getBytes();
            try (PDDocument document = Loader.loadPDF(bytes)) {
                PDFTextStripper stripper = new PDFTextStripper();
                String text = stripper.getText(document);
                return extractProfile(text);
            }
        } catch (IOException e) {
            log.error("Failed to parse PDF", e);
            throw new PdfParseException("Could not read the uploaded PDF file");
        }
    }

    private void validatePdfFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new PdfParseException("PDF file is required");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new PdfParseException("Only PDF files are accepted");
        }
    }

    private ParsedProfileDto extractProfile(String text) {
        String[] lines = text.split("\\r?\\n");

        String fullName = lines.length > 0 ? lines[0].trim() : "";
        String headline = lines.length > 1 ? lines[1].trim() : "";
        String bio = extractSection(text, new String[]{"Summary", "About"}, new String[]{"Experience", "Education", "Skills"});

        List<SkillRequest> skills = extractSkills(text);
        List<WorkExperienceRequest> workExperiences = extractWorkExperiences(text);
        List<EducationRequest> educations = extractEducation(text);
        List<CertificationRequest> certifications = extractCertifications(text);

        return ParsedProfileDto.builder()
            .fullName(fullName)
            .headline(headline)
            .bio(bio)
            .skills(skills)
            .workExperiences(workExperiences)
            .educations(educations)
            .certifications(certifications)
            .build();
    }

    private String extractSection(String text, String[] startKeywords, String[] endKeywords) {
        int start = -1;
        for (String keyword : startKeywords) {
            int idx = text.indexOf(keyword);
            if (idx != -1) {
                start = idx + keyword.length();
                break;
            }
        }
        if (start == -1) return "";

        int end = text.length();
        for (String keyword : endKeywords) {
            int idx = text.indexOf(keyword, start);
            if (idx != -1 && idx < end) {
                end = idx;
            }
        }
        return text.substring(start, end).trim();
    }

    private List<SkillRequest> extractSkills(String text) {
        List<SkillRequest> skills = new ArrayList<>();
        String skillsSection = extractSection(text,
            new String[]{"Skills"},
            new String[]{"Licenses", "Certifications", "Education", "Experience", "Languages"}
        );
        if (skillsSection.isEmpty()) return skills;

        for (String line : skillsSection.split("\\r?\\n")) {
            String skill = line.trim();
            if (!skill.isEmpty() && skill.length() < 100) {
                SkillRequest req = new SkillRequest();
                req.setSkillName(skill);
                req.setProficiencyLevel(com.skillbridge.enums.ProficiencyLevel.INTERMEDIATE);
                skills.add(req);
            }
        }
        return skills;
    }

    private List<WorkExperienceRequest> extractWorkExperiences(String text) {
        List<WorkExperienceRequest> results = new ArrayList<>();
        String section = extractSection(text,
            new String[]{"Experience"},
            new String[]{"Education", "Skills", "Licenses"}
        );
        if (!section.isEmpty()) {
            WorkExperienceRequest req = new WorkExperienceRequest();
            req.setJobTitle("See LinkedIn for details");
            req.setCompany("Imported from LinkedIn");
            req.setDescription(section.length() > 500 ? section.substring(0, 500) : section);
            results.add(req);
        }
        return results;
    }

    private List<EducationRequest> extractEducation(String text) {
        List<EducationRequest> results = new ArrayList<>();
        String section = extractSection(text,
            new String[]{"Education"},
            new String[]{"Skills", "Licenses", "Certifications", "Languages"}
        );
        if (!section.isEmpty()) {
            EducationRequest req = new EducationRequest();
            req.setInstitution("Imported from LinkedIn");
            req.setDegree("See LinkedIn for details");
            results.add(req);
        }
        return results;
    }

    private List<CertificationRequest> extractCertifications(String text) {
        List<CertificationRequest> results = new ArrayList<>();
        String section = extractSection(text,
            new String[]{"Licenses & Certifications", "Certifications"},
            new String[]{"Skills", "Education", "Languages"}
        );
        for (String line : section.split("\\r?\\n")) {
            String cert = line.trim();
            if (!cert.isEmpty() && cert.length() < 200) {
                CertificationRequest req = new CertificationRequest();
                req.setName(cert);
                results.add(req);
            }
        }
        return results;
    }
}
