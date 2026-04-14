# GEMINI.md - SKILLBRIDGE GH
## Project Overview
SKILLBRIDGE GH is a digital skills portal designed to connect graduates from UPSA (University of Professional Studies, Accra) with potential employers. It features a modern React frontend and a robust Spring Boot backend. The project is configured as a single-port application where the Spring Boot backend serves the React SPA on port `8080`.

### Project Structure (Monorepo)
- **`/` (Root):** Gradle-based Java backend.
- **`skill-bridge-frontend/`:** Vite-based React frontend.

---

## Unified Execution (Backend + Frontend)
The project is configured so that building the backend also builds the frontend and packages it within the Spring Boot JAR.

### Running the Project (Port 8080)
```bash
# This builds the frontend AND runs the backend
./gradlew bootRun
```
Once running, you can access the full application (both API and UI) at `http://localhost:8080`.

### Building for Production
```bash
./gradlew build
```
The final JAR will contain the static frontend assets in `BOOT-INF/classes/static/`.

---

## Backend (Spring Boot)
...

The backend is a REST API built with Java 17 and Spring Boot 3.4.1.

### Core Technologies
- **Framework:** Spring Boot 3.4.1
- **Language:** Java 17
- **Security:** Spring Security with JWT and OAuth2 (Google)
- **Database:** PostgreSQL with Flyway for migrations
- **ORM:** Spring Data JPA (Hibernate)
- **Mapping:** MapStruct & Lombok
- **Document Processing:** Apache PDFBox (for LinkedIn profile parsing)
- **Mailing:** Spring Boot Starter Mail

### Building and Running
```bash
# Build the project
./gradlew build

# Run the backend
./gradlew bootRun

# Run tests
./gradlew test
```

### Backend Architecture
The backend follows a layered architecture:
- `controller/`: REST endpoints.
- `service/`: Business logic.
- `repository/`: Data access (Spring Data JPA).
- `dto/`: Data transfer objects.
- `entity/`: Database entities.
- `auth/`: Security and JWT logic.
- `config/`: Spring configuration (Security, Mail, etc.).
- `db/migration/`: Flyway SQL migration files.

---

## Frontend (React)
The frontend is a modern SPA using React 19, Vite, and Tailwind CSS.

### Core Technologies
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + Shadcn UI
- **Routing:** React Router DOM v7
- **Form Handling:** React Hook Form + Zod
- **Icons:** Lucide React
- **Notifications:** React Hot Toast / Sonner

### Documentation
For detailed frontend information, see:
- [`skill-bridge-frontend/GEMINI.md`](skill-bridge-frontend/GEMINI.md)
- [`skill-bridge-frontend/SKILLBRIDGE_FULL_DOCS.md`](skill-bridge-frontend/SKILLBRIDGE_FULL_DOCS.md)

### Building and Running
```bash
cd skill-bridge-frontend
npm install
npm run dev
```

---

## Development Conventions

### 1. General
- **Surgical Updates:** When modifying code, adhere strictly to existing patterns and conventions.
- **Verification:** Always verify changes by running tests or the application.
- **Documentation:** Keep `GEMINI.md` and other documentation updated with architectural changes.

### 2. Backend (Java/Spring)
- **RESTful API:** Follow REST principles for controller design.
- **DTO Pattern:** Use DTOs for request/response bodies; do not expose entities directly.
- **Security:** Use JWT for session management and standard Spring Security filters.
- **Validation:** Use `@Valid` and Bean Validation annotations in DTOs.
- **Migrations:** All schema changes must be performed via Flyway migrations in `src/main/resources/db/migration`.

### 3. Frontend (React/TS)
- **Strict TypeScript:** No `any` types. Ensure all interfaces are defined in `types/`.
- **Reusable Components:** Leverage Shadcn UI components from `components/ui/`.
- **Axios Interceptors:** All authenticated requests must use the `axiosInstance`.
- **Role Guards:** Use `ProtectedRoute` and `RoleRoute` to manage access.

---

## Key Features
- **LinkedIn PDF Parsing:** Graduates can upload their LinkedIn PDF profiles to auto-populate their skill sets.
- **Skill-Based Discovery:** Employers find graduates based on skill matching.
- **Course Recommendations:** Automatic suggestions of learning resources based on the graduate's skills.
- **Multi-Role Authentication:**
    - **Graduates:** UPSA email + verification link.
    - **Employers:** Google OAuth (Gmail).
    - **Admin:** System credentials.

---

## Environment Configuration
The application uses environment variables for configuration (see `application.yaml` and `.env` in the frontend).

### Required Environment Variables (Backend)
- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`: PostgreSQL connection details.
- `JWT_SECRET`: Secret key for JWT signing.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: For Google OAuth.
- `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`: For email verification.
