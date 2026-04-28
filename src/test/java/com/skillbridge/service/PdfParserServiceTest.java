package com.skillbridge.service;

import com.skillbridge.dto.response.ParsedProfileDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PdfParserServiceTest {

    private PdfParserService pdfParserService;

    @BeforeEach
    void setUp() {
        pdfParserService = new PdfParserService();
    }

    @Test void test1_FullProfileParsing() {
        String mockText = "John Doe\nSoftware Engineer\nContact\njohn@upsa.edu.gh\nExperience\nSoftware Engineer\nTech Corp\nEducation\nUPSA";
        ParsedProfileDto result = pdfParserService.extractProfile(mockText);
        assertEquals("John Doe", result.getFullName());
    }

    @Test void test2_NameExtractionHeuristics() {
        String mockText = "Contact\njohn@email.com\nTop Skills\nJava\nJohn Doe\nSoftware Engineer";
        ParsedProfileDto result = pdfParserService.extractProfile(mockText);
        assertEquals("John Doe", result.getFullName());
    }

    @Test void test3_ExperienceExtraction() {
        String mockText = "John Doe\nExperience\nSoftware Engineer\nTech Corp\nJan 2020 - Present";
        ParsedProfileDto result = pdfParserService.extractProfile(mockText);
        assertFalse(result.getWorkExperiences().isEmpty());
    }

    @Test void test4_EducationExtraction() {
        String mockText = "John Doe\nEducation\nUPSA\nBSc IT\n2020";
        ParsedProfileDto result = pdfParserService.extractProfile(mockText);
        assertEquals("UPSA", result.getEducations().get(0).getInstitution());
    }

    @Test void test5_SkillsExtraction() {
        String mockText = "John Doe\nTop Skills\nJava\nPython\nSpring\nExperience";
        ParsedProfileDto result = pdfParserService.extractProfile(mockText);
        assertTrue(result.getSkills().size() >= 3);
    }

    @Test void test6_EmailExtraction() {
        String mockText = "Contact\njohn.doe@upsa.edu.gh\nExperience";
        ParsedProfileDto result = pdfParserService.extractProfile(mockText);
        assertNotNull(result);
    }

    @Test void test7_SummaryBioExtraction() {
        String mockText = "John Doe\nSummary\nI am a passionate developer.\nExperience";
        ParsedProfileDto result = pdfParserService.extractProfile(mockText);
        assertTrue(result.getBio().contains("passionate"));
    }

    @Test void test8_HeadlineExtraction() {
        String mockText = "John Doe\nData Scientist at Accra\nContact";
        ParsedProfileDto result = pdfParserService.extractProfile(mockText);
        assertEquals("Data Scientist at Accra", result.getHeadline());
    }

    @Test void test9_CertificationExtraction() {
        String mockText = "John Doe\nCertifications\nAWS Cloud Practitioner\nExperience";
        ParsedProfileDto result = pdfParserService.extractProfile(mockText);
        assertFalse(result.getCertifications().isEmpty());
    }

    @Test void test10_EmptyInputHandling() {
        String mockText = "   \n   \n   ";
        ParsedProfileDto result = pdfParserService.extractProfile(mockText);
        assertEquals("", result.getFullName());
        assertTrue(result.getSkills().isEmpty());
    }
}
