import DashboardHero from "./components/DashboardHero";
import DashboardOverview from "./components/DashboardOverview";
import DashboardPlan from "./components/DashboardPlan";
import InsightsPanel from "./components/InsightsPanel";
import StudyPlannerPanel from "./components/StudyPlannerPanel";
import TaskManagerPanel from "./components/TaskManagerPanel";

function DashboardPage() {
  return (
    <section className="page dashboard-page">
      <DashboardHero />
      <DashboardOverview />

      <div className="dashboard-stack">
        <TaskManagerPanel />
        <StudyPlannerPanel />
        <InsightsPanel />
        <DashboardPlan />
      </div>
    </section>
  );
}

export default DashboardPage;