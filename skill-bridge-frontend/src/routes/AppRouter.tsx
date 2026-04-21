import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, RoleRoute } from './RouteGuards';
import UserLayout from '../components/common/UserLayout';

// Lazy load pages for better performance
const LandingPage = React.lazy(() => import('../pages/public/LandingPage'));
const GraduateListPage = React.lazy(() => import('../pages/public/GraduateListPage'));
const GraduateProfilePage = React.lazy(() => import('../pages/public/GraduateProfilePage'));
const JobListPage = React.lazy(() => import('../pages/public/JobListPage'));

const GraduateRegisterPage = React.lazy(() => import('../pages/auth/GraduateRegisterPage'));
const LoginPage = React.lazy(() => import('../pages/auth/LoginPage'));
const VerifyEmailPage = React.lazy(() => import('../pages/auth/VerifyEmailPage'));
const EmployerLoginPage = React.lazy(() => import('../pages/auth/EmployerLoginPage'));
const OAuth2CallbackPage = React.lazy(() => import('../pages/auth/OAuth2CallbackPage'));

const OnboardingMethodPage = React.lazy(() => import('../pages/onboarding/OnboardingMethodPage'));
const LinkedInUploadPage = React.lazy(() => import('../pages/onboarding/LinkedInUploadPage'));
const ManualFillPage = React.lazy(() => import('../pages/onboarding/ManualFillPage'));

const GraduateDashboardPage = React.lazy(() => import('../pages/graduate/GraduateDashboardPage'));
const EmployerDashboardPage = React.lazy(() => import('../pages/employer/EmployerDashboardPage'));
const PostJobPage = React.lazy(() => import('../pages/employer/PostJobPage'));
const AdminDashboardPage = React.lazy(() => import('../pages/admin/AdminDashboardPage'));
const AdminGraduatesPage = React.lazy(() => import('../pages/admin/AdminGraduatesPage'));
const AdminJobsPage = React.lazy(() => import('../pages/admin/AdminJobsPage'));
const AdminCoursesPage = React.lazy(() => import('../pages/admin/AdminCoursesPage'));
const GraduateCoursesPage = React.lazy(() => import('../pages/graduate/GraduateCoursesPage'));
const GraduateReviewPage = React.lazy(() => import('../pages/public/GraduateReviewPage'));
const GraduateEditProfilePage = React.lazy(() => import('../pages/graduate/GraduateEditProfilePage'));

export const AppRouter = () => {
  return (
    <React.Suspense fallback={<div className="flex h-screen items-center justify-center font-sans">Loading...</div>}>
      <Routes>
        {/* Public Routes with Conditional Layout */}
        <Route path="/" element={<UserLayout><LandingPage /></UserLayout>} />
        <Route path="/graduates" element={<UserLayout><GraduateListPage /></UserLayout>} />
        <Route path="/graduates/:id" element={<UserLayout><GraduateProfilePage /></UserLayout>} />
        <Route path="/jobs" element={<UserLayout><JobListPage /></UserLayout>} />
        <Route path="/review/graduate/:id" element={<GraduateReviewPage />} />

        <Route path="/auth/graduate/register" element={<GraduateRegisterPage />} />
        <Route path="/auth/graduate/login" element={<LoginPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/graduate/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/employer/login" element={<EmployerLoginPage />} />
        <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />
        
        {/* Protected Graduate Onboarding */}
        <Route
          path="/onboarding/method"
          element={
            <ProtectedRoute>
              <RoleRoute role="GRADUATE">
                <UserLayout><OnboardingMethodPage /></UserLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/linkedin"
          element={
            <ProtectedRoute>
              <RoleRoute role="GRADUATE">
                <UserLayout><LinkedInUploadPage /></UserLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/manual"
          element={
            <ProtectedRoute>
              <RoleRoute role="GRADUATE">
                <UserLayout><ManualFillPage /></UserLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        
        {/* Protected Dashboards */}
        <Route
          path="/graduate/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="GRADUATE">
                <UserLayout><GraduateDashboardPage /></UserLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/graduate/profile/:id"
          element={
            <ProtectedRoute>
              <RoleRoute role="GRADUATE">
                <UserLayout><GraduateEditProfilePage /></UserLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/graduate/courses"
          element={
            <ProtectedRoute>
              <RoleRoute role="GRADUATE">
                <UserLayout><GraduateCoursesPage /></UserLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/employer"
          element={
            <ProtectedRoute>
              <RoleRoute role="EMPLOYER">
                <UserLayout><EmployerDashboardPage /></UserLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/employer/post-job"
          element={
            <ProtectedRoute>
              <RoleRoute role="EMPLOYER">
                <UserLayout><PostJobPage /></UserLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="ADMIN">
                <UserLayout><AdminDashboardPage /></UserLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/graduates"
          element={
            <ProtectedRoute>
              <RoleRoute role="ADMIN">
                <UserLayout><AdminGraduatesPage /></UserLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute>
              <RoleRoute role="ADMIN">
                <UserLayout><AdminJobsPage /></UserLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute>
              <RoleRoute role="ADMIN">
                <UserLayout><AdminCoursesPage /></UserLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </React.Suspense>
  );
};
