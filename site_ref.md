# SKILLBRIDGE GH — Full Project Documentation

> Stack: React + TypeScript (SPA) · Java Spring Boot · PostgreSQL  
> Project: Web-Based Digital Skills Portal for UPSA Graduate Employment  
> Version: 1.1 — Updated after team confirmation

-----

## 1. Overview

SKILLBRIDGE GH is a web platform that connects UPSA graduates with employers by allowing graduates to showcase their digital skills and employers to post jobs and find suitable candidates. The platform also suggests learning resources to help graduates grow their skillset.

-----

## 2. Roles

|Role        |Auth Method                                    |Description                                                           |
|------------|-----------------------------------------------|----------------------------------------------------------------------|
|**Graduate**|UPSA email (`@upsa.edu.gh`) + verification link|UPSA student/graduate listing skills and seeking employment           |
|**Employer**|Gmail (Google OAuth)                           |Company or individual posting jobs and searching for skilled graduates|
|**Admin**   |Platform credentials                           |Monitors and moderates the platform                                   |

-----

## 3. Role Features

-----

### 👨‍🎓 Graduate

|Feature                       |Description                                                    |
|------------------------------|---------------------------------------------------------------|
|Register with UPSA email      |Only @upsa.edu.gh emails accepted                            |
|Email verification            |Verification link sent to UPSA email                           |
|Profile setup via LinkedIn PDF|Upload LinkedIn PDF — system auto-fills profile                |
|Profile setup via Manual fill |Fill in all profile fields manually                            |
|Profile picture upload        |Optional — shown on graduate card                              |
|List digital skills           |Skills displayed to employers                                  |
|List jobs they can do         |Shown on profile and card                                      |
|View course suggestions       |Platform suggests offline/online learning links based on skills|
|View & edit profile           |Graduate can update their profile anytime                      |

-----

### 🏢 Employer

|Feature                    |Description                               |
|---------------------------|------------------------------------------|
|Register/Login with Gmail  |Google OAuth — no password needed         |
|Post a job                 |Create a job listing with required skills |
|View graduate cards        |Browse graduates by skill/experience      |
|View graduate profile by ID|Click a card to view full graduate profile|
|Manage job postings        |Edit or delete their own job posts        |

-----

### 🛡️ Admin

|Feature                  |Description                                   |
|-------------------------|----------------------------------------------|
|Monitor platform activity|Overview of graduates, employers, jobs posted |
|Manage graduate profiles |Remove fake or inappropriate profiles         |
|Manage job postings      |Remove inappropriate job posts                |
|View platform stats      |Skills in demand, most searched, profile views|

-----

## 4. Entities

-----

### 🎓 Graduate
id                  UUID
fullName            String
email               String (@upsa.edu.gh)
passwordHash        String
profilePicture      String (image URL)
headline            String
bio                 String
linkedInUrl         String (optional)
isVerified          Boolean
createdAt           DateTime
updatedAt           DateTime

-----

### 💼 Employer
id                  UUID
companyName         String
email               String (Gmail)
googleId            String
profilePicture      String (from Google)
isVerified          Boolean
createdAt           DateTime
updatedAt           DateTime

-----

### 🛠️ Skill
id                  UUID
graduateId          UUID (FK → Graduate)

skillName           String
proficiencyLevel    Enum (BEGINNER, INTERMEDIATE, ADVANCED)

-----

### 💡 JobCanDo
id                  UUID
graduateId          UUID (FK → Graduate)
jobTitle            String

-----

### 🎓 Education
id                  UUID
graduateId          UUID (FK → Graduate)
institution         String
degree              String
fieldOfStudy        String
startDate           Date
endDate             Date

-----

### 🏢 WorkExperience
id                  UUID
graduateId          UUID (FK → Graduate)
jobTitle            String
company             String
startDate           Date
endDate             Date
description         String

-----

### 📜 Certification
id                  UUID
graduateId          UUID (FK → Graduate)
name                String
issuingOrganization String
issueDate           Date

-----

### 📢 JobPosting
id                  UUID
employerId          UUID (FK → Employer)
title               String
description         String
requiredSkills      String[]
isActive            Boolean
createdAt           DateTime
updatedAt           DateTime

-----

### 📚 CourseResource
id                  UUID
title               String
url                 String (external link)
platform            String (e.g. YouTube, Coursera, Udemy)
skillTag            String (linked to skill it helps with)
addedBy             UUID (FK → Admin)
createdAt           DateTime

-----

## 5. User Stories

-----

### 👨‍🎓 Graduate Stories

-----

Story 1 — Registration

> *As a UPSA graduate, I want to register with my UPSA email so that only verified UPSA students can access the platform.*

Flow:
Graduate enters @upsa.edu.gh email
→ System validates domain
→ Verification link sent to email
→ Graduate clicks link
→ Account activated
→ Proceeds to profile setup

-----

Story 2 — Profile Setup via LinkedIn

> *As a graduate with a LinkedIn account, I want to upload my LinkedIn PDF so that my profile is filled automatically without typing everything manually.*

Flow:
Graduate selects "Fill with LinkedIn"
→ Enters LinkedIn URL (saved to profile)
→ Tutorial modal shows how to export LinkedIn PDF
→ Graduate uploads PDF
→ System parses PDF and auto-fills profile fields
→ Graduate reviews and edits
→ Uploads profile picture (optional)
→ Submits profile

-----

Story 3 — Profile Setup via Manual Fill

> *As a graduate without LinkedIn, I want to fill in my profile manually so that I can still be discovered by employers.*

Flow:
Graduate selects "Manual Fill"
→ Fills in all fields (name, skills, education, jobs etc.)
→ Uploads profile picture (optional)
→ Submits profile

-----

Story 4 — Course Suggestions

> *As a graduate, I want to see suggested courses based on my skills so that I can learn new things and improve my profile.*

Flow:
Graduate views their profile
→ Platform shows "You might want to learn" section
→ Lists course links (YouTube, Coursera etc.) tagged to their skill gaps
→ Graduate clicks link → opens external course in new tab

-----

### 🏢 Employer Stories

-----

Story 5 — Employer Registration

> *As an employer, I want to sign in with my Gmail so that I can quickly access the platform without creating a new password.*

Flow:
Employer clicks "Sign in with Google"
→ Google OAuth flow
→ Account created/logged in automatically
→ Employer lands on dashboard

-----

Story 6 — Post a Job

> *As an employer, I want to post a job listing with required skills so that graduates with matching skills can be found.*

Flow:
Employer logs in
→ Clicks "Post a Job"
→ Fills in job title, description, required skills
→ Submits job posting
→ Job is listed on the platform

-----

Story 7 — Browse Graduates

> *As an employer, I want to browse graduate profiles so that I can find candidates that match what I need.*

Flow:
Employer browses graduate cards
→ Each card shows: profile picture, name, skills, jobs they can do
→ Employer filters by skill
→ Clicks a card → full profile loads by ID

-----

Story 8 — View Graduate Profile

> *As an employer, I want to view a graduate’s full profile so that I can assess their experience and skills in detail.*

Flow:
Employer clicks graduate card
→ Full profile page loads (GET /graduates/{id})
→ Sees: name, picture, headline, bio, skills,
work experience, education, certifications,
LinkedIn URL, jobs they can do

-----

### 🛡️ Admin Stories

-----

Story 9 — Monitor Platform

> *As an admin, I want to see platform activity so that I can ensure the platform is being used properly.*

Flow:
Admin logs in
→ Dashboard shows:
- Total graduates registered
- Total employers registered
- Total jobs posted
- Most searched skills
- Profile view counts

-----

Story 10 — Manage Profiles & Jobs

> *As an admin, I want to remove inappropriate profiles or job postings so that the platform stays credible and safe.*

Flow:
Admin views graduate list or job postings
→ Flags or removes inappropriate entries
→ System deletes or deactivates the record

-----

Story 11 — Manage Course Resources

> *As an admin, I want to add course links tagged to skills so that graduates get relevant learning suggestions.*

Flow:
Admin adds course resource:
→ Title, URL, platform (YouTube/Coursera etc.), skill tag
→ Resource saved to database
→ Graduates with that skill tag see it suggested on their profile

-----

## 6. Auth Summary

|Role    |Method              |Verification                               |
|--------|--------------------|-------------------------------------------|
|Graduate|Email + Password    |UPSA email domain check + verification link|
|Employer|Google OAuth (Gmail)|Google handles verification                |
|Admin   |Email + Password    |Platform managed                           |

-----

## 7. Validation Rules

|Rule                                             |Where Enforced    |
|-------------------------------------------------|------------------|
|UPSA email only (`@upsa.edu.gh`)                 |Frontend + Backend|
|Email must be verified before proceeding         |Backend           |
|At least one skill required on profile           |Frontend + Backend|
|LinkedIn URL format validation                   |Frontend + Backend|
|PDF must be valid before parsing                 |Backend           |
|Gmail only for employer OAuth                    |Backend           |
|Job posting must have at least one required skill|Frontend + Backend|
|Course resource must have a skill tag            |Frontend + Backend|

-----

## 8. Tech Implementation Notes

|Concern                |Solution                                      |
|-----------------------|----------------------------------------------|
|UPSA email validation  |Regex check on @upsa.edu.gh                 |
|Email verification link|Spring Boot + JavaMailSender                  |
|PDF parsing            |Apache PDFBox                                 |
|LinkedIn URL storage   |Saved as string field on graduate profile     |
|Employer Google OAuth  |Spring Security OAuth2 + Google               |
|Auth tokens            |JWT via Spring Security                       |
|Password encryption    |BCrypt                                        |
|Course resource links  |Stored in DB, tagged to skills, served via API|

-----

## 9. Open Items

- ❓ Can employers message graduates directly on the platform?
- ❓ Does admin manually approve graduate profiles or is it automatic post-verification?
- ❓ Should graduates be notified when an employer views their profile?

-----

*Documentation based on Group 47 project proposal (November 2025), team review notes and confirmed team decisions.*

