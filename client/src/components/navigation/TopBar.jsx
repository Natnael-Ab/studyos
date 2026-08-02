import { NavLink, Link } from "react-router-dom";
import Button from "../ui/Button";

const links = [
  { to: "/", label: "Home" },
  { to: "/login", label: "Login" },
  { to: "/dashboard", label: "Workspace" }
];

function TopBar() {
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
        <Button to="/dashboard" variant="primary" size="sm">
          Open workspace
        </Button>
      </div>
    </header>
  );
}

export default TopBar;