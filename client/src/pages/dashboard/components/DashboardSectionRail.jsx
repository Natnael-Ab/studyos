import { useEffect, useState } from "react";

const sections = [
  {
    id: "dashboard-tasks",
    label: "Tasks"
  },
  {
    id: "dashboard-focus",
    label: "Focus"
  },
  {
    id: "dashboard-insights",
    label: "Insights"
  },
  {
    id: "dashboard-plan",
    label: "Plan"
  }
];

function DashboardSectionRail() {
  const [activeId, setActiveId] =
    useState(sections[0].id);

  useEffect(() => {
    const elements = sections
      .map((section) =>
        document.getElementById(
          section.id
        )
      )
      .filter(Boolean);

    if (!elements.length) {
      return undefined;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const visibleEntries =
            entries
              .filter(
                (entry) =>
                  entry.isIntersecting
              )
              .sort(
                (left, right) =>
                  right.intersectionRatio -
                  left.intersectionRatio
              );

          if (
            visibleEntries.length > 0
          ) {
            setActiveId(
              visibleEntries[0].target.id
            );
          }
        },
        {
          rootMargin:
            "-18% 0px -62% 0px",
          threshold: [
            0,
            0.15,
            0.35,
            0.6
          ]
        }
      );

    elements.forEach(
      (element) =>
        observer.observe(element)
    );

    return () => {
      observer.disconnect();
    };
  }, []);

  function handleNavigate(
    id
  ) {
    const element =
      document.getElementById(id);

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  return (
    <nav
      className="dashboard-section-rail"
      aria-label="Dashboard sections"
    >
      <span className="dashboard-section-rail__label">
        Workspace
      </span>

      <div className="dashboard-section-rail__items">
        {sections.map(
          (section) => (
            <button
              key={section.id}
              type="button"
              className={`dashboard-section-rail__item ${
                activeId === section.id
                  ? "is-active"
                  : ""
              }`}
              onClick={() =>
                handleNavigate(
                  section.id
                )
              }
            >
              <span
                className="dashboard-section-rail__dot"
                aria-hidden="true"
              />

              <span>
                {section.label}
              </span>
            </button>
          )
        )}
      </div>
    </nav>
  );
}

export default DashboardSectionRail;