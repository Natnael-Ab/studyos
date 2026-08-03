import { Badge, Button, Surface } from "../../../components/ui";

function DashboardHero() {
  return (
    <Surface className="dashboard-hero">
      <div className="dashboard-hero__content">
        <Badge tone="accent">Live workspace</Badge>
        <h1 className="page__title">Your calm study command center.</h1>
        <p className="page__text">
          StudyOS organizes daily priorities, deadlines, and study rhythm into a
          premium workspace that stays readable on every screen.
        </p>
      </div>

      <div className="dashboard-hero__actions">
        <Button type="button" variant="primary">
          Start focus session
        </Button>
        <Button type="button" variant="ghost">
          Review this week
        </Button>
      </div>
    </Surface>
  );
}

export default DashboardHero;