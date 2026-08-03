import { Badge, SectionHeader, Surface } from "../../../components/ui";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarPanel({ snapshot }) {
  return (
    <Surface className="planner-panel planner-calendar">
      <SectionHeader
        eyebrow="Month"
        title={snapshot.monthLabel}
        description="A clean calendar view for deadlines, sessions, and study momentum."
        action={<Badge tone="neutral">Month view</Badge>}
      />

      <div className="calendar-grid calendar-grid__labels" aria-hidden="true">
        {weekdayLabels.map((label) => (
          <div key={label} className="calendar-grid__label">
            {label}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {snapshot.monthDays.map((day) => (
          <div
            key={day.dateKey}
            className={`calendar-day ${day.isCurrentMonth ? "" : "is-muted"} ${
              day.isToday ? "is-today" : ""
            } ${day.hasItems ? "has-items" : ""}`}
          >
            <span className="calendar-day__number">{day.label}</span>
            {day.hasItems ? (
              <span className="calendar-day__dots">
                {day.taskCount > 0 ? <span className="calendar-day__dot is-task" /> : null}
                {day.sessionCount > 0 ? <span className="calendar-day__dot is-session" /> : null}
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <div className="calendar-legend">
        <span className="calendar-legend__item">
          <span className="calendar-legend__dot is-task" />
          Tasks
        </span>
        <span className="calendar-legend__item">
          <span className="calendar-legend__dot is-session" />
          Sessions
        </span>
        <span className="calendar-legend__item">
          <span className="calendar-legend__dot is-today" />
          Today
        </span>
      </div>
    </Surface>
  );
}

export default CalendarPanel;