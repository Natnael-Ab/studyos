import { useNavigate } from "react-router-dom";
import { Badge, Button, SectionHeader, Surface } from "../../../components/ui";
import { useWorkspaceAccess } from "../../../hooks/useWorkspaceAccess";
import { useWorkspaceSettings } from "../../../hooks/useWorkspaceSettings";

function SafetyCard() {
  const navigate = useNavigate();
  const { signOut } = useWorkspaceAccess();
  const { resetSettings } = useWorkspaceSettings();

  function handleSignOut() {
    navigate(signOut());
  }

  function handleResetPreferences() {
    resetSettings();
  }

  return (
    <Surface className="settings-card">
      <SectionHeader
        eyebrow="Safety"
        title="Account actions"
        description="Reset the workspace look or leave the current session."
        action={<Badge tone="neutral">Local workspace</Badge>}
      />

      <div className="safety-actions">
        <Button type="button" variant="ghost" onClick={handleResetPreferences}>
          Reset preferences
        </Button>
        <Button type="button" variant="primary" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </Surface>
  );
}

export default SafetyCard;