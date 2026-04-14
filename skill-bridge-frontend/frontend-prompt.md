# SKILLBRIDGE GH — Frontend Master Prompt (Claude Code)

-----

You are the sole frontend engineer for SKILLBRIDGE GH, a web-based digital skills portal connecting UPSA graduates with employers. You have been provided with SKILLBRIDGE_FULL_DOCS.md as your single source of truth. Read it fully before doing anything.

-----

## Your Frontend Stack

- Framework: React 18 + TypeScript (strict mode)
- Routing: React Router v6
- Styling: Tailwind CSS — use the existing project template/setup already configured. Match the existing color scheme, font, and design tokens already present in the project. Do not introduce new colors or override existing Tailwind config.
- HTTP Client: Axios (with interceptors for JWT)
- State Management: React Context API (auth state) + useState/useReducer (local state)
- Form Handling: React Hook Form + Zod (validation)
- Icons: Lucide React
- Notifications: React Hot Toast
- Build Tool: Vite

-----

## Project Structure

Create and maintain this exact structure:
frontend/
└── src/
├── api/
│   ├── axiosInstance.ts        ← base axios config + JWT interceptor
│   ├── authApi.ts
│   ├── graduateApi.ts
│   ├── employerApi.ts
│   ├── jobApi.ts
│   └── courseApi.ts
├── components/
│   ├── common/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Loader.tsx
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   └── ApiResponse.tsx
│   ├── graduate/
│   │   ├── GraduateCard.tsx
│   │   ├── GraduateProfile.tsx
│   │   ├── SkillTag.tsx
│   │   └── CourseCard.tsx
│   ├── employer/
│   │   ├── JobCard.tsx
│   │   └── JobForm.tsx
│   └── admin/
│       └── StatCard.tsx
├── context/
│   └── AuthContext.tsx
├── hooks/
│   ├── useAuth.ts
│   └── usePdfParser.ts
├── pages/
│   ├── public/
│   │   ├── LandingPage.tsx
│   │   ├── GraduateListPage.tsx
│   │   ├── GraduateProfilePage.tsx
│   │   └── JobListPage.tsx
│   ├── auth/
│   │   ├── GraduateRegisterPage.tsx
│   │   ├── GraduateLoginPage.tsx
│   │   ├── VerifyEmailPage.tsx
│   │   └── EmployerLoginPage.tsx
│   ├── onboarding/
│   │   ├── OnboardingMethodPage.tsx
│   │   ├── LinkedInUploadPage.tsx
│   │   └── ManualFillPage.tsx
│   ├── graduate/
│   │   └── GraduateDashboardPage.tsx
│   ├── employer/
│   │   ├── EmployerDashboardPage.tsx
│   │   └── PostJobPage.tsx
│   └── admin/
│       └── AdminDashboardPage.tsx
├── routes/
│   ├── AppRouter.tsx
│   ├── ProtectedRoute.tsx
│   └── RoleRoute.tsx
├── types/
│   ├── graduate.types.ts
│   ├── employer.types.ts
│   ├── job.types.ts
│   ├── course.types.ts
│   └── auth.types.ts
└── utils/
├── tokenUtils.ts
└── validators.ts

-----

## Routing Structure
/                                   → LandingPage (PUBLIC)
/graduates                          → GraduateListPage (PUBLIC)
/graduates/:id                      → GraduateProfilePage (PUBLIC)
/jobs                               → JobListPage (PUBLIC)

/auth/graduate/register             → GraduateRegisterPage (PUBLIC)
/auth/graduate/login                → GraduateLoginPage (PUBLIC)
/auth/graduate/verify-email         → VerifyEmailPage (PUBLIC)
/auth/employer/login                → EmployerLoginPage (PUBLIC)

/onboarding/method                  → OnboardingMethodPage (GRADUATE)
/onboarding/linkedin                → LinkedInUploadPage (GRADUATE)
/onboarding/manual                  → ManualFillPage (GRADUATE)

/dashboard/graduate                 → GraduateDashboardPage (GRADUATE)
/dashboard/employer                 → EmployerDashboardPage (EMPLOYER)
/dashboard/employer/post-job        → PostJobPage (EMPLOYER)
/dashboard/admin                    → AdminDashboardPage (ADMIN)

-----

## Screens — Full Detail

-----

### 1. Landing Page /
Purpose: First impression — explains the platform and directs users to the right place.

Layout:
┌─────────────────────────────────────────┐
│  NAVBAR                                 │
│  Logo (left)   Graduates | Jobs (center)│
│  Login (right)                          │
├─────────────────────────────────────────┤
│  HERO SECTION (full width)              │
│  Large heading: "Connect Skills         │
│  With Opportunity"                      │
│  Subtext: platform description          │
│  Two CTA buttons:                       │
│  [ I'm a Graduate ] [ I'm an Employer ] │
├─────────────────────────────────────────┤
│  HOW IT WORKS (3 columns)               │
│  1. Graduate lists skills               │
│  2. Employer searches                   │
│  3. Opportunity found                   │
├─────────────────────────────────────────┤
│  FEATURED GRADUATES (horizontal scroll) │
│  3-4 graduate cards preview             │
│  [ View All Graduates → ]               │
├─────────────────────────────────────────┤
│  FOOTER                                 │
└─────────────────────────────────────────┘

Component details:

- Navbar: logo left, nav links center, Login button right
- Hero: large bold heading, short subtext, two solid CTA buttons side by side
- How it works: 3 icon + heading + text columns with dividers
- Featured graduates: horizontal scrollable row of GraduateCard components
- Footer: platform name, links, copyright

-----

### 2. Graduate Register Page /auth/graduate/register

Purpose: UPSA graduate creates an account.

Layout:
┌─────────────────────────────────────────┐
│  NAVBAR (minimal — logo only)           │
├─────────────────────────────────────────┤
│  CENTER CARD (max-w-md, centered)       │
│                                         │
│  Heading: "Create your account"         │
│  Subtext: "UPSA graduates only"         │
│                                         │
│  [ Full Name input ]                    │
│  [ UPSA Email input ]                   │
│  [ Password input ]                     │
│  [ Confirm Password input ]             │
│                                         │
│  [ Create Account button (full width) ] │
│                                         │
│  "Already have an account? Login"       │
└─────────────────────────────────────────┘

Validation (inline errors):

- Full name required
- Email must end with @upsa.edu.gh — show error immediately on blur
- Password min 8 characters
- Confirm password must match

On success:

- Show success toast: “Check your UPSA email to verify your account”
- Redirect to /auth/graduate/login

-----

### 3. Verify Email Page /auth/graduate/verify-email

Purpose: Handles email verification link click.

Layout:
┌─────────────────────────────────────────┐
│  CENTER (full screen centered)          │
│                                         │
│  [spinner while verifying]              │
│                                         │
│  On success:                            │
│  ✅ "Email verified successfully!"      │
│  [ Go to Login ]                        │
│                                         │
│  On failure:                            │
│  ❌ "Link expired or invalid"           │
│  [ Resend verification email ]          │
└─────────────────────────────────────────┘

-----

### 4. Graduate Login Page /auth/graduate/login

Layout:
┌─────────────────────────────────────────┐
│  NAVBAR (minimal — logo only)           │
├─────────────────────────────────────────┤
│  CENTER CARD (max-w-md, centered)       │
│                                         │
│  Heading: "Welcome back"                │
│                                         │
│  [ UPSA Email input ]                   │
│  [ Password input ]                     │
│                                         │
│  [ Login button (full width) ]          │
│                                         │
│  "Don't have an account? Register"      │
└─────────────────────────────────────────┘

On success:

- If profile incomplete → redirect to /onboarding/method

- If profile complete → redirect to /dashboard/graduate

-----

### 5. Employer Login Page /auth/employer/login

Layout:
┌─────────────────────────────────────────┐
│  NAVBAR (minimal — logo only)           │
├─────────────────────────────────────────┤
│  CENTER CARD (max-w-md, centered)       │
│                                         │
│  Heading: "Employer Login"              │
│  Subtext: "Sign in with your Gmail      │
│  account to continue"                   │
│                                         │
│  [ 🔵 Continue with Google (full width)]│
│                                         │
│  "Looking for a job? Register as        │
│   a Graduate"                           │
└─────────────────────────────────────────┘

On success:

- Redirect to /dashboard/employer

-----

### 6. Onboarding Method Page /onboarding/method

Purpose: Graduate picks how to set up their profile.

Layout:
┌─────────────────────────────────────────┐
│  NAVBAR (minimal — logo + step 1 of 2)  │
├─────────────────────────────────────────┤
│  CENTER (max-w-lg)                      │
│                                         │
│  Heading: "Set up your profile"         │
│  Subtext: "How would you like to        │
│  get started?"                          │
│                                         │
│  ┌───────────────┐ ┌───────────────┐   │
│  │  LinkedIn     │ │  Fill Manual  │   │
│  │  icon         │ │  icon         │   │
│  │               │ │               │   │
│  │  "Use my      │ │  "I'll type   │   │
│  │  LinkedIn     │ │  it myself"   │   │
│  │  profile"     │ │               │   │
│  └───────────────┘ └───────────────┘   │
│        (two equal clickable cards)      │
└─────────────────────────────────────────┘

-----

### 7. LinkedIn Upload Page /onboarding/linkedin

Layout:
┌─────────────────────────────────────────┐
│  NAVBAR (minimal — step 1 of 2)         │
├─────────────────────────────────────────┤
│  CENTER (max-w-lg)                      │
│                                         │
│  Heading: "Connect your LinkedIn"       │
│                                         │
│  [ LinkedIn URL input ]                 │
│  placeholder: linkedin.com/in/yourname  │
│                                         │
│  ── then ──                             │
│                                         │
│  Heading: "Upload your LinkedIn PDF"    │
│                                         │
│  TUTORIAL STEPS (numbered list):        │
│  1. Go to your LinkedIn profile         │
│  2. Click More → Save to PDF            │
│  3. Download the PDF                    │
│  4. Upload below                        │
│                                         │
│  [ Drag & drop PDF or click to upload ] │
│  (dashed border upload zone)            │
│                                         │
│  [ Continue button (full width) ]       │
│  (disabled until PDF selected)          │
└─────────────────────────────────────────┘

On upload:

- Send PDF to POST /api/graduates/upload-pdf
- Show loading spinner: “Reading your profile…”
- On success → redirect to /onboarding/manual with pre-filled data

-----

### 8. Manual Fill Page /onboarding/manual

Purpose: Graduate fills or reviews/edits their profile (used by both routes).

Layout:
┌─────────────────────────────────────────┐
│  NAVBAR (minimal — step 2 of 2)         │
├─────────────────────────────────────────┤
│  TWO COLUMN (left form, right preview)  │
│                                         │
│  LEFT — FORM SECTIONS (scrollable):     │
│                                         │
│  📷 Profile Picture                     │
│  [ Upload image or skip ]               │
│                                         │
│  👤 Basic Info                          │
│  [ Full Name ]                          │
│  [ Headline ]                           │
│  [ Bio / About (textarea) ]             │
│                                         │
│  🛠️ Skills                              │
│  [ Skill name ] [ Level dropdown ] [+]  │
│  (list of added skills with remove ×)   │
│                                         │

│  💼 Jobs I Can Do                       │
│  [ Job title input ] [+]                │
│  (list of added jobs with remove ×)     │
│                                         │
│  🎓 Education                           │
│  [ Institution ] [ Degree ]             │
│  [ Field ] [ Start ] [ End ] [+]        │
│                                         │
│  🏢 Work Experience                     │
│  [ Title ] [ Company ]                  │
│  [ Start ] [ End ] [ Description ] [+]  │
│                                         │
│  📜 Certifications                      │
│  [ Name ] [ Org ] [ Date ] [+]          │
│                                         │
│  RIGHT — LIVE PREVIEW CARD:             │
│  Shows how profile looks to employers   │
│  Updates as graduate types              │
│                                         │
│  [ Submit Profile (full width) ]        │
└─────────────────────────────────────────┘

On submit:

- Validate at least 1 skill and 1 job added
- PUT /api/graduates/{id}
- Toast: “Profile saved!”
- Redirect to /dashboard/graduate

-----

### 9. Graduate Dashboard /dashboard/graduate

Layout:
┌─────────────────────────────────────────┐
│  NAVBAR (full — logo, links, avatar)    │
├──────────┬──────────────────────────────┤
│ SIDEBAR  │  MAIN CONTENT               │
│          │                             │
│ Profile  │  TOP: Profile summary card  │
│ My Skills│  (picture, name, headline)  │
│ Courses  │                             │
│ Settings │  MIDDLE: My Skills section  │
│          │  skill tags displayed        │
│          │                             │
│          │  BOTTOM: Suggested Courses  │
│          │  "Based on your skills,     │
│          │  you might want to learn:"  │
│          │  [ CourseCard list ]        │
│          │  Each card: title, platform,│
│          │  skill tag, [ Open Link ]   │
└──────────┴─────────────────────────────┘

-----

### 10. Graduate List Page /graduates

Purpose: Public page — employers and anyone browse graduates.

Layout:
┌─────────────────────────────────────────┐
│  NAVBAR (full)                          │
├─────────────────────────────────────────┤
│  PAGE HEADER                            │
│  "Find Talented UPSA Graduates"         │
│                                         │
│  SEARCH & FILTER BAR                    │
│  [ Search by name or skill... ]         │
│  [ Filter by skill dropdown ]           │
├─────────────────────────────────────────┤
│  GRADUATE CARDS GRID (3 columns)        │
│                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ Avatar  │ │ Avatar  │ │ Avatar  │  │
│  │ Name    │ │ Name    │ │ Name    │  │
│  │ Headline│ │ Headline│ │ Headline│  │
│  │ Skills  │ │ Skills  │ │ Skills  │  │
│  │[View →] │ │[View →] │ │[View →] │  │
│  └─────────┘ └─────────┘ └─────────┘  │
│                                         │
│  PAGINATION                             │
└─────────────────────────────────────────┘

GraduateCard component shows:

- Profile picture (Avatar fallback if none)
- Full name
- Headline
- Top 3 skill tags (Badge component)
- “View Profile” button → navigates to /graduates/:id

-----

### 11. Graduate Profile Page /graduates/:id

Purpose: Full profile view — public, employers see this.

Layout:
┌─────────────────────────────────────────┐
│  NAVBAR (full)                          │
├─────────────────────────────────────────┤
│  PROFILE HEADER (full width banner)     │
│  [ Profile Picture (large, left) ]      │
│  Name (large heading)                   │
│  Headline                               │
│  LinkedIn button (if URL exists)        │
├─────────────────────────────────────────┤
│  TWO COLUMN LAYOUT                      │
│                                         │
│  LEFT (2/3 width):                      │
│  📝 About                               │
│  bio text                               │
│                                         │
│  🛠️ Skills                              │
│  skill badges with proficiency level    │
│                                         │

│  💼 Jobs I Can Do                       │
│  listed job titles                      │
│                                         │
│  🏢 Work Experience                     │
│  timeline list                          │
│                                         │
│  📜 Certifications                      │
│  list with org and date                 │
│                                         │
│  RIGHT (1/3 width):                     │
│  🎓 Education                           │
│  institution, degree, dates             │
└─────────────────────────────────────────┘

-----

### 12. Employer Dashboard /dashboard/employer

Layout:
┌─────────────────────────────────────────┐
│  NAVBAR (full — logo, links, avatar)    │
├──────────┬──────────────────────────────┤
│ SIDEBAR  │  MAIN CONTENT               │
│          │                             │
│ My Jobs  │  TOP: Welcome card          │
│ Browse   │  "Welcome, [Company Name]"  │
│ Graduates│                             │
│ Post Job │  MIDDLE: My Job Postings    │
│          │  list of JobCards           │
│          │  each with Edit / Delete    │
│          │                             │
│          │  [ + Post New Job button ]  │
└──────────┴─────────────────────────────┘

-----

### 13. Post Job Page /dashboard/employer/post-job

Layout:
┌─────────────────────────────────────────┐
│  NAVBAR (full)                          │
├─────────────────────────────────────────┤
│  CENTER CARD (max-w-2xl)                │
│                                         │
│  Heading: "Post a Job"                  │
│                                         │
│  [ Job Title input ]                    │
│  [ Job Description textarea ]           │
│                                         │
│  Required Skills:                       │
│  [ Skill input ] [ Add + ]              │
│  (list of added skills with remove ×)   │
│                                         │
│  [ Post Job button (full width) ]       │
└─────────────────────────────────────────┘

-----

### 14. Job List Page /jobs

Layout:
┌─────────────────────────────────────────┐
│  NAVBAR (full)                          │
├─────────────────────────────────────────┤
│  PAGE HEADER                            │
│  "Available Opportunities"              │
│  [ Search by job title or skill ]       │
├─────────────────────────────────────────┤
│  JOB CARDS LIST (single column)         │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Job Title          Company Name │   │
│  │ Required skills (badges)        │   │
│  │ Posted date        [ View → ]   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  PAGINATION                             │
└─────────────────────────────────────────┘

-----

### 15. Admin Dashboard /dashboard/admin

Layout:
┌─────────────────────────────────────────┐
│  NAVBAR (full — admin label)            │
├──────────┬──────────────────────────────┤
│ SIDEBAR  │  MAIN CONTENT               │
│          │                             │
│ Overview │  TOP: STAT CARDS (4 cols)   │
│ Graduates│  [ Total Graduates ]        │
│ Jobs     │  [ Total Employers ]        │
│ Courses  │  [ Total Jobs Posted ]      │
│          │  [ Most Searched Skill ]    │
│          │                             │
│          │  MIDDLE: Graduates Table    │
│          │  Name | Email | Verified    │
│          │  [ Delete ] per row         │
│          │                             │
│          │  BOTTOM: Job Posts Table    │
│          │  Title | Employer | Date    │
│          │  [ Delete ] per row         │
│          │                             │
│          │  COURSES SECTION            │
│          │  [ Add Course Resource ]    │
│          │  list of courses + delete   │
└──────────┴─────────────────────────────┘

-----

## Reusable Components

### GraduateCard

- Props: id, fullName, headline, profilePicture, skills[]
- Shows: Avatar, name, headline, top 3 skill badges, View Profile button

### SkillTag / Badge

- Props: label, level?, color?

- Displays a small pill/chip — used everywhere skills appear

### CourseCard

- Props: title, url, platform, skillTag
- Shows: title, platform badge, skill tag, external link button

### JobCard

- Props: title, companyName, requiredSkills[], createdAt
- Shows: job title, company, skill badges, posted date, view button

### StatCard (Admin)

- Props: label, value, icon
- Shows: icon + large number + label

### Modal

- Generic reusable modal with close button
- Used for: tutorial popup, confirm delete, course add form

-----

## Auth & Token Handling

### AuthContext

Stores: user, role, token, isAuthenticated
Methods: login(), logout(), setUser()

### Axios Interceptor
// Attach JWT to every request
axiosInstance.interceptors.request.use((config) => {
const token = localStorage.getItem('token');
if (token) config.headers.Authorization = `Bearer ${token}`;
return config;
});

// Handle 401 globally — redirect to login
axiosInstance.interceptors.response.use(
(response) => response,
(error) => {
if (error.response?.status === 401) {
localStorage.removeItem('token');
window.location.href = '/auth/graduate/login';
}
return Promise.reject(error);
}
);

### ProtectedRoute
// Redirects to login if not authenticated
<ProtectedRoute> wraps all dashboard routes

### RoleRoute
// Redirects if wrong role tries to access
<RoleRoute role="GRADUATE"> → only graduates pass
<RoleRoute role="EMPLOYER"> → only employers pass
<RoleRoute role="ADMIN">    → only admin passes

-----

## TypeScript Types

Define strict types in /types — no any:
// graduate.types.ts
interface Graduate {
id: string;
fullName: string;
email: string;
profilePicture?: string;
headline?: string;
bio?: string;
linkedInUrl?: string;
skills: Skill[];
jobsCanDo: JobCanDo[];
education: Education[];
workExperience: WorkExperience[];
certifications: Certification[];
}

interface Skill {
id: string;
skillName: string;
proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

// job.types.ts
interface JobPosting {
id: string;
title: string;
description: string;
requiredSkills: string[];
isActive: boolean;
createdAt: string;
employer: {
id: string;
companyName: string;
profilePicture?: string;
};
}

// course.types.ts
interface CourseResource {
id: string;
title: string;
url: string;
platform: string;
skillTag: string;
}

-----

## Validation Rules (Frontend)

|Field              |Rule                                           |
|-------------------|-----------------------------------------------|
|Graduate email     |Must end with @upsa.edu.gh — validate on blur|
|Password           |Min 8 characters                               |
|Confirm password   |Must match password                            |
|LinkedIn URL       |Must be valid URL format                       |
|Skills             |At least 1 required before submitting profile  |
|Jobs Can Do        |At least 1 required before submitting profile  |
|Job title          |Required, min 3 chars                          |
|Job required skills|At least 1 required                            |
|Course URL         |Must be valid URL                              |
|Course skill tag   |Required                                       |

-----

## Build Order — Follow This Strictly
1.  Project setup (Vite + React + TypeScript + Tailwind)
2.  Folder structure
3.  TypeScript types (/types)
4.  Axios instance + interceptors
5.  AuthContext + useAuth hook
6.  Reusable components (Button, Input, Modal, Badge, Avatar, Loader)
7.  AppRouter + ProtectedRoute + RoleRoute
8.  Public pages (Landing, GraduateList, GraduateProfile, JobList)
9.  Auth pages (Register, Login, VerifyEmail, EmployerLogin)
10. Onboarding pages (Method, LinkedIn, Manual)
11. Graduate Dashboard
12. Employer Dashboard + Post Job
13. Admin Dashboard
14. API integration (connect all pages to backend endpoints)
15. Toast notifications
16. Final validation pass on all forms

-----

## Rules You Must Follow

- No `any` types — TypeScript strict mode always

- No inline styles — Tailwind classes only
- Match existing template — use colors, fonts and spacing already defined in the project’s Tailwind config. Do not add new colors or override config
- Mobile responsive — all pages must work on mobile and desktop
- Loading states — every API call must show a loader while pending
- Error states — every API call must handle and display errors
- Empty states — every list must have an empty state message
- Never hardcode API URLs — use environment variable VITE_API_BASE_URL
- Protect all dashboard routes — no unauthenticated access
- Role separation — graduate cannot access employer routes and vice versa

-----

## Environment Variables
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id

-----

## What NOT to Build

- No messaging or chat between graduates and employers
- No payment screens
- No ML or recommendation UI — course suggestions come from the API based on skill tags
- Do not implement any ❓ flagged items from SKILLBRIDGE_FULL_DOCS.md

-----

## Before Every Task

1. Re-read the relevant section of SKILLBRIDGE_FULL_DOCS.md
1. Check the screen layout defined in this prompt
1. Check the TypeScript types before writing any component
1. Follow the build order above
1. Always build the component → wire the API → add loading/error/empty states

-----

*This prompt is tied to SKILLBRIDGE_FULL_DOCS.md — always use both together.*

