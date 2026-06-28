# SkillBridge Feature Documentation

> Version: 1.0
> Last Updated: April 2026

---

## Table of Contents

1. [Overview](#overview)
2. [User Roles](#user-roles)
3. [Authentication & Onboarding](#authentication--onboarding)
4. [Graduate Features](#graduate-features)
5. [Employer Features](#employer-features)
6. [Admin Features](#admin-features)
7. [Public Features](#public-features)
8. [API Endpoints](#api-endpoints)
9. [Data Models](#data-models)

---

## Overview

SkillBridge is a digital skills portal connecting UPSA graduates with employers. The platform enables graduates to showcase their digital skills, employers to find qualified candidates, and admins to manage platform content.

**Key Value Propositions:**
- **For Graduates:** Showcase skills, get discovered by employers, access learning resources
- **For Employers:** Find pre-verified talent with specific skill sets
- **For Admins:** Monitor platform activity and manage content

---

## User Roles

| Role | Authentication Method | Primary Purpose |
|------|----------------------|-----------------|
| **Graduate** | UPSA email + password verification | Showcase skills and find opportunities |
| **Employer** | Google OAuth (Gmail) | Post jobs and find candidates |
| **Admin** | Platform credentials | Manage platform content and users |

---

## Authentication & Onboarding

### Graduate Registration Flow

**Endpoint:** `POST /api/auth/graduate/register`

**Process:**
1. Graduate enters email (must be `@upsamail.edu.gh` domain)
2. System validates email domain
3. Verification link sent to email
4. Graduate clicks link to verify account
5. Account activated, redirected to profile setup

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@upsamail.edu.gh",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your UPSA email to verify your account."
}
```

### Graduate Login Flow

**Endpoint:** `POST /api/auth/graduate/login`

**Process:**
1. Graduate enters verified email and password
2. System validates credentials
3. JWT token issued
4. User redirected to dashboard

**Request Body:**
```json
{
  "email": "john.doe@upsamail.edu.gh",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "fullName": "John Doe",
      "email": "john.doe@upsamail.edu.gh",
      "role": "GRADUATE"
    }
  }
}
```

### Employer Authentication (Google OAuth)

**Endpoint:** `GET /api/auth/employer/google`

**Process:**
1. Employer clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. User authorizes application
4. Google returns user profile
5. Account created or logged in automatically
6. JWT token issued
7. User redirected to employer dashboard

**Requirements:**
- Gmail account only
- Google OAuth 2.0 configured in backend

### Admin Authentication

**Endpoint:** `POST /api/auth/admin/login`

**Process:**
1. Admin enters platform credentials
2. System validates credentials
3. JWT token issued
4. User redirected to admin dashboard

**Request Body:**
```json
{
  "email": "admin@skillbridge.gh",
  "password": "adminPassword123"
}
```

---

## Graduate Features

### Profile Setup

Graduates can set up their profile in two ways:

#### 1. LinkedIn PDF Import

**Endpoint:** `POST /api/graduates/upload-pdf`

**Process:**
1. Graduate selects "Fill with LinkedIn"
2. Enters LinkedIn URL (saved to profile)
3. Tutorial modal shows how to export LinkedIn PDF
4. Graduate uploads PDF file
5. System parses PDF using Apache PDFBox
6. Profile fields auto-populated:
   - Full name
   - Headline
   - Bio
   - Email
   - Skills
   - Work experience
   - Education
   - Certifications
7. Graduate reviews and edits
8. Uploads profile picture (optional)
9. Submits profile

**Supported PDF Format:** LinkedIn profile export PDF

**Extracted Data:**
- **Personal Info:** Name, headline, bio, email
- **Skills:** Up to 10 skills with proficiency level (default: INTERMEDIATE)
- **Work Experience:** Up to 5 entries
- **Education:** Up to 3 entries
- **Certifications:** Up to 5 entries

**Response:**
```json
{
  "success": true,
  "message": "PDF parsed successfully. Please review and confirm.",
  "data": {
    "fullName": "John Doe",
    "headline": "Software Engineer at Tech Corp",
    "bio": "Experienced developer...",
    "email": "john.doe@upsamail.edu.gh",
    "skills": [
      { "skillName": "JavaScript", "proficiencyLevel": "INTERMEDIATE" }
    ],
    "workExperiences": [...],
    "educations": [...],
    "certifications": [...]
  }
}
```

#### 2. Manual Profile Entry

**Process:**
1. Graduate selects "Manual Fill"
2. Fills in all required fields:
   - Full name
   - Headline
   - Bio
   - LinkedIn URL (optional)
   - Skills (at least 1 required)
   - Jobs they can do (at least 1 required)
   - Education
   - Work experience
   - Certifications
3. Uploads profile picture (optional)
4. Submits profile

**Validation Rules:**
- At least 1 skill required
- At least 1 job role required
- Email must be verified
- LinkedIn URL format validated if provided

### Profile Management

**Endpoint:** `PUT /api/graduates/{id}`

**Features:**
- Update personal information
- Add/remove skills
- Add/remove job roles
- Update education
- Update work experience
- Update certifications
- Change profile picture

**Request Body:**
```json
{
  "fullName": "John Doe",
  "headline": "Senior Software Engineer",
  "bio": "Updated bio...",
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "profilePicture": "https://example.com/image.jpg",
  "skills": [
    { "skillName": "JavaScript", "proficiencyLevel": "ADVANCED" },
    { "skillName": "Python", "proficiencyLevel": "INTERMEDIATE" }
  ],
  "jobsCanDo": [
    { "jobTitle": "Software Developer" },
    { "jobTitle": "Full Stack Developer" }
  ],
  "educations": [...],
  "workExperiences": [...],
  "certifications": [...]
}
```

### Graduate Dashboard

**Endpoint:** `GET /api/graduates/me/profile-status`

**Features:**
- Profile summary card with avatar
- Skills display
- Job recommendations based on skills
- Course recommendations based on skills
- Profile strength indicator
- Quick settings (public profile, open to work)

**Dashboard Sections:**

1. **Profile Summary**
   - Avatar with initials
   - Full name
   - Headline
   - Verification badges
   - Link to edit profile

2. **My Skills**
   - Display all skills as badges
   - Skill count
   - Link to add more skills

3. **Jobs for You**
   - Recommended jobs based on skill matching
   - Job title, company, required skills
   - Apply button linking to job listings
   - "Explore all jobs" link

4. **Upskill Yourself**
   - Course recommendations based on skills
   - Course title, platform
   - External link to course
   - "Browse all learning resources" link

### Course Recommendations

**Endpoint:** `GET /api/courses?skillTag={skill}`

**Features:**
- View courses tagged to specific skills
- Browse all available courses
- External links to learning platforms (YouTube, Coursera, Udemy, etc.)

**Response:**
```json
{
  "success": true,
  "message": "Course resources retrieved",
  "data": [
    {
      "id": "uuid",
      "title": "Advanced JavaScript Course",
      "url": "https://coursera.com/...",
      "platform": "Coursera",
      "skillTag": "JavaScript"
    }
  ]
}
```

---

## Employer Features

### Employer Dashboard

**Features:**
- Company profile summary
- Posted jobs overview
- Quick actions (post new job)
- Job management links

### Post a Job

**Endpoint:** `POST /api/jobs`

**Process:**
1. Employer clicks "Post a Job"
2. Fills in job details:
   - Job title
   - Description
   - Required skills (comma-separated)
3. Submits job posting
4. Job listed on platform

**Request Body:**
```json
{
  "title": "Software Developer",
  "description": "We are looking for...",
  "requiredSkills": ["JavaScript", "React", "Node.js"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job posted successfully",
  "data": {
    "id": "uuid",
    "title": "Software Developer",
    "description": "We are looking for...",
    "requiredSkills": ["JavaScript", "React", "Node.js"],
    "isActive": true,
    "createdAt": "2026-04-24T10:00:00Z"
  }
}
```

### Browse Graduates

**Endpoint:** `GET /api/graduates`

**Features:**
- View all verified graduates
- Filter by skill
- Graduate cards showing:
  - Profile picture
  - Full name
  - Headline
  - Skills (up to 2 shown)
  - Jobs they can do

**Response:**
```json
{
  "success": true,
  "message": "Graduates retrieved",
  "data": [
    {
      "id": "uuid",
      "fullName": "John Doe",
      "headline": "Software Engineer",
      "profilePicture": "https://example.com/image.jpg",
      "skills": [
        { "id": "uuid", "skillName": "JavaScript" }
      ],
      "jobsCanDo": ["Software Developer", "Full Stack Developer"]
    }
  ]
}
```

### View Graduate Profile

**Endpoint:** `GET /api/graduates/{id}`

**Features:**
- Full graduate profile view
- Profile picture
- Full name, headline, bio
- All skills
- All jobs they can do
- Work experience
- Education
- Certifications
- LinkedIn URL

**Response:**
```json
{
  "success": true,
  "message": "Graduate profile retrieved",
  "data": {
    "id": "uuid",
    "fullName": "John Doe",
    "headline": "Software Engineer",
    "bio": "Experienced developer...",
    "profilePicture": "https://example.com/image.jpg",
    "linkedinUrl": "https://linkedin.com/in/johndoe",
    "skills": [...],
    "jobsCanDo": [...],
    "workExperiences": [...],
    "educations": [...],
    "certifications": [...]
  }
}
```

### Manage Job Postings

**Endpoints:**
- `PUT /api/jobs/{id}` - Update job posting
- `DELETE /api/jobs/{id}` - Delete job posting

**Features:**
- Edit job details
- Deactivate/reactivate job postings
- Delete job postings

---

## Admin Features

### Admin Dashboard

**Endpoint:** `GET /api/admin/stats`

**Features:**
- Platform statistics:
  - Total graduates
  - Total employers
  - Total job postings
  - Top skills
- Verified graduates list
- Search functionality
- Delete graduate capability

**Response:**
```json
{
  "success": true,
  "message": "Platform stats retrieved",
  "data": {
    "totalGraduates": 150,
    "totalEmployers": 45,
    "totalJobPostings": 78,
    "topSkills": {
      "JavaScript": 45,
      "Python": 38,
      "React": 32
    }
  }
}
```

### Manage Graduates

**Endpoint:** `DELETE /api/admin/graduates/{id}`

**Features:**
- View all graduates
- Search graduates
- Delete inappropriate profiles

### Manage Job Postings

**Endpoint:** `DELETE /api/admin/jobs/{id}`

**Features:**
- View all job postings
- Delete inappropriate job posts

### Manage Course Resources

**Endpoints:**
- `POST /api/courses` - Add course resource
- `DELETE /api/courses/{id}` - Delete course resource

**Features:**
- Add new learning resources
- Tag resources to skills
- Delete outdated resources

**Add Course Request:**
```json
{
  "title": "Advanced React Patterns",
  "url": "https://example.com/course",
  "platform": "Udemy",
  "skillTag": "React"
}
```

---

## Public Features

### Landing Page

**Features:**
- Hero section with value proposition
- Call-to-action buttons for graduates and employers
- "How It Works" section
- Social proof (number of graduates hired)
- Footer with branding

### Job Listings

**Endpoint:** `GET /api/jobs`

**Features:**
- View all active job postings
- Job cards showing:
  - Job title
  - Company name
  - Required skills
- Filter by skill (optional)

**Response:**
```json
{
  "success": true,
  "message": "Job postings retrieved",
  "data": [
    {
      "id": "uuid",
      "title": "Software Developer",
      "companyName": "Tech Corp",
      "requiredSkills": ["JavaScript", "React"],
      "isActive": true,
      "createdAt": "2026-04-24T10:00:00Z"
    }
  ]
}
```

### Course Resources

**Endpoint:** `GET /api/courses`

**Features:**
- Browse all learning resources
- Filter by skill tag
- External links to courses

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/graduate/register` | Register graduate | No |
| GET | `/api/auth/graduate/verify-email` | Verify email | No |
| POST | `/api/auth/graduate/login` | Graduate login | No |
| POST | `/api/auth/admin/login` | Admin login | No |
| GET | `/api/auth/employer/google` | Google OAuth | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Graduates

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/graduates` | Get all graduates | No |
| GET | `/api/graduates/{id}` | Get graduate by ID | No |
| PUT | `/api/graduates/{id}` | Update profile | Yes (Graduate) |
| POST | `/api/graduates/upload-pdf` | Upload LinkedIn PDF | Yes (Graduate) |
| GET | `/api/graduates/me/profile-status` | Check profile status | Yes (Graduate) |

### Employers

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/employers/{id}` | Get employer by ID | Yes (Employer) |
| PUT | `/api/employers/{id}` | Update profile | Yes (Employer) |

### Jobs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/jobs` | Get all jobs | No |
| GET | `/api/jobs/{id}` | Get job by ID | No |
| POST | `/api/jobs` | Post new job | Yes (Employer) |
| PUT | `/api/jobs/{id}` | Update job | Yes (Employer) |
| DELETE | `/api/jobs/{id}` | Delete job | Yes (Employer/Admin) |

### Courses

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/courses` | Get all courses | No |
| GET | `/api/courses?skillTag={skill}` | Get courses by skill | No |
| POST | `/api/courses` | Add course | Yes (Admin) |
| DELETE | `/api/courses/{id}` | Delete course | Yes (Admin) |

### Admin

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/stats` | Get platform stats | Yes (Admin) |
| DELETE | `/api/admin/graduates/{id}` | Delete graduate | Yes (Admin) |
| DELETE | `/api/admin/jobs/{id}` | Delete job posting | Yes (Admin) |

---

## Data Models

### Graduate

```typescript
{
  id: UUID;
  fullName: string;
  email: string; // @upsamail.edu.gh only
  passwordHash: string;
  profilePicture?: string;
  headline?: string;
  bio?: string;
  linkedInUrl?: string;
  isVerified: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
  skills: Skill[];
  jobsCanDo: JobCanDo[];
  educations: Education[];
  workExperiences: WorkExperience[];
  certifications: Certification[];
}
```

### Employer

```typescript
{
  id: UUID;
  companyName: string;
  email: string; // Gmail only
  googleId: string;
  profilePicture?: string;
  isVerified: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
  jobPostings: JobPosting[];
}
```

### Admin

```typescript
{
  id: UUID;
  fullName: string;
  email: string;
  passwordHash: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### Skill

```typescript
{
  id: UUID;
  graduateId: UUID;
  skillName: string;
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}
```

### JobCanDo

```typescript
{
  id: UUID;
  graduateId: UUID;
  jobTitle: string;
}
```

### Education

```typescript
{
  id: UUID;
  graduateId: UUID;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: Date;
  endDate?: Date;
}
```

### WorkExperience

```typescript
{
  id: UUID;
  graduateId: UUID;
  jobTitle: string;
  company: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
}
```

### Certification

```typescript
{
  id: UUID;
  graduateId: UUID;
  name: string;
  issuingOrganization?: string;
  issueDate?: Date;
}
```

### JobPosting

```typescript
{
  id: UUID;
  employerId: UUID;
  title: string;
  description: string;
  requiredSkills: string[];
  isActive: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### CourseResource

```typescript
{
  id: UUID;
  title: string;
  url: string;
  platform: string; // YouTube, Coursera, Udemy, etc.
  skillTag: string;
  addedBy: UUID; // Admin ID
  createdAt: DateTime;
}
```

---

## Validation Rules

| Rule | Description | Enforced By |
|------|-------------|-------------|
| UPSA Email Only | Graduate email must be `@upsamail.edu.gh` | Frontend + Backend |
| Email Verification | Email must be verified before login | Backend |
| Minimum Skills | At least 1 skill required on profile | Frontend + Backend |
| Minimum Jobs | At least 1 job role required on profile | Frontend + Backend |
| LinkedIn URL Format | Valid LinkedIn URL if provided | Frontend + Backend |
| PDF Validation | Only valid PDF files accepted | Backend |
| Gmail Only | Employer must use Gmail for OAuth | Backend |
| Job Skills | Job posting must have at least 1 required skill | Frontend + Backend |
| Course Skill Tag | Course resource must have a skill tag | Frontend + Backend |

---

## Security Features

- **JWT Authentication:** Token-based authentication for all protected endpoints
- **Password Encryption:** BCrypt hashing for all passwords
- **Role-Based Access Control:** Spring Security enforces role permissions
- **Email Verification:** Required for graduate accounts
- **OAuth2:** Google OAuth for employer authentication
- **CORS Configuration:** Controlled cross-origin access
- **Input Validation:** Jakarta Validation on all request DTOs

---

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

**Common Error Codes:**
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

---

## Future Enhancements

- Direct messaging between graduates and employers
- Profile view notifications for graduates
- Advanced job matching algorithm
- Skill assessment tests
- Video profile introductions
- Mobile application
- Analytics dashboard for employers
- Skill gap analysis
- Automated course recommendations
- Integration with job boards
