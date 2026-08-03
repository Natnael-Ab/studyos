import { Badge, Button, Surface } from "../../../components/ui";
import { useWorkspaceAccess } from "../../../hooks/useWorkspaceAccess";

function DashboardHero() {
  const { profile } = useWorkspaceAccess();

  const firstName =
    profile.fullName.trim().split(/\s+/).filter(Boolean)[0] || "there";
  const goalLabel = profile.goalType.replaceAll("-", " ");
  const subjectCount = profile.subjects.length;
  const termLabel = profile.termName || "the current term";

  return (
    <Surface className="dashboard-hero">
      <div className="dashboard-hero__content">
        <Badge tone="accent">Live workspace</Badge>
        <h1 className="page__title">Welcome back, {firstName}.</h1>
        <p className="page__text">
          Your {goalLabel} workspace is ready. {subjectCount} subject
          {subjectCount === 1 ? "" : "s"} are configured for {termLabel}.
        </p>
      </div>

      <div className="dashboard-hero__actions">
        <Button type="button" variant="primary">
          Start focus session
        </Button>
        <Button to="/settings" variant="ghost">
          Workspace settings
        </Button>
      </div>
    </Surface>
  );
}

export default DashboardHero;