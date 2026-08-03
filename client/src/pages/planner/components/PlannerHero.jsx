import { Badge, Button, Surface } from "../../../components/ui";
import { useWorkspaceAccess } from "../../../hooks/useWorkspaceAccess";

function PlannerHero({ snapshot }) {
  const { profile } = useWorkspaceAccess();
  const firstName =
    profile.fullName.trim().split(/\s+/).filter(Boolean)[0] || "there";

  return (
    <Surface className="planner-hero">
      <div className="planner-hero__content">
        <Badge tone="accent">Planner</Badge>
        <h1 className="page__title">Plan the week with calm precision.</h1>
        <p className="page__text">
          {firstName}, your planner brings today, the week, and the month into one
          focused view so deadlines feel easier to manage.
        </p>

        {snapshot.nextItem ? (
          <div className="planner-hero__next">
            <span className="planner-hero__next-label">Next up</span>
            <strong className="planner-hero__next-title">{snapshot.nextItem.title}</strong>
            <span className="planner-hero__next-meta">
              {snapshot.nextItem.subjectName} · {snapshot.nextItem.meta}
            </span>
          </div>
        ) : null}
      </div>

      <div className="planner-hero__actions">
        <Button to="/dashboard" variant="primary">
          Back to workspace
        </Button>
        <Button to="/settings" variant="ghost">
          Workspace settings
        </Button>
      </div>
    </Surface>
  );
}

export default PlannerHero;