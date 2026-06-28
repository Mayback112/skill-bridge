# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SkillBridge is a web platform connecting UPSA graduates with employers. Graduates showcase digital skills and employers post jobs to find suitable candidates. The platform also suggests learning resources.

**Stack:**
- Backend: Java 17, Spring Boot 3.4, Spring Security, JPA, PostgreSQL, Flyway
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- Auth: JWT (Graduate/Admin), Google OAuth2 (Employer)

## Common Commands

### Backend (Java/Gradle)

```bash
# Run the full application (builds frontend automatically)
./gradlew bootRun

# Build only
./gradlew build

# Run tests
./gradlew test

# Clean all build artifacts
./gradlew clean
```

### Frontend (React/Vite)

```bash
cd skill-bridge-frontend

# Install dependencies
npm install

# Run dev server (port 5173)
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

### Database

Flyway migrations are in `src/main/resources/db/migration/`. They run automatically on startup.

## Architecture

### Backend Structure

```
src/main/java/com/skillbridge/
├── auth/              # OAuth2 handlers, JWT filter
├── config/            # Security, CORS, Web MVC config
├── controller/        # REST endpoints
├── dto/               # Request/Response objects
├── entity/            # JPA entities (Graduate, Employer, Admin, etc.)
├── enums/             # Role, ProficiencyLevel
├── exception/         # Global exception handler
├── repository/        # JPA repositories
└── service/           # Business logic (JwtService, EmailService, PdfParserService)
```

### Frontend Structure

```
skill-bridge-frontend/src/
├── api/               # Axios services (auth, graduate, employer, job, admin, course)
├── context/           # React Context (AuthContext)
├── pages/             # Page components organized by role (admin, auth, employer, graduate, onboarding, public)
├── components/        # Reusable UI components
├── routes/            # React Router configuration
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

### Key Entities

- **Graduate**: UPSA students/graduates with skills, education, work experience, certifications
- **Employer**: Companies posting jobs (Google OAuth only)
- **Admin**: Platform moderators
- **JobPosting**: Job listings with required skills
- **CourseResource**: Learning resources tagged to skills

### Authentication Flow

1. **Graduate**: Register with `@upsamail.edu.gh` email → verification link sent → email verified → login with password → JWT issued
2. **Employer**: Google OAuth → account created automatically → JWT issued
3. **Admin**: Platform credentials → JWT issued

JWT is stored in both `localStorage` and `sessionStorage`. The `AuthContext` manages auth state and verifies tokens with backend on load.

### Security

- Role-based access control via Spring Security (`SecurityConfig.java`)
- JWT authentication via `JwtAuthFilter`
- Public endpoints: auth, browse graduates/jobs/courses
- Protected endpoints: `/api/admin/**` (ADMIN), `/api/jobs` POST/PUT/DELETE (EMPLOYER), `/api/graduates/**` PUT (GRADUATE)

### PDF Parsing

`PdfParserService` parses LinkedIn PDF exports using Apache PDFBox. It extracts:
- Name, headline, bio, email
- Skills (mapped to `JobCanDo` as well)
- Work experience, education, certifications

### Email Validation

All emails are converted to lowercase before storage and validation. UPSA email domain is enforced for graduates.

## Important Patterns

### Backend

- Use `@Valid` on request DTOs for validation
- Return `ApiResponse<T>` wrapper for consistent responses
- Services handle business logic; controllers delegate
- Entities use Lombok `@Builder` pattern
- UUID primary keys for all entities

### Frontend

- Use `axiosInstance` for all API calls (auto-attaches JWT)
- Auth state managed via `AuthContext` - use `useAuth()` hook
- Role-based routing guards in `routes.tsx`
- shadcn/ui components in `components/ui/`
- TypeScript types in `types/` directory

### Build Integration

The Gradle build automatically:
1. Installs frontend dependencies (`installFrontend`)
2. Builds frontend (`buildFrontend`)
3. Copies frontend dist to `src/main/resources/static` (`copyFrontendToStatic`)
4. Serves React app from Spring Boot static resources

## Environment Variables

Backend (in `application.yaml`):
- Database URL, username, password
- JWT secret
- Email server config (SMTP)
- Google OAuth client ID/secret

Frontend (in `skill-bridge-frontend/.env`):
- `VITE_API_BASE_URL`: Backend API URL (default: `/api`)

## Testing

Run backend tests with `./gradlew test`. The test suite is minimal - add tests for new features.
