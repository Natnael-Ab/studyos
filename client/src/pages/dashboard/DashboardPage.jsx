import { useMemo } from "react";
import { useStudyData } from "../../hooks/useStudyData";
import {
  buildDashboardSnapshot
} from "../../domain/dashboard";

import DashboardHero from "./components/DashboardHero";
import DashboardOverview from "./components/DashboardOverview";
import DashboardCommandCenter from "./components/DashboardCommandCenter";
import DashboardPlan from "./components/DashboardPlan";
import InsightsPanel from "./components/InsightsPanel";
import StudyPlannerPanel from "./components/StudyPlannerPanel";
import TaskManagerPanel from "./components/TaskManagerPanel";

function DashboardPage() {
  const {
    subjects,
    tasks,
    studySessions,
    exams
  } = useStudyData();

  const snapshot = useMemo(
    () =>
      buildDashboardSnapshot({
        subjects,
        tasks,
        studySessions,
        exams
      }),
    [
      subjects,
      tasks,
      studySessions,
      exams
    ]
  );

  return (
    <section
      className="page dashboard-page dashboard-page--premium"
    >
      <DashboardHero
        snapshot={snapshot}
      />

      <DashboardOverview
        snapshot={snapshot}
      />

      <DashboardCommandCenter
        snapshot={snapshot}
      />

      <section
        className="dashboard-detail-section"
        aria-labelledby="dashboard-detail-title"
      >
        <div className="dashboard-detail-section__heading">
          <div>
            <span className="dashboard-detail-section__eyebrow">
              Deep work
            </span>

            <h2 id="dashboard-detail-title">
              Go deeper only when you need to.
            </h2>
          </div>

          <p>
            Your immediate work stays above. The full planning,
            task, insight, and study tools remain available below
            when you want to manage the system in detail.
          </p>
        </div>

        <div className="dashboard-stack">
          <TaskManagerPanel />
          <StudyPlannerPanel />
          <InsightsPanel />
          <DashboardPlan />
        </div>
      </section>
    </section>
  );
}

export default DashboardPage;