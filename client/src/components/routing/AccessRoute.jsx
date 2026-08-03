import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useWorkspaceAccess } from "../../hooks/useWorkspaceAccess";
import { resolveNextRoute } from "../../context/workspaceAccessStorage";

function AccessRoute({ scope }) {
  const location = useLocation();
  const access = useWorkspaceAccess();
  const pathname = location.pathname;

  if (scope === "guest") {
    if (access.isAuthenticated) {
      return <Navigate to={resolveNextRoute(access)} replace state={{ from: pathname }} />;
    }

    return <Outlet />;
  }

  if (scope === "flow") {
    if (!access.isAuthenticated) {
      return <Navigate to="/login" replace state={{ from: pathname }} />;
    }

    if (!access.emailVerified) {
      return pathname === "/verify-email" ? <Outlet /> : <Navigate to="/verify-email" replace />;
    }

    if (!access.onboardingComplete) {
      return pathname === "/onboarding" ? <Outlet /> : <Navigate to="/onboarding" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  if (scope === "protected") {
    if (!access.isAuthenticated) {
      return <Navigate to="/login" replace state={{ from: pathname }} />;
    }

    if (!access.emailVerified) {
      return <Navigate to="/verify-email" replace />;
    }

    if (!access.onboardingComplete) {
      return <Navigate to="/onboarding" replace />;
    }

    return <Outlet />;
  }

  return <Outlet />;
}

export default AccessRoute;