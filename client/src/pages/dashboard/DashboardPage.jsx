import { useMemo } from "react";

import { useStudyData } from "../../hooks/useStudyData";

import {
  buildDashboardSnapshot
} from "../../domain/dashboard";

import DashboardHero from "./components/DashboardHero";
import DashboardOverview from "./components/DashboardOverview";
import DashboardCommandCenter from "./components/DashboardCommandCenter";
import DashboardSection from "./components/DashboardSection";
import DashboardSectionRail from "./components/DashboardSectionRail";
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
    <div className="dashboard-page-shell">
      <section
        className="page dashboard-page"
        aria-label="StudyOS workspace"
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

        <DashboardSectionRail />

        <div className="dashboard-deep-work">
          <DashboardSection
            id="dashboard-tasks"
            index="01"
            eyebrow="Work queue"
            title="Keep the important work moving."
            description="Capture, prioritize, and complete the tasks that shape your current semester."
          >
            <TaskManagerPanel />
          </DashboardSection>

          <DashboardSection
            id="dashboard-focus"
            index="02"
            eyebrow="Focus"
            title="Protect the time you need to do it."
            description="Turn scheduled study blocks into calm, deliberate sessions instead of another item on a list."
          >
            <StudyPlannerPanel />
          </DashboardSection>

          <DashboardSection
            id="dashboard-insights"
            index="03"
            eyebrow="Intelligence"
            title="Understand the week before it becomes heavy."
            description="See pressure, rhythm, deadlines, and subject load without translating a wall of charts yourself."
          >
            <InsightsPanel />
          </DashboardSection>

          <DashboardSection
            id="dashboard-plan"
            index="04"
            eyebrow="Plan"
            title="Shape what comes next."
            description="Turn the signals above into a realistic plan for the days ahead."
          >
            <DashboardPlan />
          </DashboardSection>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;