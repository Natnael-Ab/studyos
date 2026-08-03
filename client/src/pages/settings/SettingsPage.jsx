import { useMemo } from "react";
import { Badge, Button, Progress, StatCard, Surface } from "../../components/ui";
import { PageTransition, Reveal } from "../../components/motion";
import { useWorkspaceAccess } from "../../hooks/useWorkspaceAccess";
import { useWorkspaceSettings } from "../../hooks/useWorkspaceSettings";
import ProfileSettingsCard from "./components/ProfileSettingsCard";
import AppearanceSettingsCard from "./components/AppearanceSettingsCard";
import WorkspacePreferencesCard from "./components/WorkspacePreferencesCard";
import SafetyCard from "./components/SafetyCard";

function toTitleCase(value) {
  return `${value}`
    .replaceAll("-", " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function SettingsPage() {
  const { profile } = useWorkspaceAccess();
  const { settings } = useWorkspaceSettings();

  const summaryCards = useMemo(
    () => [
      {
        label: "Subjects",
        value: String(profile.subjects.length),
        detail: "Configured for the workspace"
      },
      {
        label: "Theme",
        value: toTitleCase(settings.appearance.themeMode),
        detail: "Premium visual mode"
      },
      {
        label: "Layout",
        value: toTitleCase(settings.workspace.layoutMode),
        detail: "Dashboard behavior"
      },
      {
        label: "Study hours",
        value: String(profile.weeklyStudyHours),
        detail: "Per week"
      }
    ],
    [
      profile.subjects.length,
      profile.weeklyStudyHours,
      settings.appearance.themeMode,
      settings.workspace.layoutMode
    ]
  );

  const completeness =
    (profile.fullName ? 20 : 0) +
    (profile.email ? 20 : 0) +
    (profile.termName ? 20 : 0) +
    (profile.subjects.length > 0 ? 20 : 0) +
    (profile.weeklyStudyHours > 0 ? 20 : 0);

  return (
    <PageTransition>
      <section className="page settings-page">
        <Reveal className="settings-hero">
          <Badge tone="accent">Workspace settings</Badge>
          <h1 className="page__title">Your workspace, tuned for the way you study.</h1>
          <p className="page__text">
            Edit your profile, theme, layout, and subject setup. Changes are saved locally
            so the workspace stays consistent across sessions.
          </p>

          <div className="settings-hero__actions">
            <Button to="/dashboard" variant="primary">
              Back to workspace
            </Button>
          </div>
        </Reveal>

        <div className="settings-summary-grid">
          {summaryCards.map((card) => (
            <Reveal key={card.label}>
              <StatCard label={card.label} value={card.value} detail={card.detail} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <Surface className="settings-card settings-card--progress">
            <div className="settings-card__row">
              <div>
                <h2 className="panel-title">Profile completeness</h2>
                <p className="page__text">
                  A complete profile makes StudyOS feel more personalized and ready.
                </p>
              </div>
              <Badge tone="neutral">{completeness}% complete</Badge>
            </div>
            <Progress value={completeness} label="Setup progress" />
          </Surface>
        </Reveal>

        <div className="settings-layout">
          <div className="settings-column">
            <Reveal>
              <ProfileSettingsCard />
            </Reveal>

            <Reveal delay={0.04}>
              <AppearanceSettingsCard />
            </Reveal>
          </div>

          <div className="settings-column">
            <Reveal>
              <WorkspacePreferencesCard />
            </Reveal>

            <Reveal delay={0.04}>
              <SafetyCard />
            </Reveal>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

export default SettingsPage;