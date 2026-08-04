import { Link, NavLink, useNavigate } from "react-router-dom";
import { Badge, Button } from "../ui";
import { useWorkspaceAccess } from "../../hooks/useWorkspaceAccess";

function TopBar() {
  const navigate = useNavigate();
  const { isAuthenticated, profile, signOut } = useWorkspaceAccess();

  const firstName =
    profile.fullName.trim().split(/\s+/).filter(Boolean)[0] || "Guest";

  const links = isAuthenticated
    ? [
        { to: "/dashboard", label: "Workspace" },
        { to: "/planner", label: "Planner" },
        { to: "/search", label: "Search" },
        { to: "/settings", label: "Settings" }
      ]
    : [{ to: "/", label: "Home" }];

  function handleSignOut() {
    navigate(signOut());
  }

  return (
    <header className="topbar">
      <div className="topbar__brand-group">
        <Link to="/" className="topbar__brand">
          StudyOS
        </Link>
        <span className="topbar__subtitle">Premium student operating system</span>
      </div>

      <nav className="topbar__nav" aria-label="Primary">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `topbar__link ${isActive ? "is-active" : ""}`
            }
            end={link.to === "/"}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="topbar__actions">
        {isAuthenticated ? (
          <>
            <Badge tone="neutral">Hi, {firstName}</Badge>
            <Button type="button" variant="ghost" size="sm" onClick={handleSignOut}>
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button to="/login" variant="ghost" size="sm">
              Sign in
            </Button>
            <Button to="/signup" variant="primary" size="sm">
              Get started
            </Button>
          </>
        )}
      </div>
    </header>
  );
}

export default TopBar;