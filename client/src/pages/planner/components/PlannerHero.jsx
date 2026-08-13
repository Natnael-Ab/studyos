import {
  Badge,
  Button,
  Surface
} from "../../../components/ui";

import {
  useWorkspaceAccess
} from "../../../hooks/useWorkspaceAccess";

const viewCopy = {
  today: {
    eyebrow: "Today",

    title:
      "Make today feel clear.",

    description:
      "Start with the work that matters now. Your agenda keeps tasks and study blocks together without turning the day into a crowded calendar."
  },

  week: {
    eyebrow: "Week",

    title:
      "Build a realistic week.",

    description:
      "See where deadlines and study blocks land together, then adjust the rhythm before the workload becomes heavy."
  },

  month: {
    eyebrow: "Month",

    title:
      "See the shape of the term.",

    description:
      "Use the month as the strategic layer for exams, deadlines, and important academic dates."
  }
};

function PlannerHero({
  snapshot,
  activeView
}) {
  const {
    profile
  } = useWorkspaceAccess();

  const firstName =
    profile.fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)[0] ||
    "there";

  const copy =
    viewCopy[activeView] ??
    viewCopy.today;

  return (
    <Surface className="planner-hero planner-hero--premium">
      <div className="planner-hero__content">
        <div className="planner-hero__eyebrow-row">
          <Badge tone="accent">
            {copy.eyebrow}
          </Badge>

          <span className="planner-hero__term">
            {snapshot.termName}
          </span>
        </div>

        <h1 className="planner-hero__title">
          {firstName},{" "}
          {copy.title.toLowerCase()}
        </h1>

        <p className="planner-hero__text">
          {copy.description}
        </p>

        <div className="planner-hero__signal">
          <span>
            Next up
          </span>

          {snapshot.nextItem ? (
            <div>
              <strong>
                {
                  snapshot
                    .nextItem
                    .title
                }
              </strong>

              <small>
                {
                  snapshot
                    .nextItem
                    .subjectName
                }
                {" · "}
                {
                  snapshot
                    .nextItem
                    .meta
                }
              </small>
            </div>
          ) : (
            <div>
              <strong>
                Nothing needs your
                attention yet.
              </strong>

              <small>
                Your planner is clear.
              </small>
            </div>
          )}
        </div>
      </div>

      <div className="planner-hero__actions">
        <Button
          to="/dashboard"
          variant="primary"
        >
          Back to workspace
        </Button>

        <Button
          to="/settings"
          variant="ghost"
        >
          Planner settings
        </Button>
      </div>
    </Surface>
  );
}

export default PlannerHero;