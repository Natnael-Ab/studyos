import { StatCard } from "../../../components/ui";

function formatMinutes(value) {
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

function DashboardOverview({
  snapshot
}) {
  const metrics = [
    {
      label: "Open tasks",
      value: String(
        snapshot.taskMetrics.openTasks
      ),
      detail: `${snapshot.taskMetrics.dueSoonTasks} due soon`
    },
    {
      label: "Focus planned",
      value: formatMinutes(
        snapshot.sessionMetrics
          .focusMinutes
      ),
      detail: `${snapshot.sessionMetrics.totalSessions} sessions`
    },
    {
      label: "Today",
      value: formatMinutes(
        snapshot.todayStudyMinutes
      ),
      detail: "Planned study time"
    },
    {
      label: "Next exam",
      value: snapshot.nextExam
        ? `${snapshot.nextExam.readiness}%`
        : "—",
      detail: snapshot.nextExam
        ? snapshot.nextExam.dueLabel
        : "No exam scheduled"
    }
  ];

  return (
    <div
      className="dashboard-overview"
      aria-label="Workspace summary"
    >
      {metrics.map(
        (metric) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
          />
        )
      )}
    </div>
  );
}

export default DashboardOverview;