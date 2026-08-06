import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Badge, Button, Surface } from "../ui";

function MobileNavDrawer({
  open,
  onClose,
  groups,
  currentSection,
  profileName,
  onSignOut
}) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="mobile-nav">
      <button
        type="button"
        className="mobile-nav__backdrop"
        onClick={onClose}
        aria-label="Close navigation"
      />

      <Surface
        as="aside"
        className="mobile-nav__panel"
        role="dialog"
        aria-modal="true"
        aria-label="StudyOS navigation"
      >
        <div className="mobile-nav__header">
          <div className="mobile-nav__identity">
            <Badge tone="accent">Menu</Badge>
            <div className="mobile-nav__identity-copy">
              <strong className="mobile-nav__title">StudyOS</strong>
              <span className="mobile-nav__subtitle">{currentSection.title}</span>
            </div>
          </div>

          <button
            type="button"
            className="mobile-nav__close"
            onClick={onClose}
            aria-label="Close navigation panel"
          >
            ×
          </button>
        </div>

        <p className="mobile-nav__description">{currentSection.description}</p>

        <nav className="mobile-nav__groups" aria-label="Mobile primary">
          {groups.map((group) => (
            <section key={group.label} className="mobile-nav__group">
              <h2 className="mobile-nav__group-title">{group.label}</h2>

              <div className="mobile-nav__items">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `mobile-nav__link ${isActive ? "is-active" : ""}`
                    }
                    end={item.to === "/"}
                    onClick={onClose}
                  >
                    <strong className="mobile-nav__link-label">{item.label}</strong>
                    <span className="mobile-nav__link-description">
                      {item.description}
                    </span>
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </nav>

        <div className="mobile-nav__footer">
          <Badge tone="neutral">Hi, {profileName}</Badge>
          <Button type="button" variant="primary" onClick={onSignOut}>
            Sign out
          </Button>
        </div>
      </Surface>
    </div>
  );
}

export default MobileNavDrawer;