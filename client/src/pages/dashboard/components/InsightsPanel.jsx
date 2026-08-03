import { useMemo } from "react";
import { Badge, Progress, SectionHeader, StatCard, Surface } from "../../../components/ui";
import { buildInsightsSnapshot } from "../../../domain/insights";
import { useStudyData } from "../../../hooks/useStudyData";

function InsightsPanel() {
  const { subjects, tasks, studySessions, exams } = useStudyData();

  const snapshot = useMemo(
    () =>
      buildInsightsSnapshot({
        subjects,
        tasks,
        studySessions,
        exams
      }),
    [subjects, tasks, studySessions, exams]
  );

  return (
    <Surface className="insights-panel">
      <SectionHeader
        eyebrow="Insights"
        title="Study performance insights"
        description="Understand workload, rhythm, and priority without switching screens."
        action={<Badge tone="accent">{snapshot.productivityScore}% health</Badge>}
      />

      <div className="insights-summary">
        <StatCard
          label="Productivity score"
          value={`${snapshot.productivityScore}%`}
          detail="Overall study balance"
        />
        <StatCard
          label="Completion rate"
          value={`${snapshot.taskMetrics.completionRate}%`}
          detail="Tasks closed so far"
        />
        <StatCard
          label="Focus minutes"
          value={String(snapshot.sessionMetrics.focusMinutes)}
          detail="Planned study time"
        />
        <StatCard
          label="Overdue tasks"
          value={String(snapshot.taskMetrics.overdueTasks)}
          detail="Needs attention now"
        />
      </div>

      <div className="insights-layout">
        <Surface className="insights-card">
          <SectionHeader
            eyebrow="Workload"
            title="Subject pressure map"
            description="See which subjects are carrying the most work right now."
          />

          <div className="workload-list">
            {snapshot.workloadBySubject.map((subject) => (
              <article key={subject.id} className="workload-item">
                <div className="workload-item__header">
                  <div>
                    <h3 className="workload-item__title">{subject.name}</h3>
                    <p className="workload-item__meta">
                      {subject.code} · {subject.openTasks} open · {subject.sessionCount} sessions
                    </p>
                  </div>
                  <Badge tone={subject.overdueTasks > 0 ? "accent" : "neutral"}>
                    {subject.loadLabel}
                  </Badge>
                </div>

                <Progress value={subject.completionRate} label="Completion" />

                <div className="workload-item__footer">
                  <span>{subject.completedTasks} completed</span>
                  <span>{subject.overdueTasks} overdue</span>
                </div>
              </article>
            ))}
          </div>
        </Surface>

        <Surface className="insights-card">
          <SectionHeader
            eyebrow="Recommendations"
            title="Smart next moves"
            description="The system highlights the next best actions for steady progress."
          />

          <div className="recommendation-list">
            {snapshot.recommendations.map((item) => (
              <article key={item.title} className="recommendation-item">
                <div className="recommendation-item__top">
                  <h3 className="recommendation-item__title">{item.title}</h3>
                  <Badge tone={item.tone}>{item.label}</Badge>
                </div>
                <p className="recommendation-item__text">{item.description}</p>
              </article>
            ))}
          </div>
        </Surface>
      </div>

      <div className="insight-snapshot-grid">
        <Surface className="insight-snapshot">
          <span className="insight-snapshot__label">Next task</span>
          {snapshot.nextTask ? (
            <>
              <h3 className="insight-snapshot__title">{snapshot.nextTask.title}</h3>
              <p className="insight-snapshot__text">
                {snapshot.nextTask.subjectName} · {snapshot.nextTask.dueLabel}
              </p>
            </>
          ) : (
            <p className="insight-empty">No open task is waiting right now.</p>
          )}
        </Surface>

        <Surface className="insight-snapshot">
          <span className="insight-snapshot__label">Next session</span>
          {snapshot.nextSession ? (
            <>
              <h3 className="insight-snapshot__title">{snapshot.nextSession.title}</h3>
              <p className="insight-snapshot__text">
                {snapshot.nextSession.subjectName} · {snapshot.nextSession.dueLabel}
              </p>
            </>
          ) : (
            <p className="insight-empty">No study session is planned yet.</p>
          )}
        </Surface>
      </div>
    </Surface>
  );
}

export default InsightsPanel;