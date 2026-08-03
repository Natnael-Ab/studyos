import { Badge, EmptyState, SectionHeader, Surface } from "../../../components/ui";

const weekPlan = [
  {
    day: "Monday",
    focus: "Map the week and clear backlog"
  },
  {
    day: "Wednesday",
    focus: "Deep study block for core subjects"
  },
  {
    day: "Friday",
    focus: "Review tasks and prepare next deadlines"
  }
];

function DashboardPlan() {
  return (
    <Surface className="dashboard-panel">
      <SectionHeader
        eyebrow="Week"
        title="Weekly plan"
        description="See the rhythm of the week without switching between screens."
      />

      <div className="plan-list">
        {weekPlan.map((item) => (
          <article key={item.day} className="plan-card">
            <div className="plan-card__header">
              <h3 className="plan-card__title">{item.day}</h3>
              <Badge tone="accent">Planned</Badge>
            </div>
            <p className="plan-card__text">{item.focus}</p>
          </article>
        ))}
      </div>

      <EmptyState
        title="No synced calendar yet"
        description="This area will later show class schedules, deadlines, and session timing."
      />
    </Surface>
  );
}

export default DashboardPlan;