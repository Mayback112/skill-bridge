# SKILLBRIDGE GH — Backend Master Prompt (Claude Code)

-----

You are the sole backend engineer for SKILLBRIDGE GH, a web-based digital skills portal connecting UPSA graduates with employers. You have been provided with SKILLBRIDGE_FULL_DOCS.md as your single source of truth. Read it fully and refer back to it before implementing anything.

-----

## Your Backend Stack

- Runtime: Java 17+
- Framework: Spring Boot 3.x
- Database: PostgreSQL
- ORM: Spring Data JPA (Hibernate)
- Migrations: Flyway
- Auth: Spring Security — JWT for Graduate & Admin, Google OAuth2 for Employer
- PDF Parsing: Apache PDFBox
- Email: JavaMailSender (SMTP)
- Build Tool: Maven
- Password Hashing: BCrypt

-----

## Project Structure

Create and maintain this exact structure — do not deviate:
backend/
└── src/
└── main/
├── java/com/skillbridge/
│   ├── auth/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── filter/
│   │   └── service/
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── JwtConfig.java
│   │   └── CorsConfig.java
│   ├── controller/
│   │   ├── GraduateController.java
│   │   ├── EmployerController.java
│   │   ├── JobPostingController.java
│   │   ├── CourseResourceController.java
│   │   └── AdminController.java
│   ├── dto/
│   │   ├── request/
│   │   └── response/
│   ├── entity/
│   │   ├── Graduate.java
│   │   ├── Employer.java
│   │   ├── Skill.java
│   │   ├── JobCanDo.java
│   │   ├── Education.java
│   │   ├── WorkExperience.java
│   │   ├── Certification.java
│   │   ├── JobPosting.java
│   │   └── CourseResource.java
│   ├── enums/
│   │   ├── Role.java
│   │   └── ProficiencyLevel.java
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   └── CustomExceptions.java
│   ├── repository/
│   │   ├── GraduateRepository.java
│   │   ├── EmployerRepository.java
│   │   ├── SkillRepository.java
│   │   ├── JobCanDoRepository.java
│   │   ├── EducationRepository.java
│   │   ├── WorkExperienceRepository.java
│   │   ├── CertificationRepository.java
│   │   ├── JobPostingRepository.java
│   │   └── CourseResourceRepository.java
│   ├── service/
│   │   ├── GraduateService.java
│   │   ├── EmployerService.java
│   │   ├── JobPostingService.java
│   │   ├── CourseResourceService.java
│   │   ├── AdminService.java
│   │   ├── PdfParserService.java
│   │   ├── EmailService.java
│   │   └── JwtService.java
│   └── util/
│       ├── JwtUtil.java
│       └── EmailValidator.java
└── resources/
├── db/
│   └── migration/
│       ├── V1__create_graduates.sql
│       ├── V2__create_employers.sql
│       ├── V3__create_skills.sql
│       ├── V4__create_job_can_do.sql
│       ├── V5__create_education.sql
│       ├── V6__create_work_experience.sql
│       ├── V7__create_certifications.sql
│       ├── V8__create_job_postings.sql
│       └── V9__create_course_resources.sql
└── application.yml

-----

## application.yml Configuration
spring:
datasource:
url: ${DB_URL}
username: ${DB_USERNAME}
password: ${DB_PASSWORD}
driver-class-name: org.postgresql.Driver

jpa:
hibernate:
ddl-auto: validate
show-sql: false
properties:
hibernate:
dialect: org.hibernate.dialect.PostgreSQLDialect
format_sql: true

flyway:
enabled: true
locations: classpath:db/migration
baseline-on-migrate: true

mail:
host: ${MAIL_HOST}
port: ${MAIL_PORT}
username: ${MAIL_USERNAME}
password: ${MAIL_PASSWORD}
properties:
mail:
smtp:

auth: true
starttls:
enable: true

security:
oauth2:
client:
registration:
google:
client-id: ${GOOGLE_CLIENT_ID}
client-secret: ${GOOGLE_CLIENT_SECRET}
scope: email, profile

jwt:
secret: ${JWT_SECRET}
expiration: ${JWT_EXPIRATION}

app:
base-url: ${APP_BASE_URL}

-----

## Environment Variables
# Database
DB_URL=jdbc:postgresql://localhost:5432/skillbridge_db
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_EXPIRATION=86400000

# Mail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Google OAuth2
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# App
APP_BASE_URL=http://localhost:8080

-----

## Maven Dependencies (pom.xml)

Include all of these — do not skip any:
<!-- Spring Boot Starters -->
spring-boot-starter-web
spring-boot-starter-data-jpa
spring-boot-starter-security
spring-boot-starter-oauth2-client
spring-boot-starter-mail
spring-boot-starter-validation

<!-- PostgreSQL -->
postgresql (runtime)

<!-- Flyway -->
flyway-core
flyway-database-postgresql

<!-- JWT -->
jjwt-api
jjwt-impl
jjwt-jackson

<!-- PDF Parsing -->
pdfbox (Apache PDFBox)

<!-- Lombok -->
lombok

<!-- MapStruct (for DTO mapping) -->
mapstruct
mapstruct-processor

-----

## Database — Do This First

### Step 1 — Create the database
CREATE DATABASE skillbridge_db;

### Step 2 — Write Flyway migrations in this exact order

V1__create_graduates.sql
CREATE TABLE graduates (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
full_name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
profile_picture VARCHAR(500),
headline VARCHAR(255),
bio TEXT,
linkedin_url VARCHAR(500),
is_verified BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);

V2__create_employers.sql
CREATE TABLE employers (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
company_name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
google_id VARCHAR(255) NOT NULL UNIQUE,
profile_picture VARCHAR(500),
is_verified BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);

V3__create_skills.sql
CREATE TYPE proficiency_level AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

CREATE TABLE skills (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
graduate_id UUID NOT NULL REFERENCES graduates(id) ON DELETE CASCADE,
skill_name VARCHAR(255) NOT NULL,
proficiency_level proficiency_level NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
);

V4__create_job_can_do.sql
CREATE TABLE job_can_do (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
graduate_id UUID NOT NULL REFERENCES graduates(id) ON DELETE CASCADE,
job_title VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
);

V5__create_education.sql
CREATE TABLE education (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
graduate_id UUID NOT NULL REFERENCES graduates(id) ON DELETE CASCADE,
institution VARCHAR(255) NOT NULL,
degree VARCHAR(255) NOT NULL,
field_of_study VARCHAR(255),
start_date DATE,
end_date DATE,
created_at TIMESTAMP DEFAULT NOW()
);

V6__create_work_experience.sql
CREATE TABLE work_experience (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
graduate_id UUID NOT NULL REFERENCES graduates(id) ON DELETE CASCADE,
job_title VARCHAR(255) NOT NULL,
company VARCHAR(255) NOT NULL,
start_date DATE,
end_date DATE,
description TEXT,
created_at TIMESTAMP DEFAULT NOW()
);

V7__create_certifications.sql
CREATE TABLE certifications (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
graduate_id UUID NOT NULL REFERENCES graduates(id) ON DELETE CASCADE,
name VARCHAR(255) NOT NULL,
issuing_organization VARCHAR(255),
issue_date DATE,
created_at TIMESTAMP DEFAULT NOW()
);

V8__create_job_postings.sql
CREATE TABLE job_postings (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
title VARCHAR(255) NOT NULL,
description TEXT NOT NULL,
required_skills TEXT[] NOT NULL,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);

V9__create_course_resources.sql
CREATE TABLE course_resources (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
title VARCHAR(255) NOT NULL,
url VARCHAR(500) NOT NULL,
platform VARCHAR(255),
skill_tag VARCHAR(255) NOT NULL,
added_by UUID,
created_at TIMESTAMP DEFAULT NOW()
);

-----

## Entities

Follow the migrations exactly. Key rules:

- All PKs are UUID — use @GeneratedValue with UUID strategy
- All entities extend a BaseEntity with createdAt and updatedAt
- Use @Column(nullable = false) where field is required
- Use @OneToMany(mappedBy = ..., cascade = CascadeType.ALL, orphanRemoval = true) for graduate relationships
- Never expose entities directly — always use DTOs

-----

## Auth Implementation

### Graduate Auth
POST /api/auth/graduate/register
- Accept: email, password, fullName
- Validate email ends with @upsa.edu.gh (backend regex)
- Hash password with BCrypt
- Save graduate with isVerified = false
- Send verification link to email via JavaMailSender
- Link format: {APP_BASE_URL}/api/auth/graduate/verify?token={jwt_token}
- Return: 201 Created

POST /api/auth/graduate/verify-email?token=
- Decode JWT token
- Set isVerified = true
- Return: 200 OK

POST /api/auth/graduate/login
- Validate email domain
- Check isVerified = true (reject if not verified)
- Match password with BCrypt
- Return: JWT access token

### Employer Auth (Google OAuth2)
GET /api/auth/employer/google
- Redirect to Google OAuth2 consent screen

GET /api/auth/employer/google/callback
- Receive Google profile (email, name, googleId, picture)
- Check if employer exists by googleId
- If not — create new employer account
- Return: JWT access token

### Admin Auth
POST /api/auth/admin/login
- Email + password
- Return: JWT access token with ADMIN role

### JWT Filter

- Intercept all /api/** requests
- Extract Bearer token from Authorization header
- Validate token and set SecurityContext
- Attach role (GRADUATE / EMPLOYER / ADMIN) to context

-----

## API Endpoints

### Graduate
POST   /api/auth/graduate/register          PUBLIC
POST   /api/auth/graduate/verify-email      PUBLIC
POST   /api/auth/graduate/login             PUBLIC
GET    /api/graduates                       PUBLIC (employer browsing)
GET    /api/graduates/{id}                  PUBLIC (employer views profile)
PUT    /api/graduates/{id}                  GRADUATE only (own profile)
POST   /api/graduates/upload-pdf            GRADUATE only

### Employer
GET    /api/auth/employer/google            PUBLIC
GET    /api/auth/employer/google/callback   PUBLIC
GET    /api/employers/{id}                  EMPLOYER only
POST   /api/jobs                            EMPLOYER only
GET    /api/jobs                            PUBLIC
GET    /api/jobs/{id}                       PUBLIC
PUT    /api/jobs/{id}                       EMPLOYER only (own job)
DELETE /api/jobs/{id}                       EMPLOYER only (own job)

### Course Resources
GET    /api/courses                         PUBLIC (filterable by skillTag)
POST   /api/courses                         ADMIN only
DELETE /api/courses/{id}                    ADMIN only

### Admin
POST   /api/auth/admin/login                PUBLIC
GET    /api/admin/stats                     ADMIN only
DELETE /api/admin/graduates/{id}            ADMIN only
DELETE /api/admin/jobs/{id}                 ADMIN only

-----

## API Response Wrapper

Every endpoint must return this consistent structure:
public class ApiResponse<T> {
private boolean success;
private String message;
private T data;
private LocalDateTime timestamp;
}

Success:
{
"success": true,
"message": "Graduate registered successfully",
"data": { ... },

"timestamp": "2025-11-01T10:00:00"
}

Error:
{
"success": false,
"message": "Only UPSA email accounts are allowed",
"data": null,
"timestamp": "2025-11-01T10:00:00"
}

-----

## Validation Rules

|Rule                         |Implementation                                                            |
|-----------------------------|--------------------------------------------------------------------------|
|UPSA email only              |Regex: ^[a-zA-Z0-9._%+-]+@upsa\.edu\.gh$ — backend + @Email annotation|
|Email verified before login  |Check isVerified flag in login service                                  |
|At least one skill on profile|`@Size(min = 1)` on skills list in DTO                                    |
|LinkedIn URL format          |`@Pattern` annotation with URL regex                                      |
|PDF must be valid            |Check MIME type before parsing in PdfParserService                      |
|Gmail only for employer      |Validate email ends with @gmail.com from Google profile                 |
|Job must have required skills|`@NotEmpty` on requiredSkills field                                       |
|Course must have skill tag   |`@NotBlank` on skillTag field                                             |

-----

## PDF Parser Service

Use Apache PDFBox to extract text from LinkedIn PDF.

Detect these section keywords and map to fields:

|Keyword                     |Maps To            |
|----------------------------|-------------------|
|Top of document (first line)|fullName           |
|Second line                 |headline           |
|`Summary` or About        |bio                |
|`Experience`                |workExperience list|
|`Education`                 |education list     |
|`Skills`                    |skills list        |
|`Licenses & Certifications` |certifications list|

Return a ParsedProfileDto — do not save directly. Graduate reviews and confirms before saving.

-----

## Email Service

Use JavaMailSender for:

- Sending verification link on graduate registration
- Link format: {APP_BASE_URL}/api/auth/graduate/verify-email?token={token}
- Token is a short-lived JWT (24 hour expiry)
- Email subject: Verify your SKILLBRIDGE GH account

-----

## Security Config Rules
PUBLIC routes:
- POST /api/auth/**
- GET  /api/graduates
- GET  /api/graduates/{id}
- GET  /api/jobs
- GET  /api/jobs/{id}
- GET  /api/courses

GRADUATE only:
- PUT  /api/graduates/{id}
- POST /api/graduates/upload-pdf

EMPLOYER only:
- POST   /api/jobs
- PUT    /api/jobs/{id}
- DELETE /api/jobs/{id}
- GET    /api/employers/{id}

ADMIN only:
- GET    /api/admin/**
- DELETE /api/admin/**
- POST   /api/courses
- DELETE /api/courses/{id}

-----

## Global Exception Handler

Handle these exceptions globally using @RestControllerAdvice:
EntityNotFoundException       → 404
UnauthorizedException         → 401
InvalidEmailDomainException   → 400
EmailNotVerifiedException     → 403
DuplicateEmailException       → 409
PdfParseException             → 422
MethodArgumentNotValidException → 400 (validation errors)
Exception (catch-all)         → 500

-----

## Build Order — Follow This Strictly
1. application.yml + environment variables
2. pom.xml dependencies
3. Flyway migrations (V1 → V9)
4. Enums (Role, ProficiencyLevel)
5. BaseEntity
6. Entities (Graduate → Employer → rest)
7. Repositories
8. DTOs (request + response for each entity)
9. JwtUtil + JwtService
10. EmailService
11. PdfParserService
12. Services (Graduate → Employer → JobPosting → CourseResource → Admin)
13. SecurityConfig + JwtFilter
14. Controllers
15. GlobalExceptionHandler
16. ApiResponse wrapper

-----

## What NOT to Build

- No ML or recommendation engine — skill-based filtering only
- No messaging between graduates and employers
- No payment system
- No file storage service — profile pictures are URLs only for now
- Do not implement any ❓ flagged items from SKILLBRIDGE_FULL_DOCS.md
- Do not use ddl-auto: create or ddl-auto: update — Flyway manages schema only

-----

## Before Every Task


Re-read the relevant section of SKILLBRIDGE_FULL_DOCS.md
1. Check the entity definitions match what you are building
1. Check the user story for the feature you are implementing
1. Follow the build order above
1. Always write migration first → entity → repository → service → controller

-----

*This prompt is tied to SKILLBRIDGE_FULL_DOCS.md — always use both together.*