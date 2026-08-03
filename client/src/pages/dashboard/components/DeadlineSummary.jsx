import { Progress, StatCard } from "../../../components/ui";
import { buildTaskMetrics } from "../../../domain/taskManager";
import { useStudyData } from "../../../hooks/useStudyData";

function DeadlineSummary() {
  const { tasks } = useStudyData();
  const metrics = buildTaskMetrics(tasks);

  return (
    <div className="deadline-summary">
      <div className="task-manager__summary">
        <StatCard
          label="Open tasks"
          value={String(metrics.openTasks)}
          detail="Current workload"
        />
        <StatCard
          label="Due soon"
          value={String(metrics.dueSoonTasks)}
          detail="Next 3 days"
        />
        <StatCard
          label="Overdue"
          value={String(metrics.overdueTasks)}
          detail="Needs attention"
        />
        <StatCard
          label="Completed"
          value={String(metrics.completedTasks)}
          detail="Finished tasks"
        />
      </div>

      <div className="deadline-summary__bar">
        <Progress value={metrics.completionRate} label="Completion rate" />
      </div>
    </div>
  );
}

export default DeadlineSummary;