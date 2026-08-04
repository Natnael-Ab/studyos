import { Badge, Button, Surface } from "../../../components/ui";
import { useWorkspaceAccess } from "../../../hooks/useWorkspaceAccess";

function LibraryHero({ summary }) {
  const { profile } = useWorkspaceAccess();

  const firstName =
    profile.fullName.trim().split(/\s+/).filter(Boolean)[0] || "there";

  return (
    <Surface className="library-hero">
      <div className="library-hero__content">
        <Badge tone="accent">Library</Badge>
        <h1 className="page__title">Notes, resources, and attachments in one calm place.</h1>
        <p className="page__text">
          {firstName}, keep your study notes, reading links, and attachment records
          connected to the same workspace.
        </p>
      </div>

      <div className="library-hero__snapshot">
        <div className="library-hero__snapshot-card">
          <span className="library-hero__snapshot-label">Total entries</span>
          <strong className="library-hero__snapshot-value">{summary.totalItems}</strong>
        </div>

        <div className="library-hero__snapshot-card">
          <span className="library-hero__snapshot-label">Linked items</span>
          <strong className="library-hero__snapshot-value">{summary.linkedItems}</strong>
        </div>
      </div>

      <div className="library-hero__actions">
        <Button to="/planner" variant="primary">
          Open planner
        </Button>
        <Button to="/search" variant="ghost">
          Search workspace
        </Button>
      </div>
    </Surface>
  );
}

export default LibraryHero;