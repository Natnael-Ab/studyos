import { Badge, EmptyState, SectionHeader, Surface } from "../../../components/ui";

function TodayPanel({ snapshot }) {
  return (
    <Surface className="planner-panel">
      <SectionHeader
        eyebrow="Today"
        title="Today’s agenda"
        description="A focused list of sessions and deadlines for the current day."
      />

      {snapshot.todayItems.length > 0 ? (
        <ul className="planner-list">
          {snapshot.todayItems.map((item) => (
            <li key={`${item.kind}-${item.id}`} className="planner-list__item">
              <div className="planner-list__top">
                <div>
                  <h3 className="planner-list__title">{item.title}</h3>
                  <p className="planner-list__meta">{item.subtitle}</p>
                </div>

                <Badge tone={item.tone}>
                  {item.kind === "session" ? "Session" : "Task"}
                </Badge>
              </div>

              <p className="planner-list__text">{item.meta}</p>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No items scheduled for today"
          description="Add tasks or study sessions to make today’s agenda visible."
        />
      )}
    </Surface>
  );
}

export default TodayPanel;