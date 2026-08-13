const views = [
  {
    id: "today",
    label: "Today",
    description: "Immediate work"
  },
  {
    id: "week",
    label: "Week",
    description: "Seven-day rhythm"
  },
  {
    id: "month",
    label: "Month",
    description: "Deadlines and dates"
  }
];

function PlannerNavigation({
  activeView,
  onChange
}) {
  return (
    <nav
      className="planner-navigation"
      aria-label="Planner views"
    >
      <div className="planner-navigation__items">
        {views.map((view) => (
          <button
            key={view.id}
            type="button"
            className={`planner-navigation__item ${
              activeView === view.id
                ? "is-active"
                : ""
            }`}
            onClick={() =>
              onChange(view.id)
            }
            aria-pressed={
              activeView === view.id
            }
          >
            <span className="planner-navigation__item-label">
              {view.label}
            </span>

            <span className="planner-navigation__item-description">
              {view.description}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default PlannerNavigation;