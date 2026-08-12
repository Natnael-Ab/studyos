import {
  Button,
  Surface
} from "../../../components/ui";

import { useWorkspaceAccess } from "../../../hooks/useWorkspaceAccess";

function DashboardHero({
  snapshot
}) {
  const {
    profile
  } = useWorkspaceAccess();

  const firstName =
    profile.fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)[0] ||
    "there";

  const subjectCount =
    Array.isArray(profile.subjects)
      ? profile.subjects.length
      : 0;

  return (
    <section
      className="dashboard-hero dashboard-hero--premium"
      aria-labelledby="dashboard-title"
    >
      <Surface className="dashboard-hero__surface">
        <div className="dashboard-hero__copy">
          <span className="dashboard-hero__eyebrow">
            {snapshot.greeting} · Your workspace
          </span>

          <h1
            id="dashboard-title"
            className="dashboard-hero__title"
          >
            {firstName},
            {" "}
            let’s make today clear.
          </h1>

          <p className="dashboard-hero__text">
            {subjectCount}
            {" "}
            configured subject
            {subjectCount === 1
              ? ""
              : "s"}.
            {" "}
            Your immediate work is prioritized below so
            you can start with less friction.
          </p>

          <div className="dashboard-hero__actions">
            <Button
              to="/planner"
              variant="primary"
            >
              Open planner
              <span aria-hidden="true">
                ↗
              </span>
            </Button>

            <Button
              to="/library"
              variant="ghost"
            >
              Open library
            </Button>
          </div>
        </div>

        <div className="dashboard-hero__status">
          <span className="dashboard-hero__status-label">
            Task completion
          </span>

          <strong>
            {snapshot.taskProgress}%
          </strong>

          <div
            className="dashboard-hero__status-ring"
            role="img"
            aria-label={`${snapshot.taskProgress}% of tasks are completed`}
          >
            <span
              style={{
                background: `conic-gradient(var(--accent) 0 ${snapshot.taskProgress}%, color-mix(in srgb, var(--text) 8%, transparent) ${snapshot.taskProgress}% 100%)`
              }}
            />
          </div>
        </div>
      </Surface>
    </section>
  );
}

export default DashboardHero;