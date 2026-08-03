import { Select, SectionHeader, Surface, Switch } from "../../../components/ui";
import { useWorkspaceSettings } from "../../../hooks/useWorkspaceSettings";

const layoutOptions = [
  { value: "balanced", label: "Balanced" },
  { value: "focus", label: "Focus" },
  { value: "overview", label: "Overview" }
];

const weekStartOptions = [
  { value: "monday", label: "Monday" },
  { value: "sunday", label: "Sunday" }
];

function WorkspacePreferencesCard() {
  const { settings, updateWorkspace } = useWorkspaceSettings();

  return (
    <Surface className="settings-card">
      <SectionHeader
        eyebrow="Workspace"
        title="Layout preferences"
        description="Control how StudyOS surfaces information on the dashboard."
      />

      <div className="profile-field-grid">
        <Select
          label="Default layout"
          value={settings.workspace.layoutMode}
          onChange={(event) => updateWorkspace("layoutMode", event.target.value)}
        >
          {layoutOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Select
          label="Week starts on"
          value={settings.workspace.weekStartDay}
          onChange={(event) => updateWorkspace("weekStartDay", event.target.value)}
        >
          {weekStartOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="preferences-grid">
        <Switch
          label="Show insights panel"
          hint="Display productivity and workload analysis on the dashboard."
          checked={settings.workspace.showInsights}
          onChange={(value) => updateWorkspace("showInsights", value)}
        />

        <Switch
          label="Show progress sidebar"
          hint="Keep the subject progress view visible in workspace layouts."
          checked={settings.workspace.showProgressSidebar}
          onChange={(value) => updateWorkspace("showProgressSidebar", value)}
        />

        <Switch
          label="Show quick actions"
          hint="Surface fast actions at the top of your workspace."
          checked={settings.workspace.showQuickActions}
          onChange={(value) => updateWorkspace("showQuickActions", value)}
        />
      </div>
    </Surface>
  );
}

export default WorkspacePreferencesCard;