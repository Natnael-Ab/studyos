import { Badge, SectionHeader, Surface } from "../../../components/ui";
import { useWorkspaceSettings } from "../../../hooks/useWorkspaceSettings";

const themeOptions = [
  { value: "system", title: "System", text: "Follow the device theme." },
  { value: "light", title: "Light", text: "Bright and calm." },
  { value: "dark", title: "Dark", text: "Deep and focused." }
];

const accentOptions = [
  { value: "bronze", title: "Bronze", swatch: "#8b6b4a" },
  { value: "navy", title: "Navy", swatch: "#5476a0" },
  { value: "emerald", title: "Emerald", swatch: "#2f8f6f" },
  { value: "plum", title: "Plum", swatch: "#8c5aa7" },
  { value: "rose", title: "Rose", swatch: "#bb6b7b" }
];

const densityOptions = [
  { value: "compact", title: "Compact", text: "Tighter spacing." },
  { value: "comfortable", title: "Comfortable", text: "Balanced spacing." },
  { value: "spacious", title: "Spacious", text: "Airy and calm." }
];

function AppearanceSettingsCard() {
  const { settings, updateAppearance } = useWorkspaceSettings();

  return (
    <Surface className="settings-card">
      <SectionHeader
        eyebrow="Appearance"
        title="Visual style"
        description="Set the premium look and feel across StudyOS."
        action={<Badge tone="neutral">Applied instantly</Badge>}
      />

      <div className="appearance-group">
        <span className="settings-label">Theme mode</span>
        <div className="appearance-option-grid">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`appearance-option ${
                settings.appearance.themeMode === option.value ? "is-selected" : ""
              }`}
              onClick={() => updateAppearance("themeMode", option.value)}
            >
              <strong className="appearance-option__title">{option.title}</strong>
              <span className="appearance-option__text">{option.text}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="appearance-group">
        <span className="settings-label">Accent color</span>
        <div className="appearance-option-grid">
          {accentOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`appearance-option ${
                settings.appearance.accentColor === option.value ? "is-selected" : ""
              }`}
              onClick={() => updateAppearance("accentColor", option.value)}
            >
              <span className="appearance-option__top">
                <span
                  className="appearance-option__swatch"
                  style={{ "--swatch": option.swatch }}
                />
                <strong className="appearance-option__title">{option.title}</strong>
              </span>
              <span className="appearance-option__text">Premium accent tone</span>
            </button>
          ))}
        </div>
      </div>

      <div className="appearance-group">
        <span className="settings-label">Density</span>
        <div className="appearance-option-grid">
          {densityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`appearance-option ${
                settings.appearance.density === option.value ? "is-selected" : ""
              }`}
              onClick={() => updateAppearance("density", option.value)}
            >
              <strong className="appearance-option__title">{option.title}</strong>
              <span className="appearance-option__text">{option.text}</span>
            </button>
          ))}
        </div>
      </div>
    </Surface>
  );
}

export default AppearanceSettingsCard;