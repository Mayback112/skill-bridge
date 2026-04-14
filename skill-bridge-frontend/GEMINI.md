# GEMINI.md - SKILLBRIDGE GH

## Project Overview
SKILLBRIDGE GH is a web-based digital skills portal designed to connect UPSA (University of Professional Studies, Accra) graduates with employers. Graduates can showcase their digital skills, while employers can post jobs and find suitable candidates. The platform also provides learning resource suggestions based on the graduates' skill sets.

### Core Technologies
- **Frontend Framework:** React 19 (SPA) with Vite
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS, PostCSS, Lucide React (Icons), Framer Motion (Animations)
- **UI Components:** Shadcn UI (Radix UI based)
- **Routing:** React Router DOM v7
- **Form Handling:** React Hook Form + Zod (Validation)
- **HTTP Client:** Axios (with JWT interceptors)
- **Notifications:** React Hot Toast / Sonner

### Target Architecture (Reference)
- **Backend:** Java Spring Boot (external)
- **Database:** PostgreSQL (external)
- **Authentication:** JWT-based
    - **Graduates:** UPSA email (`@upsa.edu.gh`) + verification link
    - **Employers:** Google OAuth (Gmail)
    - **Admin:** Platform credentials

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
npm install
```

### Running the Project
```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Project Structure

```
src/
├── api/             # Axios instance and API service modules
├── components/      # UI components
│   ├── admin/       # Admin-specific components
│   ├── common/      # Reusable generic components (Navbar, Button, etc.)
│   ├── employer/    # Employer-specific components
│   ├── graduate/    # Graduate-specific components
│   └── ui/          # Shadcn UI base components
├── context/         # React Context (AuthContext)
├── hooks/           # Custom React hooks (useAuth, useMobile, etc.)
├── lib/             # Utility functions (shadcn/utils)
├── pages/           # Page components organized by route/role
├── routes/          # AppRouter and Route Guards (Protected/Role routes)
├── styles/          # Global styles (Tailwind, CSS variables)
├── types/           # TypeScript interfaces and types
└── utils/           # Helper utilities
```

---

## Development Conventions

### 1. Coding Standards
- **Strict TypeScript:** No `any` types. All data structures must be typed in `src/types/`.
- **Surgical Edits:** When modifying components, maintain the existing Radix/Shadcn structure.
- **Form Validation:** Always use `zod` schemas for form validation.

### 2. Styling
- **Tailwind Only:** Avoid inline styles. Use Tailwind CSS classes.
- **Theming:** Follow the theme variables defined in `src/styles/globals.css`.
- **Consistency:** Use existing components from `src/components/ui/` for all UI elements.

### 3. API & Auth
- **Axios Interceptors:** All authenticated requests must use the `axiosInstance` to automatically attach the JWT from `localStorage`.
- **Route Protection:** Use `ProtectedRoute` for authentication and `RoleRoute` for role-based access control (GRADUATE, EMPLOYER, ADMIN).

### 4. Components & Pages
- **Lazy Loading:** Pages should be lazy-loaded in `AppRouter.tsx` using `React.lazy`.
- **Loading States:** Every API call or page transition must have a corresponding loading state/spinner.
- **Mobile First:** Ensure all layouts are responsive and work on mobile devices.

---

## Key Features to Maintain
- **LinkedIn PDF Parsing:** A critical onboarding path for graduates.
- **Skill-Based Matching:** Graduates are discovered primarily through their listed skills.
- **Course Suggestions:** Automated display of learning resources tagged to specific skills.
- **Role Separation:** Strict separation of dashboards and features between Graduates, Employers, and Admins.

---

## Reference Documentation
- `SKILLBRIDGE_FULL_DOCS.md`: Detailed project scope, user stories, and entity definitions.
- `frontend-prompt.md`: Comprehensive frontend engineering requirements and UI specifications.
