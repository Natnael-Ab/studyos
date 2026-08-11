import { useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate
} from "react-router-dom";
import { Button } from "../ui";
import { useWorkspaceAccess } from "../../hooks/useWorkspaceAccess";
import AccountMenu from "./AccountMenu";
import MobileNavDrawer from "./MobileNavDrawer";
import NavigationIcon from "./NavigationIcon";
import {
  getNavigationGroups,
  getNavigationLinks,
  getShellRouteMeta
} from "./shellNavigation";

function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isAuthenticated,
    profile,
    signOut
  } = useWorkspaceAccess();

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const accountButtonRef = useRef(null);
  const menuButtonRef = useRef(null);

  const navigationGroups = useMemo(
    () => getNavigationGroups(isAuthenticated),
    [isAuthenticated]
  );

  const navigationLinks = useMemo(
    () => getNavigationLinks(isAuthenticated),
    [isAuthenticated]
  );

  const currentSection = useMemo(
    () =>
      getShellRouteMeta(
        location.pathname,
        isAuthenticated
      ),
    [isAuthenticated, location.pathname]
  );

  const firstName =
    profile.fullName
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)[0] || "Student";

  const initial = firstName
    .charAt(0)
    .toUpperCase();

  useEffect(() => {
    function handleShortcut(event) {
      if (!isAuthenticated) {
        return;
      }

      if (!(event.metaKey || event.ctrlKey)) {
        return;
      }

      if (event.key.toLowerCase() !== "k") {
        return;
      }

      const target = event.target;

      const isTypingField =
        target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          target.tagName
        );

      if (isTypingField) {
        return;
      }

      event.preventDefault();
      navigate("/search");
    }

    window.addEventListener(
      "keydown",
      handleShortcut
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleShortcut
      );
    };
  }, [isAuthenticated, navigate]);

  function handleAccountToggle() {
    setMenuOpen(false);
    setAccountOpen((current) => !current);
  }

  function handleAccountClose() {
    setAccountOpen(false);
  }

  function handleOpenMenu() {
    setAccountOpen(false);
    setMenuOpen(true);
  }

  function handleCloseMenu() {
    setMenuOpen(false);

    window.requestAnimationFrame(() => {
      menuButtonRef.current?.focus();
    });
  }

  function handleSignOut() {
    setAccountOpen(false);
    setMenuOpen(false);
    navigate(signOut());
  }

  const brandRoute = isAuthenticated
    ? "/dashboard"
    : "/";

  return (
    <header className="topbar">
      <div className="topbar__brand-column">
        <Link
          to={brandRoute}
          className="topbar__brand"
          aria-label={
            isAuthenticated
              ? "Open StudyOS Workspace"
              : "Open StudyOS Home"
          }
        >
          <span
            className="topbar__brand-mark"
            aria-hidden="true"
          />

          <span>StudyOS</span>
        </Link>

        {isAuthenticated ? (
          <span className="topbar__section-label">
            {currentSection.title}
          </span>
        ) : null}
      </div>

      {isAuthenticated ? (
        <nav
          className="topbar__nav"
          aria-label="Primary navigation"
        >
          {navigationLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `topbar__link ${
                  isActive ? "is-active" : ""
                }`
              }
            >
              <NavigationIcon
                name={link.icon}
                size={15}
              />

              <span>{link.label}</span>

              {link.to === "/search" ? (
                <kbd
                  className="topbar__search-shortcut"
                  aria-label="Keyboard shortcut Control or Command K"
                >
                  <span className="topbar__shortcut-command">
                    ⌘
                  </span>
                  K
                </kbd>
              ) : null}
            </NavLink>
          ))}
        </nav>
      ) : null}

      <div className="topbar__actions">
        {isAuthenticated ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="topbar__mobile-search"
              onClick={() => navigate("/search")}
              aria-label="Open Search"
            >
              <NavigationIcon
                name="search"
                size={17}
              />
            </Button>

            <button
              ref={accountButtonRef}
              type="button"
              className={`account-trigger ${
                accountOpen
                  ? "is-open"
                  : ""
              }`}
              onClick={handleAccountToggle}
              aria-expanded={accountOpen}
              aria-haspopup="menu"
              aria-label={`Open account menu for ${firstName}`}
            >
              <span
                className="account-trigger__avatar"
                aria-hidden="true"
              >
                {initial}
              </span>

              <span className="account-trigger__name">
                {firstName}
              </span>

              <span
                className="account-trigger__chevron"
                aria-hidden="true"
              >
                <NavigationIcon
                  name="arrow"
                  size={12}
                />
              </span>
            </button>

            <Button
              ref={menuButtonRef}
              type="button"
              variant="ghost"
              size="sm"
              className="topbar__menu-button"
              onClick={handleOpenMenu}
              aria-expanded={menuOpen}
              aria-controls="studyos-mobile-navigation"
              aria-label="Open navigation"
            >
              <NavigationIcon
                name="menu"
                size={18}
              />
            </Button>

            <AccountMenu
              open={accountOpen}
              onClose={handleAccountClose}
              profile={profile}
              onSignOut={handleSignOut}
              anchorRef={accountButtonRef}
            />
          </>
        ) : (
          <>
            <Button
              to="/login"
              variant="ghost"
              size="sm"
            >
              Sign in
            </Button>

            <Button
              to="/signup"
              variant="primary"
              size="sm"
            >
              Get started
              <NavigationIcon
                name="arrow"
                size={15}
              />
            </Button>
          </>
        )}
      </div>

      {isAuthenticated ? (
        <MobileNavDrawer
          id="studyos-mobile-navigation"
          open={menuOpen}
          onClose={handleCloseMenu}
          groups={navigationGroups}
          currentSection={currentSection}
          profileName={firstName}
          profile={profile}
          onSignOut={handleSignOut}
        />
      ) : null}
    </header>
  );
}

export default TopBar;