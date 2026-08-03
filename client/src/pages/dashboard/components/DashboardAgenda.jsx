import { Badge, Progress, SectionHeader, Surface } from "../../../components/ui";
import { buildStudySnapshot } from "../../../domain/studyPlanner";
import { studySeed } from "../../../data/studySeed";

const snapshot = buildStudySnapshot(studySeed);

function DashboardAgenda() {
  return (
    <Surface className="dashboard-panel">
      <SectionHeader
        eyebrow="Today"
        title="Today’s priorities"
        description="Keep the most important work visible and easy to act on."
      />

      <ul className="agenda-list">
        {snapshot.focusTasks.map((task) => (
          <li key={task.id} className="agenda-item">
            <div className="agenda-item__top">
              <div>
                <h3 className="agenda-item__title">{task.title}</h3>
                <p className="agenda-item__meta">
                  {task.subjectName} · {task.dueLabel}
                </p>
              </div>
              <Badge tone={task.priorityTone}>{task.priorityLabel}</Badge>
            </div>
          </li>
        ))}
      </ul>

      <Progress value={snapshot.momentum} label="Study momentum" />
    </Surface>
  );
}

export default DashboardAgenda;