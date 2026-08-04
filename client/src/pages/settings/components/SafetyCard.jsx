import { useNavigate } from "react-router-dom";
import { Badge, Button, SectionHeader, Surface } from "../../../components/ui";
import { useUiFeedback } from "../../../hooks/useUiFeedback";
import { useWorkspaceAccess } from "../../../hooks/useWorkspaceAccess";
import { useWorkspaceSettings } from "../../../hooks/useWorkspaceSettings";

function SafetyCard() {
  const navigate = useNavigate();
  const { signOut } = useWorkspaceAccess();
  const { resetSettings } = useWorkspaceSettings();
  const { confirm, pushToast } = useUiFeedback();

  async function handleSignOut() {
    const confirmed = await confirm({
      title: "Sign out of StudyOS?",
      description: "You will leave the workspace session and return to the entry flow.",
      confirmLabel: "Sign out",
      cancelLabel: "Stay here",
      tone: "accent"
    });

    if (!confirmed) {
      return;
    }

    navigate(signOut());
    pushToast({
      title: "Signed out",
      message: "Your workspace session ended cleanly.",
      tone: "neutral"
    });
  }

  async function handleResetPreferences() {
    const confirmed = await confirm({
      title: "Reset workspace preferences?",
      description: "This will restore theme, density, and layout preferences to the defaults.",
      confirmLabel: "Reset",
      cancelLabel: "Keep settings",
      tone: "neutral"
    });

    if (!confirmed) {
      return;
    }

    resetSettings();
    pushToast({
      title: "Preferences reset",
      message: "Workspace appearance and layout preferences were restored.",
      tone: "accent"
    });
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