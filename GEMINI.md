# GEMINI.md - SkillBridge GH

## Project Overview
**SkillBridge GH** is a digital skills portal connecting graduates from UPSA (University of Professional Studies, Accra) with potential employers. It features LinkedIn PDF parsing for profile automation, skill-based candidate discovery, and personalized course recommendations.

### Core Technologies
- **Backend:** Spring Boot 3.4.1 (Java 17), PostgreSQL, Spring Data JPA, Hibernate, Flyway.
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Shadcn UI.
- **Security:** Spring Security, JWT (JJWT), OAuth2 (Google for Employers).
- **Integrations:** Apache PDFBox (PDF parsing), JavaMailSender (Verification).

---

## Project Structure
```text
skill-bridge/
├── src/main/java/com/skillbridge/   # Spring Boot Backend
│   ├── auth/                        # Security (JWT & OAuth2)
│   ├── config/                      # App & Security Configuration
│   ├── controller/                  # REST API Endpoints
│   ├── dto/                         # Data Transfer Objects
│   ├── entity/                      # JPA Entities
│   ├── repository/                  # JPA Repositories
│   ├── service/                     # Business Logic
│   └── util/                        # Utilities (PDF Parser, etc.)
├── src/main/resources/
│   ├── application.yaml             # Main configuration
│   └── db/migration/                # Flyway SQL Migrations (V1-V10)
├── skill-bridge-frontend/           # React Frontend (Vite)
│   ├── src/
│   │   ├── api/                     # Axios instance & API services
│   │   ├── components/              # UI Components (shadcn/ui + custom)
│   │   ├── pages/                   # Role-based pages
│   │   ├── routes/                  # Router & Guards
│   │   └── types/                   # TypeScript Interfaces
│   └── tailwind.config.ts           # Tailwind Configuration
└── build.gradle.kts                 # Root Gradle build (integrates frontend)
```

---

## Building and Running

### Full Application (Backend + Frontend)
The project is configured to serve the frontend from the backend's static directory.
```bash
./gradlew bootRun
```
*Access at: http://localhost:8080*

### Frontend Development Mode
Run independently for Hot Module Replacement (HMR):
```bash
cd skill-bridge-frontend
npm install
npm run dev
```
*Access at: http://localhost:5173 (Requires backend running for API)*

### Backend Only
```bash
./gradlew bootRun
```

### Tests
```bash
./gradlew test
```

---

## Development Conventions

### Backend (Java/Spring)
- **DTOs:** Never expose JPA Entities directly. Always use DTOs for API requests and responses.
- **Mapping:** Use MapStruct for entity-DTO conversions.
- **Validation:** Use Bean Validation (`@Valid`, `@NotBlank`, etc.) in DTOs.
- **Migrations:** All schema changes must be added as Flyway migrations in `src/main/resources/db/migration/`.
- **Lombok:** Use `@Data`, `@Builder`, and `@RequiredArgsConstructor` to reduce boilerplate.

### Frontend (React/TypeScript)
- **Strict Typing:** No `any`. Define all interfaces in `src/types/`.
- **UI Components:** Use Shadcn UI primitives (in `src/components/ui/`) for consistency.
- **API Calls:** Use the shared `axiosInstance` in `src/api/` which handles JWT attachment.
- **Styling:** Tailwind CSS is preferred. Avoid inline styles or modular CSS unless necessary.
- **Forms:** Use `react-hook-form` with `zod` for schema validation.

### General
- **Security:** Sensitive values (DB, JWT, OAuth) are managed via environment variables.
- **Branching:** Ensure changes are surgical and respect existing architectural patterns.
- **Documentation:** Keep `GEMINI.md` and role-specific documentation updated.

---

## Key Configuration (Environment Variables)
| Variable | Description |
|---|---|
| `DB_URL` | JDBC URL for PostgreSQL |
| `DB_USERNAME` | Database User |
| `DB_PASSWORD` | Database Password |
| `JWT_SECRET` | Signing key for JWT (min 32 chars) |
| `GOOGLE_CLIENT_ID` | OAuth2 Client ID for Employer Login |
| `GOOGLE_CLIENT_SECRET` | OAuth2 Client Secret |
