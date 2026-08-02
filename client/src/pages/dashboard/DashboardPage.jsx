import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Surface from "../../components/ui/Surface";

const stats = [
  { label: "Study streak", value: "7 days" },
  { label: "Pending tasks", value: "12" },
  { label: "Due this week", value: "4" }
];

const priorities = [
  "Finish biology revision",
  "Submit design assignment",
  "Review economics notes"
];

function DashboardPage() {
  return (
    <section className="page dashboard-page">
      <div className="page__intro">
        <Badge tone="accent">Live workspace</Badge>
        <h1 className="page__title">Your calm study command center.</h1>
        <p className="page__text">
          This workspace will become the core place for tasks, sessions, and
          study planning across StudyOS.
        </p>
      </div>

      <div className="metric-grid">
        {stats.map((stat) => (
          <Surface key={stat.label} className="metric-card">
            <span className="metric-card__label">{stat.label}</span>
            <strong className="metric-card__value">{stat.value}</strong>
          </Surface>
        ))}
      </div>

      <div className="dashboard-grid">
        <Surface className="dashboard-panel">
          <h2 className="panel-title">Today’s priorities</h2>
          <ul className="priority-list">
            {priorities.map((item) => (
              <li key={item} className="priority-list__item">
                {item}
              </li>
            ))}
          </ul>
        </Surface>

        <Surface className="dashboard-panel">
          <h2 className="panel-title">Next actions</h2>
          <p className="page__text">
            Add tasks, schedule study sessions, and review progress in one place.
          </p>
          <Button to="/login" variant="ghost">
            Connect account
          </Button>
        </Surface>
      </div>
    </section>
  );
}

export default DashboardPage;