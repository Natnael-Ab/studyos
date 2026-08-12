import { Link, Outlet, useLocation } from "react-router-dom";

const pageMeta = {
  "/login": {
    eyebrow: "Welcome back",
    title: "Return to your rhythm."
  },
  "/signup": {
    eyebrow: "Create your workspace",
    title: "Make study feel simpler from day one."
  },
  "/reset-password": {
    eyebrow: "Account recovery",
    title: "Get back in without the friction."
  },
  "/verify-email": {
    eyebrow: "One final step",
    title: "Confirm your access and keep moving."
  },
  "/onboarding": {
    eyebrow: "Personalize your workspace",
    title: "Shape StudyOS around the way you study."
  }
};

const principles = [
  {
    number: "01",
    title: "Quiet by default",
    text: "Only the information you need is given visual weight."
  },
  {
    number: "02",
    title: "Designed for flow",
    text: "Every step moves naturally toward the next useful action."
  },
  {
    number: "03",
    title: "Ready to grow",
    text: "Your setup becomes the foundation for the full workspace."
  }
];

function AuthShell() {
  const location = useLocation();

  const meta =
    pageMeta[location.pathname] ??
    pageMeta["/login"];

  return (
    <div className="auth-shell">
      <aside className="auth-shell__visual">
        <div className="auth-shell__brand-row">
          <Link
            to="/"
            className="auth-shell__brand"
          >
            StudyOS
          </Link>

          <span className="auth-shell__brand-subtitle">
            Academic workspace
          </span>
        </div>

        <div className="auth-shell__copy">
          <span className="auth-shell__eyebrow">
            {meta.eyebrow}
          </span>

          <h1 className="auth-shell__title">
            {meta.title}
          </h1>

          <p className="auth-shell__text">
            StudyOS brings planning, focus, research, and
            your study rhythm into one calm workspace
            designed for serious work.
          </p>
        </div>

        <div className="auth-shell__visual-footer">
          <div className="auth-shell__principles">
            {principles.map((principle) => (
              <article
                key={principle.number}
                className="auth-shell__principle"
              >
                <span className="auth-shell__principle-index">
                  {principle.number}
                </span>

                <div>
                  <strong className="auth-shell__principle-title">
                    {principle.title}
                  </strong>

                  <p className="auth-shell__principle-text">
                    {principle.text}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="auth-shell__visual-note">
            <span>
              StudyOS workspace systems
            </span>

            <span>
              Built for focused academic work
            </span>
          </div>
        </div>

        <div
          className="auth-visual-card"
          aria-hidden="true"
        >
          <div className="auth-visual-card__header">
            <span className="auth-visual-card__brand">
              <span />
              StudyOS
            </span>

            <span>Today</span>
          </div>

          <div className="auth-visual-card__body">
            <span className="auth-visual-card__label">
              Current focus
            </span>

            <strong className="auth-visual-card__title">
              Research methods
            </strong>

            <div className="auth-visual-card__progress">
              <span />
            </div>

            <div className="auth-visual-card__row">
              <span className="auth-visual-card__meta">
                Weekly rhythm
              </span>

              <strong>73%</strong>
            </div>
          </div>
        </div>
      </aside>

      <main className="auth-shell__main">
        <div className="auth-shell__frame">
          <div className="auth-shell__mobile-brand">
            <Link
              to="/"
              className="auth-shell__brand"
            >
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