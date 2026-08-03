import { Badge, SectionHeader, Surface } from "../../../components/ui";

function WeeklyPlanner({ snapshot }) {
  return (
    <Surface className="planner-panel">
      <SectionHeader
        eyebrow="Week"
        title="Weekly planner"
        description="See your seven-day academic rhythm in one place."
      />

      <div className="weekly-grid">
        {snapshot.weekDays.map((day) => (
          <article key={day.dateKey} className={`weekly-day ${day.isToday ? "is-today" : ""}`}>
            <div className="weekly-day__header">
              <div>
                <span className="weekly-day__label">{day.label}</span>
                <strong className="weekly-day__date">{day.dateLabel}</strong>
              </div>

              <Badge tone={day.count > 0 ? "accent" : "neutral"}>{day.count}</Badge>
            </div>

            {day.items.length > 0 ? (
              <ul className="weekly-day__items">
                {day.items.slice(0, 3).map((item) => (
                  <li key={`${day.dateKey}-${item.kind}-${item.id}`} className="weekly-day__item">
                    <span className="weekly-day__item-title">{item.title}</span>
                    <span className="weekly-day__item-meta">{item.meta}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="weekly-day__empty">Open day</p>
            )}
          </article>
        ))}
      </div>
    </Surface>
  );
}

export default WeeklyPlanner;