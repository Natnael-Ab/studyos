import { Badge, Progress, SectionHeader, Surface } from "../../../components/ui";

const agendaItems = [
  {
    title: "Finish biology revision",
    meta: "Today · 45 minutes",
    status: "High priority"
  },
  {
    title: "Submit design assignment",
    meta: "Tomorrow · 1 hour",
    status: "Due soon"
  },
  {
    title: "Review economics notes",
    meta: "Friday · 30 minutes",
    status: "Light review"
  }
];

function DashboardAgenda() {
  return (
    <Surface className="dashboard-panel">
      <SectionHeader
        eyebrow="Today"
        title="Today’s priorities"
        description="Keep the most important work visible and easy to act on."
      />

      <ul className="agenda-list">
        {agendaItems.map((item) => (
          <li key={item.title} className="agenda-item">
            <div className="agenda-item__top">
              <div>
                <h3 className="agenda-item__title">{item.title}</h3>
                <p className="agenda-item__meta">{item.meta}</p>
              </div>
              <Badge tone="neutral">{item.status}</Badge>
            </div>
          </li>
        ))}
      </ul>

      <Progress value={68} label="Weekly momentum" />
    </Surface>
  );
}

export default DashboardAgenda;