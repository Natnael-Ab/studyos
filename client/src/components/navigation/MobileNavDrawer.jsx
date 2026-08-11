import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { NavLink, Link } from "react-router-dom";
import { Button } from "../ui";
import NavigationIcon from "./NavigationIcon";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(", ");

function MobileNavDrawer({
  id,
  open,
  onClose,
  groups,
  currentSection,
  profileName,
  profile,
  onSignOut
}) {
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable =
        panelRef.current?.querySelectorAll(
          FOCUSABLE_SELECTOR
        );

      if (!focusable?.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last =
        focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow =
        previousOverflow;
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose, open]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  const initial =
    profileName.charAt(0).toUpperCase();

  const email =
    profile.email?.trim() ||
    "StudyOS account";

  const drawer = (
    <div className="mobile-nav">
      <button
        type="button"
        className="mobile-nav__backdrop"
        onClick={onClose}
        aria-label="Close navigation"
      />

      <aside
        id={id}
        ref={panelRef}
        className="mobile-nav__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-navigation-title"
      >
        <div className="mobile-nav__header">
          <div className="mobile-nav__identity">
            <span
              className="mobile-nav__brand-mark"
              aria-hidden="true"
            />

            <div className="mobile-nav__identity-copy">
              <strong
                id="mobile-navigation-title"
                className="mobile-nav__title"
              >
                StudyOS
              </strong>

              <span className="mobile-nav__subtitle">
                {currentSection.title}
              </span>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="mobile-nav__close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <NavigationIcon
              name="close"
              size={17}
            />
          </button>
        </div>

        <nav
          className="mobile-nav__groups"
          aria-label="Mobile primary navigation"
        >
          {groups.map((group) => (
            <section
              key={group.label}
              className="mobile-nav__group"
            >
              <h2 className="mobile-nav__group-title">
                {group.label}
              </h2>

              <div className="mobile-nav__items">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `mobile-nav__link ${
                        isActive
                          ? "is-active"
                          : ""
                      }`
                    }
                  >
                    <span className="mobile-nav__link-icon">
                      <NavigationIcon
                        name={item.icon}
                        size={17}
                      />
                    </span>

                    <span className="mobile-nav__link-copy">
                      <strong className="mobile-nav__link-label">
                        {item.label}
                      </strong>

                      <span className="mobile-nav__link-description">
                        {item.description}
                      </span>
                    </span>

                    <NavigationIcon
                      name="arrow"
                      size={14}
                    />
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </nav>

        <section
          className="mobile-nav__account"
          aria-labelledby="mobile-account-title"
        >
          <h2
            id="mobile-account-title"
            className="mobile-nav__group-title"
          >
            Account
          </h2>

          <Link
            to="/settings"
            className="mobile-nav__account-card"
            onClick={onClose}
          >
            <span
              className="mobile-nav__account-avatar"
              aria-hidden="true"
            >
              {initial}
            </span>

            <span className="mobile-nav__account-copy">
              <strong>{profileName}</strong>
              <span>{email}</span>
            </span>

            <NavigationIcon
              name="arrow"
              size={14}
            />
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mobile-nav__signout"
            onClick={onSignOut}
          >
            <NavigationIcon
              name="logout"
              size={15}
            />

            Sign out
          </Button>
        </section>
      </aside>
    </div>
  );

  return createPortal(
    drawer,
    document.body
  );
}

export default MobileNavDrawer;