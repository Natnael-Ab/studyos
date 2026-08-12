import {
  Badge,
  Button,
  Surface
} from "../../../components/ui";

function DashboardCommandCenter({
  snapshot
}) {
  const {
    nextTask,
    nextSession,
    nextExam,
    todayTasks,
    overdueTasks
  } = snapshot;

  return (
    <section
      className="dashboard-command"
      aria-labelledby="dashboard-command-title"
    >
      <div className="dashboard-command__main">
        <div className="dashboard-command__heading">
          <div>
            <span className="dashboard-command__eyebrow">
              Your next best move
            </span>

            <h2 id="dashboard-command-title">
              Keep the next hour simple.
            </h2>

            <p>
              StudyOS has already brought the immediate workload
              forward. You can act without sorting through the
              entire workspace first.
            </p>
          </div>

          <div className="dashboard-command__signal">
            <span>Due today</span>

            <strong>
              {todayTasks.length}
            </strong>

            <small>
              active items
            </small>
          </div>
        </div>

        <div className="dashboard-command__primary-card">
          {nextTask ? (
            <>
              <div className="dashboard-command__primary-copy">
                <span className="dashboard-command__label">
                  Start here
                </span>

                <h3>
                  {nextTask.title}
                </h3>

                <p>
                  {nextTask.subjectName}
                  {" · "}
                  {nextTask.dueLabel}
                  {" · "}
                  {nextTask.effortMinutes}
                  {" min"}
                </p>
              </div>

              <div className="dashboard-command__primary-actions">
                <Button
                  to="/planner"
                  variant="primary"
                  size="sm"
                >
                  Plan this
                </Button>

                <Button
                  to="/search"
                  variant="ghost"
                  size="sm"
                >
                  View context
                </Button>
              </div>
            </>
          ) : (
            <div className="dashboard-command__empty">
              <span
                className="dashboard-command__empty-mark"
                aria-hidden="true"
              >
                ✓
              </span>

              <div>
                <h3>
                  Your immediate queue is clear.
                </h3>

                <p>
                  Add a task or plan a study session when
                  you are ready for the next block.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-command__side">
        <Surface className="dashboard-mini-card">
          <div className="dashboard-mini-card__header">
            <span>Next session</span>

            <Badge
              tone={
                nextSession
                  ? "accent"
                  : "neutral"
              }
            >
              {nextSession
                ? "Planned"
                : "Clear"}
            </Badge>
          </div>

          {nextSession ? (
            <>
              <strong>
                {nextSession.title}
              </strong>

              <p>
                {nextSession.subjectName}
              </p>

              <span>
                {nextSession.dateLabel}
                {" · "}
                {nextSession.durationMinutes}
                {" min"}
              </span>
            </>
          ) : (
            <p>
              No upcoming study session needs attention.
            </p>
          )}
        </Surface>

        <Surface className="dashboard-mini-card">
          <div className="dashboard-mini-card__header">
            <span>Upcoming exam</span>

            <Badge
              tone={
                nextExam
                  ? "accent"
                  : "neutral"
              }
            >
              {nextExam
                ? `${nextExam.readiness}% ready`
                : "Clear"}
            </Badge>
          </div>

          {nextExam ? (
            <>
              <strong>
                {nextExam.title}
              </strong>

              <p>
                {nextExam.subjectName}
              </p>

              <span>
                {nextExam.dueLabel}
              </span>
            </>
          ) : (
            <p>
              No upcoming exam needs attention yet.
            </p>
          )}
        </Surface>

        {overdueTasks.length > 0 ? (
          <Surface className="dashboard-mini-card dashboard-mini-card--alert">
            <div className="dashboard-mini-card__header">
              <span>Needs attention</span>

              <Badge tone="accent">
                {overdueTasks.length}
              </Badge>
            </div>

            <strong>
              Clear overdue work before adding more.
            </strong>

            <span>
              {overdueTasks[0].title}

              {overdueTasks.length > 1
                ? ` + ${
                    overdueTasks.length - 1
                  } more`
                : ""}
            </span>
          </Surface>
        ) : null}
      </div>
    </section>
  );
}

export default DashboardCommandCenter;