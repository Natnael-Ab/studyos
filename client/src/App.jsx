import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AccessRoute from "./components/routing/AccessRoute";
import AppShell from "./layouts/AppShell";
import AuthShell from "./layouts/AuthShell";
import DashboardPage from "./pages/dashboard/DashboardPage";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import SignupPage from "./pages/auth/SignupPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import OnboardingWizardPage from "./pages/onboarding/OnboardingWizardPage";
import SettingsPage from "./pages/settings/SettingsPage";
import PlannerPage from "./pages/planner/PlannerPage";
import SearchPage from "./pages/search/SearchPage";
import LibraryPage from "./pages/library/LibraryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />

          <Route element={<AccessRoute scope="protected" />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route element={<AuthShell />}>
          <Route element={<AccessRoute scope="guest" />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          <Route element={<AccessRoute scope="flow" />}>
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/onboarding" element={<OnboardingWizardPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;