import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import NavigationIcon from "./NavigationIcon";

function AccountMenu({
  open,
  onClose,
  profile,
  onSignOut,
  anchorRef
}) {
  const menuRef = useRef(null);

  const fullName =
    profile.fullName?.trim() || "Student";

  const email =
    profile.email?.trim() || "Your StudyOS account";

  const initial = fullName
    .charAt(0)
    .toUpperCase();

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handlePointerDown(event) {
      const clickedInsideMenu =
        menuRef.current?.contains(event.target);

      const clickedAnchor =
        anchorRef.current?.contains(event.target);

      if (clickedInsideMenu || clickedAnchor) {
        return;
      }

      onClose();
    }

    function handleKeyDown(event) {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      onClose();
      anchorRef.current?.focus();
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [anchorRef, onClose, open]);

  if (
    !open ||
    typeof document === "undefined"
  ) {
    return null;
  }

  function handleSignOut() {
    onClose();
    onSignOut();
  }

  const menu = (
    <div
      ref={menuRef}
      className="account-menu"
      role="menu"
      aria-label="Account menu"
    >
      <div className="account-menu__identity">
        <span
          className="account-menu__avatar"
          aria-hidden="true"
        >
          {initial}
        </span>

        <div className="account-menu__identity-copy">
          <strong>{fullName}</strong>
          <span>{email}</span>
        </div>
      </div>

      <div
        className="account-menu__divider"
        aria-hidden="true"
      />

      <div className="account-menu__items">
        <Link
          to="/settings"
          className="account-menu__item"
          role="menuitem"
          onClick={onClose}
        >
          <span className="account-menu__item-icon">
            <NavigationIcon
              name="settings"
              size={16}
            />
          </span>

          <span className="account-menu__item-copy">
            <strong>Settings</strong>
            <span>
              Appearance and workspace preferences
            </span>
          </span>

          <NavigationIcon
            name="arrow"
            size={13}
          />
        </Link>

        <button
          type="button"
          className="account-menu__item account-menu__item--danger"
          role="menuitem"
          onClick={handleSignOut}
        >
          <span className="account-menu__item-icon">
            <NavigationIcon
              name="logout"
              size={16}
            />
          </span>

          <span className="account-menu__item-copy">
            <strong>Sign out</strong>
            <span>
              End this StudyOS session
            </span>
          </span>
        </button>
      </div>
    </div>
  );

  return createPortal(
    menu,
    document.body
  );
}

export default AccountMenu;