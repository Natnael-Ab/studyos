import { Link, Outlet } from "react-router-dom";

function AuthShell() {
  return (
    <div className="auth-shell">
      <aside className="auth-shell__visual">
        <div className="auth-shell__brand-row">
          <Link to="/" className="auth-shell__brand">
            StudyOS
          </Link>
          <span className="auth-shell__brand-subtitle">
            Premium student operating system
          </span>
        </div>

        <div className="auth-shell__copy">
          <h1 className="auth-shell__title">
            Calm structure for serious academic work.
          </h1>
          <p className="auth-shell__text">
            Create your workspace, verify your access, and set up a focused study
            flow that feels premium on every device.
          </p>
        </div>

        <ul className="auth-shell__feature-list">
          <li className="auth-shell__feature-item">
            <strong className="auth-shell__feature-title">Protected access</strong>
            <p className="auth-shell__feature-text">Secure entry flow with route control.</p>
          </li>
          <li className="auth-shell__feature-item">
            <strong className="auth-shell__feature-title">Smart setup</strong>
            <p className="auth-shell__feature-text">Choose your goals, study hours, and subjects.</p>
          </li>
          <li className="auth-shell__feature-item">
            <strong className="auth-shell__feature-title">Workspace ready</strong>
            <p className="auth-shell__feature-text">Move from setup straight into the dashboard.</p>
          </li>
        </ul>
      </aside>

      <main className="auth-shell__main">
        <div className="auth-shell__frame">
          <div className="auth-shell__mobile-brand">
            <Link to="/" className="auth-shell__brand">
              StudyOS
            </Link>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AuthShell;