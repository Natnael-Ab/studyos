import {
  Badge,
  Button,
  EmptyState,
  Progress,
  SectionHeader,
  StatCard,
  Surface
} from "../../components/ui";

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
        <StatCard label="Study streak" value="7 days" detail="Consistent momentum" />
        <StatCard label="Pending tasks" value="12" detail="Needs review" />
        <StatCard label="Due this week" value="4" detail="Priority window" />
      </div>

      <div className="dashboard-grid">
        <Surface className="dashboard-panel">
          <SectionHeader
            eyebrow="Today"
            title="Today’s priorities"
            description="Keep the most important work visible and easy to act on."
          />
          <ul className="priority-list">
            {priorities.map((item) => (
              <li key={item} className="priority-list__item">
                {item}
              </li>
            ))}
          </ul>
          <Progress value={68} label="Weekly momentum" />
        </Surface>

        <Surface className="dashboard-panel">
          <SectionHeader
            eyebrow="Next"
            title="What to do after this"
            description="The next version will connect real data, planning, and reminders."
          />
          <EmptyState
            title="No live data yet"
            description="This space is ready for tasks, study sessions, and schedule insights."
            action={<Button to="/login" variant="ghost">Connect account</Button>}
          />
        </Surface>
      </div>
    </section>
  );
}

export default DashboardPage;