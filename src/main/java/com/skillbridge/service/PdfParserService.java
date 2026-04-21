package com.skillbridge.service;

import com.skillbridge.dto.request.CertificationRequest;
import com.skillbridge.dto.request.EducationRequest;
import com.skillbridge.dto.request.JobCanDoRequest;
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
        String fullName = "";
        String headline = "";
        String email = extractEmail(text);
        
        // Identify "Top Skills" section to avoid picking name from there
        int topSkillsStart = -1;
        int topSkillsEnd = -1;
        for (int i = 0; i < Math.min(lines.length, 30); i++) {
            if (lines[i].trim().equalsIgnoreCase("Top Skills")) {
                topSkillsStart = i;
                // Heuristic: skills usually end when we see a line that looks like a name or another header
                for (int j = i + 1; j < Math.min(lines.length, i + 10); j++) {
                    String next = lines[j].trim();
                    if (next.isEmpty()) continue;
                    // If it's a known section or something that looks like a name (short, title case)
                    if (next.equalsIgnoreCase("Experience") || next.equalsIgnoreCase("Education") || 
                        (next.split("\\s+").length <= 3 && Character.isUpperCase(next.charAt(0)))) {
                        topSkillsEnd = j;
                        break;
                    }
                }
                break;
            }
        }

        // Search for the Name.
        for (int i = 0; i < Math.min(lines.length, 50); i++) {
            // Skip Top Skills block
            if (topSkillsStart != -1 && i >= topSkillsStart && i < (topSkillsEnd == -1 ? topSkillsStart + 5 : topSkillsEnd)) {
                continue;
            }

            String line = lines[i].trim();
            if (line.isEmpty() || 
                line.equalsIgnoreCase("Contact") || 
                line.equalsIgnoreCase("Top Skills") ||
                line.toLowerCase().contains("linkedin.com") || 
                line.contains("@") ||
                line.startsWith("Page ")) {
                continue;
            }
            
            // Heuristic for name: 2-4 words, Title Case, no common noise or tech terms
            String[] words = line.split("\\s+");
            if (fullName.isEmpty() && words.length >= 2 && words.length <= 4 &&
                Character.isUpperCase(line.charAt(0)) &&
                !line.toLowerCase().contains("university") && 
                !line.toLowerCase().contains("student") &&
                !line.toLowerCase().contains("experience") &&
                !line.toLowerCase().contains("region") &&
                !line.toLowerCase().contains("ghana") &&
                !line.toLowerCase().contains("development") &&
                !line.toLowerCase().contains("management") &&
                !line.toLowerCase().contains("software") &&
                !line.toLowerCase().contains("engineer") &&
                !line.toLowerCase().contains("analyst")) {
                
                fullName = line;
                
                // The next line is almost always the headline (Student at..., Software Engineer at...)
                for (int j = i + 1; j < Math.min(lines.length, i + 5); j++) {
                    String nextLine = lines[j].trim();
                    if (!nextLine.isEmpty() && !nextLine.equalsIgnoreCase("Contact") && 
                        !nextLine.startsWith("Page ") && 
                        !nextLine.toLowerCase().contains("region") && 
                        !nextLine.toLowerCase().contains("ghana")) {
                        headline = cleanText(nextLine);
                        break;
                    }
                }
                break;
            }
        }
        
        // Fallback headline logic
        if (headline.isEmpty()) {
            headline = email;
        }

        List<SkillRequest> skills = extractSkills(text, fullName);
        
        // Map skills to JobCanDo as requested ("repet theSkills there")
        List<JobCanDoRequest> jobCanDos = new ArrayList<>();
        for (SkillRequest skill : skills) {
            JobCanDoRequest jreq = new JobCanDoRequest();
            jreq.setJobTitle(skill.getSkillName());
            jobCanDos.add(jreq);
        }

        List<WorkExperienceRequest> workExperiences = extractWorkExperiences(text);
        List<EducationRequest> educations = extractEducation(text);
        
        // If headline contains "Student at [University]", ensure it's in education
        if (headline.toLowerCase().contains("student at")) {
            String institution = headline.toLowerCase().replace("student at", "").trim();
            boolean exists = educations.stream().anyMatch(e -> e.getInstitution().toLowerCase().contains(institution.toLowerCase()));
            if (!exists && !institution.isEmpty()) {
                EducationRequest edu = new EducationRequest();
                edu.setInstitution(capitalizeWords(institution));
                edu.setDegree("Student");
                educations.add(0, edu);
            }
        }

        List<CertificationRequest> certifications = extractCertifications(text);
        
        String bio = extractSection(text, new String[]{"Summary", "About"}, new String[]{"Experience", "Education", "Skills", "Top Skills"});
        bio = cleanText(bio);

        return ParsedProfileDto.builder()
            .fullName(fullName)
            .headline(headline)
            .bio(bio)
            .skills(skills)
            .jobCanDos(jobCanDos)
            .workExperiences(workExperiences)
            .educations(educations)
            .certifications(certifications)
            .build();
    }

    private String capitalizeWords(String str) {
        String[] words = str.split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String word : words) {
            if (word.length() > 0) {
                sb.append(Character.toUpperCase(word.charAt(0)))
                  .append(word.substring(1).toLowerCase())
                  .append(" ");
            }
        }
        return sb.toString().trim();
    }


    private String extractEmail(String text) {
        // Handle split emails by removing newlines in the contact area
        String contactArea = text.substring(0, Math.min(text.length(), 1000));
        String flatContact = contactArea.replace("\n", "").replace("\r", "");
        
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+");
        java.util.regex.Matcher matcher = pattern.matcher(flatContact);
        if (matcher.find()) {
            return matcher.group();
        }
        
        // Fallback to original text if flattening fails
        matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group();
        }
        return "";
    }

    private String extractSection(String text, String[] startKeywords, String[] endKeywords) {
        String lowerText = text.toLowerCase();
        int start = -1;
        String foundStartKey = "";
        
        for (String keyword : startKeywords) {
            int idx = lowerText.indexOf(keyword.toLowerCase());
            if (idx != -1) {
                start = idx + keyword.length();
                foundStartKey = keyword;
                break;
            }
        }
        if (start == -1) return "";

        int end = text.length();
        for (String keyword : endKeywords) {
            if (keyword.equalsIgnoreCase(foundStartKey)) continue;
            int idx = lowerText.indexOf(keyword.toLowerCase(), start);
            if (idx != -1 && idx < end) {
                end = idx;
            }
        }
        
        // Safety check: if section is too long (e.g. > 2000 chars), it probably failed to find the end
        String result = text.substring(start, end).trim();
        if (result.length() > 2000) {
             // Try to find ANY of the end keywords earlier if they were missed
             return result.substring(0, 500) + "..."; // Truncate to prevent swallowing whole file
        }
        return result;
    }

    private String cleanText(String text) {
        if (text == null) return "";
        // Remove date patterns like "January 2026 - Present (4 months)"
        String cleaned = text.replaceAll("(?i)(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\s+\\d{4}.*", "");
        // Remove trailing "Page X"
        cleaned = cleaned.replaceAll("(?i)Page \\d+.*", "");
        return cleaned.trim();
    }

    private List<SkillRequest> extractSkills(String text, String fullName) {
        List<SkillRequest> skills = new ArrayList<>();
        // LinkedIn sidebar sections often end with "Contact" or "Summary"
        String section = extractSection(text,
            new String[]{"Top Skills", "Skills"},
            new String[]{"Contact", "Languages", "Certifications", "Licenses", "Experience", "Education", "Summary", "About", "Honors"}
        );
        
        if (section.isEmpty()) return skills;

        String[] lines = section.split("\\r?\\n");
        for (String line : lines) {
            String skill = line.trim();
            
            // STOP if we hit the name or headline starts
            if (!fullName.isEmpty() && skill.equalsIgnoreCase(fullName)) break;
            if (skill.toLowerCase().startsWith("student at") || skill.toLowerCase().contains("university of")) break;

            boolean isNoise = skill.isEmpty() || 
                             skill.equalsIgnoreCase(fullName) ||
                             skill.equalsIgnoreCase("Contact") ||
                             skill.toLowerCase().contains("region") ||
                             skill.toLowerCase().contains("ghana") ||
                             skill.toLowerCase().contains("accra") ||
                             skill.toLowerCase().contains("student") ||
                             skill.toLowerCase().contains("university") ||
                             skill.contains("@") ||
                             skill.length() >= 40 ||
                             skill.toLowerCase().contains("page");

            if (!isNoise) {
                SkillRequest req = new SkillRequest();
                req.setSkillName(skill);
                req.setProficiencyLevel(com.skillbridge.enums.ProficiencyLevel.INTERMEDIATE);
                skills.add(req);
            }
            if (skills.size() >= 10) break;
        }
        return skills;
    }

    private List<WorkExperienceRequest> extractWorkExperiences(String text) {
        List<WorkExperienceRequest> results = new ArrayList<>();
        String section = extractSection(text,
            new String[]{"Experience"},
            new String[]{"Education", "Skills", "Top Skills", "Licenses", "Honors", "Languages", "Volunteer", "Certifications"}
        );
        
        if (section.isEmpty()) return results;

        String[] lines = section.split("\\r?\\n");
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();
            if (line.isEmpty() || line.toLowerCase().contains("page")) continue;

            if (i + 1 < lines.length) {
                String company = cleanText(lines[i + 1].trim());
                String title = cleanText(line);
                
                if (!title.isEmpty() && !company.isEmpty() && title.length() < 60) {
                    WorkExperienceRequest req = new WorkExperienceRequest();
                    req.setJobTitle(title);
                    req.setCompany(company);
                    results.add(req);
                    i += 2; 
                }
                
                if (results.size() >= 5) break;
            }
        }
        return results;
    }

    private List<EducationRequest> extractEducation(String text) {
        List<EducationRequest> results = new ArrayList<>();
        String section = extractSection(text,
            new String[]{"Education"},
            new String[]{"Skills", "Top Skills", "Licenses", "Certifications", "Languages", "Experience", "Volunteer", "Projects"}
        );
        
        if (section.isEmpty()) return results;

        String[] lines = section.split("\\r?\\n");
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();
            if (line.isEmpty() || line.toLowerCase().contains("page")) continue;

            EducationRequest req = new EducationRequest();
            req.setInstitution(cleanText(line));
            if (i + 1 < lines.length) {
                req.setDegree(cleanText(lines[i + 1].trim()));
            }
            results.add(req);
            i += 2;
            
            if (results.size() >= 3) break;
        }
        return results;
    }

    private List<CertificationRequest> extractCertifications(String text) {
        List<CertificationRequest> results = new ArrayList<>();
        String section = extractSection(text,
            new String[]{"Licenses & Certifications", "Certifications"},
            new String[]{"Skills", "Top Skills", "Education", "Languages", "Experience"}
        );
        for (String line : section.split("\\r?\\n")) {
            String cert = cleanText(line.trim());
            if (!cert.isEmpty() && cert.length() < 100) {
                CertificationRequest req = new CertificationRequest();
                req.setName(cert);
                results.add(req);
            }
            if (results.size() >= 5) break;
        }
        return results;
    }
}
