import { createBrowserRouter, Navigate } from "react-router-dom"
import OnboardingPage from "./pages/OnboardingPage"
import DashboardPage from "./pages/DashboardPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/onboarding" replace />,
  },
  {
    path: "/onboarding",
    element: <OnboardingPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
])
