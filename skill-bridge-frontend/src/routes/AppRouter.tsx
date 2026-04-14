import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, RoleRoute } from './RouteGuards';

// Lazy load pages for better performance
const LandingPage = React.lazy(() => import('../pages/public/LandingPage'));
const GraduateListPage = React.lazy(() => import('../pages/public/GraduateListPage'));
const GraduateProfilePage = React.lazy(() => import('../pages/public/GraduateProfilePage'));
const JobListPage = React.lazy(() => import('../pages/public/JobListPage'));

const GraduateRegisterPage = React.lazy(() => import('../pages/auth/GraduateRegisterPage'));
const GraduateLoginPage = React.lazy(() => import('../pages/auth/GraduateLoginPage'));
const VerifyEmailPage = React.lazy(() => import('../pages/auth/VerifyEmailPage'));
const EmployerLoginPage = React.lazy(() => import('../pages/auth/EmployerLoginPage'));

const OnboardingMethodPage = React.lazy(() => import('../pages/onboarding/OnboardingMethodPage'));
const LinkedInUploadPage = React.lazy(() => import('../pages/onboarding/LinkedInUploadPage'));
const ManualFillPage = React.lazy(() => import('../pages/onboarding/ManualFillPage'));

const GraduateDashboardPage = React.lazy(() => import('../pages/graduate/GraduateDashboardPage'));
const EmployerDashboardPage = React.lazy(() => import('../pages/employer/EmployerDashboardPage'));
const PostJobPage = React.lazy(() => import('../pages/employer/PostJobPage'));
const AdminDashboardPage = React.lazy(() => import('../pages/admin/AdminDashboardPage'));

export const AppRouter = () => {
  return (
    <React.Suspense fallback={<div className="flex h-screen items-center justify-center font-sans">Loading...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/graduates" element={<GraduateListPage />} />
        <Route path="/graduates/:id" element={<GraduateProfilePage />} />
        <Route path="/jobs" element={<JobListPage />} />

        <Route path="/auth/graduate/register" element={<GraduateRegisterPage />} />
        <Route path="/auth/graduate/login" element={<GraduateLoginPage />} />
        <Route path="/auth/graduate/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/employer/login" element={<EmployerLoginPage />} />
        
        {/* Protected Graduate Onboarding */}
        <Route
          path="/onboarding/method"
          element={
            <ProtectedRoute>
              <RoleRoute role="GRADUATE">
                <OnboardingMethodPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/linkedin"
          element={
            <ProtectedRoute>
              <RoleRoute role="GRADUATE">
                <LinkedInUploadPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding/manual"
          element={
            <ProtectedRoute>
              <RoleRoute role="GRADUATE">
                <ManualFillPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        
        {/* Protected Dashboards */}
        <Route
          path="/dashboard/graduate"
          element={
            <ProtectedRoute>
              <RoleRoute role="GRADUATE">
                <GraduateDashboardPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/employer"
          element={
            <ProtectedRoute>
              <RoleRoute role="EMPLOYER">
                <EmployerDashboardPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/employer/post-job"
          element={
            <ProtectedRoute>
              <RoleRoute role="EMPLOYER">
                <PostJobPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <RoleRoute role="ADMIN">
                <AdminDashboardPage />
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
