import { Badge, Progress, SectionHeader, Surface } from "../../../components/ui";
import { buildStudySnapshot } from "../../../domain/studyPlanner";
import { studySeed } from "../../../data/studySeed";

const snapshot = buildStudySnapshot(studySeed);

function DashboardPlan() {
  return (
    <Surface className="dashboard-panel">
      <SectionHeader
        eyebrow="Subjects"
        title="Subject progress"
        description="See where the workload is moving without leaving the dashboard."
      />

      <div className="plan-list">
        {snapshot.subjectProgress.map((subject) => (
          <article key={subject.id} className="plan-card">
            <div className="plan-card__header">
              <h3 className="plan-card__title">{subject.name}</h3>
              <Badge tone="neutral">{subject.code}</Badge>
            </div>

            <p className="plan-card__text">
              {subject.completed} completed · {subject.remaining} remaining
            </p>

            <Progress value={subject.progress} />
          </article>
        ))}
      </div>

      <article className="plan-card">
        <div className="plan-card__header">
          <h3 className="plan-card__title">Next exam</h3>
          <Badge tone={snapshot.nextExam ? "accent" : "neutral"}>
            {snapshot.nextExam ? "Upcoming" : "Clear"}
          </Badge>
        </div>

        {snapshot.nextExam ? (
          <>
            <p className="plan-card__text">
              {snapshot.nextExam.subjectName} · {snapshot.nextExam.title}
            </p>
            <p className="plan-card__meta">
              {snapshot.nextExam.dueLabel} · readiness {snapshot.nextExam.readiness}%
            </p>
          </>
        ) : (
          <p className="plan-card__text">No exams are scheduled right now.</p>
        )}
      </article>
    </Surface>
  );
}

export default DashboardPlan;