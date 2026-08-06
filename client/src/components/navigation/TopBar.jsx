import { useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Badge, Button } from "../ui";
import { useWorkspaceAccess } from "../../hooks/useWorkspaceAccess";
import MobileNavDrawer from "./MobileNavDrawer";
import {
  getNavigationGroups,
  getNavigationLinks,
  getShellRouteMeta
} from "./shellNavigation";

function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, profile, signOut } = useWorkspaceAccess();
  const [menuOpenKey, setMenuOpenKey] = useState(null);

  const firstName =
    profile.fullName.trim().split(/\s+/).filter(Boolean)[0] || "Guest";

  const navigationGroups = useMemo(
    () => getNavigationGroups(isAuthenticated),
    [isAuthenticated]
  );

  const navigationLinks = useMemo(
    () => getNavigationLinks(isAuthenticated),
    [isAuthenticated]
  );

  const currentSection = useMemo(
    () => getShellRouteMeta(location.pathname, isAuthenticated),
    [isAuthenticated, location.pathname]
  );

  const isMenuOpen = menuOpenKey === location.key;

  function handleSignOut() {
    setMenuOpenKey(null);
    navigate(signOut());
  }

  function handleOpenMenu() {
    setMenuOpenKey(location.key);
  }

  function handleCloseMenu() {
    setMenuOpenKey(null);
  }

  return (
    <header className="topbar">
      <div className="topbar__brand-column">
        <div className="topbar__brand-group">
          <Link to="/" className="topbar__brand">
            StudyOS
          </Link>
          <span className="topbar__subtitle">Premium student operating system</span>
        </div>

        <div className="topbar__context" aria-live="polite">
          <span className="topbar__context-label">Current</span>
          <strong className="topbar__context-title">{currentSection.title}</strong>
          <span className="topbar__context-text">{currentSection.description}</span>
        </div>
      </div>

      <nav className="topbar__nav" aria-label="Primary">
        {navigationLinks.map((link) => (
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
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="topbar__menu-button"
              onClick={handleOpenMenu}
            >
              Menu
            </Button>

            <Badge tone="neutral" className="topbar__status">
              Hi, {firstName}
            </Badge>

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

      {isAuthenticated ? (
        <MobileNavDrawer
          open={isMenuOpen}
          onClose={handleCloseMenu}
          groups={navigationGroups}
          currentSection={currentSection}
          profileName={firstName}
          onSignOut={handleSignOut}
        />
      ) : null}
    </header>
  );
}

export default TopBar;