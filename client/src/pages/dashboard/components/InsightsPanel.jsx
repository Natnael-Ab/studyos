import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Badge,
  Button,
  Progress,
  Surface
} from "../../../components/ui";

import {
  buildInsightsSnapshot
} from "../../../domain/insights";

import {
  useStudyData
} from "../../../hooks/useStudyData";

function formatMinutes(
  value
) {
  const minutes =
    Math.max(
      0,
      Number(value) || 0
    );

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  const remainder =
    minutes % 60;

  if (remainder === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainder}m`;
}

function getBarHeight(
  value,
  max
) {
  if (!max || value <= 0) {
    return 5;
  }

  return Math.max(
    8,
    Math.round(
      (value / max) * 100
    )
  );
}

function InsightsPanel() {
  const {
    subjects,
    tasks,
    studySessions,
    exams
  } = useStudyData();

  const [
    currentTime,
    setCurrentTime
  ] = useState(
    () => Date.now()
  );

  useEffect(() => {
    const intervalId =
      window.setInterval(
        () => {
          setCurrentTime(
            Date.now()
          );
        },
        60_000
      );

    return () => {
      window.clearInterval(
        intervalId
      );
    };
  }, []);

  const snapshot =
    useMemo(
      () =>
        buildInsightsSnapshot(
          {
            subjects,
            tasks,
            studySessions,
            exams
          },
          new Date(
            currentTime
          )
        ),
      [
        subjects,
        tasks,
        studySessions,
        exams,
        currentTime
      ]
    );

  const maxDayLoad =
    Math.max(
      ...snapshot.weeklyWorkload.map(
        (day) =>
          day.totalMinutes
      ),
      1
    );

  return (
    <section
      className="insights-workspace"
      aria-labelledby="insights-title"
    >
      <div className="insights-workspace__header">
        <div>
          <span className="insights-workspace__eyebrow">
            Intelligence
          </span>

          <h2 id="insights-title">
            Understand the week before it becomes heavy.
          </h2>

          <p>
            StudyOS turns your tasks, planned sessions, and
            deadlines into useful signals instead of another
            dashboard full of numbers.
          </p>
        </div>

        <Badge
          tone={
            snapshot.riskSubject?.riskScore >=
            75
              ? "accent"
              : "neutral"
          }
        >
          {snapshot.workloadInsight.label}
        </Badge>
      </div>

      <div className="insights-signal-grid">
        <Surface className="insight-signal-card insight-signal-card--primary">
          <span>
            Workload
          </span>

          <strong>
            {formatMinutes(
              snapshot.workloadMinutes
            )}
          </strong>

          <p>
            Total visible effort across the next seven days.
          </p>

          <div className="insight-signal-card__footer">
            <span>
              {formatMinutes(
                snapshot.plannedMinutes
              )}
              {" "}
              planned focus
            </span>

            <span>
              {snapshot.taskMetrics.openTasks}
              {" "}
              open tasks
            </span>
          </div>
        </Surface>

        <Surface className="insight-signal-card">
          <span>
            Completion
          </span>

          <strong>
            {snapshot.completionMomentum}%
          </strong>

          <Progress
            value={
              snapshot.completionMomentum
            }
            label="Tasks completed"
          />

          <p>
            {snapshot.taskMetrics.completedTasks}
            {" "}
            of
            {" "}
            {snapshot.taskMetrics.totalTasks}
            {" "}
            tasks are complete.
          </p>
        </Surface>

        <Surface className="insight-signal-card">
          <span>
            Study rhythm
          </span>

          <strong>
            {snapshot.studyConsistency}%
          </strong>

          <Progress
            value={
              snapshot.studyConsistency
            }
            label="Session consistency"
          />

          <p>
            {snapshot.sessionMetrics.plannedSessions}
            {" "}
            planned sessions with
            {" "}
            {snapshot.sessionMetrics.completedSessions}
            {" "}
            completed.
          </p>
        </Surface>

        <Surface className="insight-signal-card">
          <span>
            Deadline pressure
          </span>

          <strong>
            {snapshot.taskMetrics.overdueTasks}
          </strong>

          <p>
            overdue task
            {snapshot.taskMetrics.overdueTasks ===
            1
              ? ""
              : "s"}
            {" "}
            and
            {" "}
            {snapshot.taskMetrics.dueSoonTasks}
            {" "}
            due soon.
          </p>

          <div className="insight-signal-card__footer">
            <span>
              {snapshot.nextExam
                ? `${snapshot.nextExam.readiness}% exam readiness`
                : "No upcoming exam"}
            </span>
          </div>
        </Surface>
      </div>

      <div className="insights-main-grid">
        <Surface className="insight-panel">
          <div className="insight-panel__header">
            <div>
              <span>
                Weekly load
              </span>

              <h3>
                Where the pressure lands.
              </h3>

              <p>
                Task effort and planned focus are combined so
                crowded days become visible before they become
                problems.
              </p>
            </div>

            {snapshot.weeklyPeak ? (
              <Badge tone="accent">
                Peak:
                {" "}
                {snapshot.weeklyPeak.dayLabel}
              </Badge>
            ) : null}
          </div>

          <div
            className="weekly-load"
            aria-label="Seven day workload"
          >
            {snapshot.weeklyWorkload.map(
              (day) => (
                <div
                  key={`${day.dayLabel}-${day.dateLabel}`}
                  className={`weekly-load__day ${
                    day.isToday
                      ? "is-today"
                      : ""
                  }`}
                >
                  <span className="weekly-load__day-label">
                    {day.dayLabel}
                  </span>

                  <div
                    className="weekly-load__bar-track"
                    aria-hidden="true"
                  >
                    <span
                      className="weekly-load__bar"
                      style={{
                        height: `${getBarHeight(
                          day.totalMinutes,
                          maxDayLoad
                        )}%`
                      }}
                    />
                  </div>

                  <strong>
                    {day.totalMinutes}
                    <small>
                      min
                    </small>
                  </strong>

                  <span className="weekly-load__day-meta">
                    {day.taskCount}
                    {" "}
                    task
                    {day.taskCount ===
                    1
                      ? ""
                      : "s"}
                  </span>
                </div>
              )
            )}
          </div>
        </Surface>

        <Surface className="insight-panel">
          <div className="insight-panel__header">
            <div>
              <span>
                Recommendation
              </span>

              <h3>
                The system sees this first.
              </h3>

              <p>
                Recommendations are derived from the current
                workload rather than arbitrary scores.
              </p>
            </div>
          </div>

          <article className="insight-recommendation">
            <div className="insight-recommendation__badge">
              <Badge
                tone={
                  snapshot.workloadInsight.tone
                }
              >
                {snapshot.workloadInsight.label}
              </Badge>
            </div>

            <h3>
              {snapshot.workloadInsight.title}
            </h3>

            <p>
              {
                snapshot.workloadInsight
                  .description
              }
            </p>

            <div className="insight-recommendation__actions">
              <Button
                to="/planner"
                variant="primary"
                size="sm"
              >
                Open planner
              </Button>

              <Button
                to="/search"
                variant="ghost"
                size="sm"
              >
                Review context
              </Button>
            </div>
          </article>
        </Surface>
      </div>

      <div className="insights-bottom-grid">
        <Surface className="insight-panel">
          <div className="insight-panel__header">
            <div>
              <span>
                Subject pressure
              </span>

              <h3>
                Which subjects need attention?
              </h3>
            </div>
          </div>

          <div className="subject-pressure-list">
            {snapshot.workloadBySubject
              .slice(0, 5)
              .map(
                (subject) => (
                  <article
                    key={
                      subject.id
                    }
                    className="subject-pressure"
                  >
                    <div className="subject-pressure__main">
                      <div>
                        <strong>
                          {subject.name}
                        </strong>

                        <span>
                          {subject.code}
                        </span>
                      </div>

                      <Badge
                        tone={
                          subject.riskTone
                        }
                      >
                        {
                          subject.riskLabel
                        }
                      </Badge>
                    </div>

                    <div className="subject-pressure__bar">
                      <span
                        style={{
                          width: `${Math.max(
                            4,
                            Math.min(
                              100,
                              subject.riskScore
                            )
                          )}%`
                        }}
                      />
                    </div>

                    <div className="subject-pressure__meta">
                      <span>
                        {subject.openTasks}
                        {" "}
                        open
                      </span>

                      <span>
                        {subject.overdueTasks}
                        {" "}
                        overdue
                      </span>

                      <span>
                        {formatMinutes(
                          subject.totalMinutes
                        )}
                        {" "}
                        effort
                      </span>
                    </div>
                  </article>
                )
              )}
          </div>
        </Surface>

        <Surface className="insight-panel">
          <div className="insight-panel__header">
            <div>
              <span>
                Next decisions
              </span>

              <h3>
                What deserves attention now?
              </h3>
            </div>
          </div>

          <div className="insight-decision-list">
            {snapshot.recommendations
              .slice(0, 4)
              .map(
                (item) => (
                  <article
                    key={item.id}
                    className="insight-decision"
                  >
                    <div className="insight-decision__top">
                      <Badge
                        tone={
                          item.tone
                        }
                      >
                        {item.label}
                      </Badge>

                      <span>
                        {item.action}
                      </span>
                    </div>

                    <h4>
                      {item.title}
                    </h4>

                    <p>
                      {item.description}
                    </p>
                  </article>
                )
              )}
          </div>
        </Surface>
      </div>

      <div className="insight-context-strip">
        <Surface className="insight-context">
          <span>
            Next task
          </span>

          {snapshot.nextTask ? (
            <>
              <strong>
                {snapshot.nextTask.title}
              </strong>

              <small>
                {snapshot.nextTask.subjectName}
                {" · "}
                {snapshot.nextTask.dueLabel}
                {" · "}
                {snapshot.nextTask.effortMinutes}
                {" min"}
              </small>
            </>
          ) : (
            <p>
              No open task is waiting right now.
            </p>
          )}
        </Surface>

        <Surface className="insight-context">
          <span>
            Next session
          </span>

          {snapshot.nextSession ? (
            <>
              <strong>
                {snapshot.nextSession.title}
              </strong>

              <small>
                {snapshot.nextSession.subjectName}
                {" · "}
                {snapshot.nextSession.dueLabel}
                {" · "}
                {
                  snapshot.nextSession
                    .durationMinutes
                }
                {" min"}
              </small>
            </>
          ) : (
            <p>
              No study session is planned.
            </p>
          )}
        </Surface>

        <Surface className="insight-context">
          <span>
            Next exam
          </span>

          {snapshot.nextExam ? (
            <>
              <strong>
                {snapshot.nextExam.title}
              </strong>

              <small>
                {snapshot.nextExam.subjectName}
                {" · "}
                {snapshot.nextExam.dueLabel}
                {" · "}
                {
                  snapshot.nextExam
                    .readiness
                }
                %
                {" ready"}
              </small>
            </>
          ) : (
            <p>
              No upcoming exam is scheduled.
            </p>
          )}
        </Surface>
      </div>
    </section>
  );
}

export default InsightsPanel;