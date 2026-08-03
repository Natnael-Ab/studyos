import DashboardAgenda from "./components/DashboardAgenda";
import DashboardHero from "./components/DashboardHero";
import DashboardOverview from "./components/DashboardOverview";
import DashboardPlan from "./components/DashboardPlan";

function DashboardPage() {
  return (
    <section className="page dashboard-page">
      <DashboardHero />
      <DashboardOverview />

      <div className="dashboard-layout">
        <DashboardAgenda />
        <DashboardPlan />
      </div>
    </section>
  );
}

export default DashboardPage;