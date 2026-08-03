import { useMemo } from "react";
import { Badge, StatCard, Surface } from "../../components/ui";
import { PageTransition, Reveal } from "../../components/motion";
import { useStudyData } from "../../hooks/useStudyData";
import { useWorkspaceAccess } from "../../hooks/useWorkspaceAccess";
import { useWorkspaceSettings } from "../../hooks/useWorkspaceSettings";
import { buildPlannerSnapshot } from "../../domain/planner";
import PlannerHero from "./components/PlannerHero";
import TodayPanel from "./components/TodayPanel";
import WeeklyPlanner from "./components/WeeklyPlanner";
import CalendarPanel from "./components/CalendarPanel";

function PlannerPage() {
  const { tasks, studySessions, exams } = useStudyData();
  const { profile } = useWorkspaceAccess();
  const { settings } = useWorkspaceSettings();

  const snapshot = useMemo(
    () =>
      buildPlannerSnapshot({
        tasks,
        studySessions,
        exams,
        profile,
        settings
      }),
    [tasks, studySessions, exams, profile, settings]
  );

  const summaryCards = useMemo(
    () => [
      {
        label: "Today tasks",
        value: String(snapshot.todayTaskCount),
        detail: "Due and open"
      },
      {
        label: "Today sessions",
        value: String(snapshot.todaySessionCount),
        detail: "Planned blocks"
      },
      {
        label: "Week load",
        value: String(snapshot.weekTaskCount + snapshot.weekSessionCount),
        detail: "Total items this week"
      },
      {
        label: "Active days",
        value: String(snapshot.activeDays),
        detail: "Calendar days with items"
      }
    ],
    [
      snapshot.activeDays,
      snapshot.todaySessionCount,
      snapshot.todayTaskCount,
      snapshot.weekSessionCount,
      snapshot.weekTaskCount
    ]
  );

  return (
    <PageTransition>
      <section className="page planner-page">
        <Reveal>
          <PlannerHero snapshot={snapshot} />
        </Reveal>

        <div className="planner-summary-grid">
          {summaryCards.map((card) => (
            <Reveal key={card.label}>
              <StatCard label={card.label} value={card.value} detail={card.detail} />
            </Reveal>
          ))}
        </div>

        <div className="planner-layout">
          <div className="planner-main">
            <Reveal>
              <TodayPanel snapshot={snapshot} />
            </Reveal>

            <Reveal delay={0.04}>
              <WeeklyPlanner snapshot={snapshot} />
            </Reveal>
          </div>

          <div className="planner-side">
            <Reveal>
              <CalendarPanel snapshot={snapshot} />
            </Reveal>
          </div>
        </div>

        {snapshot.nextExam ? (
          <Reveal>
            <Surface className="planner-exam-card">
              <div className="planner-exam-card__header">
                <Badge tone="accent">Exam watch</Badge>
                <Badge tone="neutral">{snapshot.nextExam.readiness}% ready</Badge>
              </div>
              <h2 className="planner-exam-card__title">{snapshot.nextExam.title}</h2>
              <p className="planner-exam-card__text">
                {snapshot.nextExam.subjectName} · {snapshot.nextExam.dueLabel}
              </p>
            </Surface>
          </Reveal>
        ) : null}
      </section>
    </PageTransition>
  );
}

export default PlannerPage;