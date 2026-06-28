# SkillBridge GH - Undergraduate Project Report Content

This document provides the specific content needed to fill your project report template based on the current implementation of **SkillBridge GH**.

---

## 1. PROJECT TITLE
**SKILLBRIDGE GH: A DIGITAL SKILLS PORTAL FOR UPSA GRADUATE EMPLOYABILITY**

---

## 2. ABSTRACT
SkillBridge GH is a web-based platform designed to address the challenge of graduate unemployment by connecting UPSA graduates with potential employers through verified digital skills. The research problem identified was the tedious manual process of profile creation and the difficulty employers face in finding specific technical talent within the UPSA community. 

The methodology adopted was the **Agile Development Model**, utilizing **Spring Boot** for the backend and **React** for the frontend. The resulting system features an automated **LinkedIn PDF parser** that extracts professional data to populate user profiles instantly. Implications of the study suggest that such a platform significantly reduces the "time-to-profile" for graduates and provides a centralized, searchable database of verified skills for the industry.

---

## 3. CHAPTER 1: GENERAL INTRODUCTION

### 1.1 Introduction
SkillBridge GH is a digital skills portal connecting graduates from the University of Professional Studies, Accra (UPSA) with potential employers. It features LinkedIn PDF parsing for profile automation, skill-based candidate discovery, and personalized course recommendations.

### 1.2 Background
In the evolving job market, a degree alone is often insufficient. Employers prioritize specific digital competencies. UPSA graduates possess these skills, but often lack a centralized medium to showcase them specifically to corporate partners in a verified manner.

### 1.3 Statement of the Problem
1. **Manual Inefficiency:** The time-consuming nature of manually filling out professional profiles.
2. **Talent Discovery Gap:** Employers' inability to filter UPSA graduates based on specific technical tools (e.g., React, SQL).
3. **Skill Stagnation:** Graduates lack a roadmap for which skills are currently in demand by employers on the platform.

### 1.4 Study Objectives
#### 1.4.1 General Objective
To design and implement a web-based digital skills portal that automates professional profiling and facilitates talent discovery for UPSA graduates.
#### 1.4.2 Specific Objectives
- To develop a PDF parsing engine using **Apache PDFBox** for LinkedIn data extraction.
- To implement a skill-matching algorithm for job and course recommendations.
- To provide a secure, role-based access system for graduates, employers, and administrators.

### 1.5 Scope of the Project
The system is limited to UPSA graduates (validated via `@upsamail.edu.gh` emails). It covers profile automation, job listings by employers, and learning resource management by administrators.

### 1.7 Significance of the Project
- **To Graduates:** Reduces profile setup time and provides a direct link to employers.
- **To Employers:** Provides a pre-verified pool of talent from a reputable institution.
- **To UPSA:** Acts as a bridge between academia and industry, enhancing graduate employability.

---

## 4. CHAPTER 2: LITERATURE REVIEW

### 2.3 Review of Existing Systems
- **LinkedIn:** Global standard but lacks localized institutional verification and niche community focus for UPSA.
- **Jobberman:** Broad recruitment but requires extensive manual input and lacks specialized "course-to-skill" mapping for graduates.
- **The Proposed System:** Combines the automation of LinkedIn with the community focus of an institutional portal, adding automated upskilling suggestions.

---

## 5. CHAPTER 3: METHODOLOGY

### 3.2 System Development Methodology
**Agile/Prototyping:** Chosen for its iterative nature. This allowed for the continuous refinement of the PDF parsing logic and the user interface based on periodic testing cycles.

### 3.4 Requirements of the Proposed System
#### 3.4.1 Functional Requirements
- **Graduate:** Register with UPSA email, verify account, upload LinkedIn PDF, manage skills.
- **Employer:** Secure login via Google OAuth, post job vacancies, search/filter graduates.
- **Admin:** Monitor platform statistics, moderate profiles, manage course resources.
#### 3.4.2 Non-Functional Requirements
- **Security:** JWT authentication and BCrypt password encryption.
- **Performance:** Fast PDF processing and responsive UI design.
#### 3.4.3 Software/Hardware Requirements
- **Backend:** Spring Boot 3.4.1, PostgreSQL.
- **Frontend:** React 19, TypeScript, Tailwind CSS.
- **Hardware:** Minimum 8GB RAM, Core i5 Processor for development and hosting.

### 3.5 Design of the System
- **Context Diagram:** Shows the interaction between the Graduate, Employer, and Admin with the SkillBridge System.
- **ER Diagram:** Includes entities such as `Graduate`, `Skill`, `JobPosting`, `Employer`, and `CourseResource`.

---

## 6. CHAPTER 4: IMPLEMENTATION

### 4.2 Testing Approaches
- **Unit Testing:** Used for individual components like the `PdfParserService`.
- **Integration Testing:** Verified the flow from PDF upload to database persistence.
- **User Acceptance Testing (UAT):** Conducted with a sample of UPSA students to validate the ease of the onboarding process.

### 4.3 Implementation Strategy
**Direct Implementation:** Once the final version was tested, the system was deployed to replace any manual methods of tracking graduate skills.

### 4.4 System Documentation
The system uses a **RESTful API** architecture. The frontend communicates with the backend via `Axios`, passing `JWT tokens` for authenticated requests. The UI is built using **Shadcn UI** for a modern, professional aesthetic.

### 4.5 Implementation Challenges
One major challenge was the variety of formats in LinkedIn PDF exports. This was solved by implementing flexible text-scraping logic and providing a "Manual Review" step for the user after parsing.

---

## 7. CHAPTER 5: SUMMARY & CONCLUSION

### 5.2 Summary
The project addressed the gap in graduate-employer connectivity by building a specialized portal. The use of automation through PDF parsing proved to be a significant value add.

### 5.4 Recommendations
- Integration of a real-time chat system between employers and graduates.
- Implementation of AI-driven skill gap analysis.

### 5.5 Conclusion
SkillBridge GH successfully demonstrates how modern web technologies can be leveraged to streamline the employment process for university graduates in Ghana.

---

## 8. REFERENCES (Sample)
- University of Professional Studies, Accra (2026). *Guidelines for Undergraduate Projects*.
- Spring Boot Documentation (2024). *Spring Security and JWT Authentication*.
- Apache Software Foundation. *Apache PDFBox Library User Guide*.

---

## 9. APPENDIX A: PROGRAMMING CODES
- **Main Entity:** `com.skillbridge.entity.Graduate`
- **Parser Logic:** `com.skillbridge.util.PdfParser`
- **Frontend Routes:** `skill-bridge-frontend/src/routes.tsx`
