import {
  Badge,
  SectionHeader,
  Surface
} from "../../../components/ui";

const weekdayLabels = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat"
];

function CalendarPanel({
  snapshot
}) {
  return (
    <Surface className="planner-panel planner-calendar planner-calendar--premium">
      <SectionHeader
        eyebrow="Month"
        title={
          snapshot.monthLabel
        }
        description="Use the month to understand deadlines, study blocks, and exam pressure at a glance."
        action={
          <Badge tone="neutral">
            Month overview
          </Badge>
        }
      />

      <div
        className="calendar-grid calendar-grid__labels"
        aria-hidden="true"
      >
        {weekdayLabels.map(
          (label) => (
            <div
              key={label}
              className="calendar-grid__label"
            >
              {label}
            </div>
          )
        )}
      </div>

      <div
        className="calendar-grid planner-calendar__days"
        aria-label={`${snapshot.monthLabel} calendar`}
      >
        {snapshot.monthDays.map(
          (day) => (
            <div
              key={
                day.dateKey
              }
              className={`calendar-day planner-calendar__day ${
                day.isCurrentMonth
                  ? ""
                  : "is-muted"
              } ${
                day.isToday
                  ? "is-today"
                  : ""
              } ${
                day.hasItems
                  ? "has-items"
                  : ""
              }`}
            >
              <span className="calendar-day__number">
                {day.label}
              </span>

              {day.hasItems ? (
                <span className="calendar-day__dots">
                  {day.taskCount >
                  0 ? (
                    <span
                      className="calendar-day__dot is-task"
                      title={`${day.taskCount} task${
                        day.taskCount ===
                        1
                          ? ""
                          : "s"
                      }`}
                    />
                  ) : null}

                  {day.sessionCount >
                  0 ? (
                    <span
                      className="calendar-day__dot is-session"
                      title={`${day.sessionCount} session${
                        day.sessionCount ===
                        1
                          ? ""
                          : "s"
                      }`}
                    />
                  ) : null}

                  {day.examCount >
                  0 ? (
                    <span
                      className="calendar-day__dot is-exam"
                      title={`${day.examCount} exam${
                        day.examCount ===
                        1
                          ? ""
                          : "s"
                      }`}
                    />
                  ) : null}
                </span>
              ) : null}
            </div>
          )
        )}
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
          <span className="calendar-legend__dot is-exam" />
          Exams
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