const storageKey = "studyos.settings.v1";

const defaultSettings = {
  appearance: {
    themeMode: "system",
    accentColor: "bronze",
    density: "comfortable"
  },
  workspace: {
    layoutMode: "balanced",
    weekStartDay: "monday",
    showInsights: true,
    showProgressSidebar: true,
    showQuickActions: true
  }
};

const validThemeModes = new Set(["system", "light", "dark"]);
const validAccentColors = new Set(["bronze", "navy", "emerald", "plum", "rose"]);
const validDensityModes = new Set(["compact", "comfortable", "spacious"]);
const validLayoutModes = new Set(["balanced", "focus", "overview"]);
const validWeekStartDays = new Set(["monday", "sunday"]);

const densityPaddingMap = {
  compact: "0.9rem",
  comfortable: "1.1rem",
  spacious: "1.3rem"
};

function createDefaultSettings() {
  return {
    appearance: { ...defaultSettings.appearance },
    workspace: { ...defaultSettings.workspace }
  };
}

function normalizeSettings(input) {
  const base = createDefaultSettings();

  if (!input || typeof input !== "object") {
    return base;
  }

  const appearance = input.appearance ?? {};
  const workspace = input.workspace ?? {};

  return {
    appearance: {
      themeMode: validThemeModes.has(appearance.themeMode)
        ? appearance.themeMode
        : base.appearance.themeMode,
      accentColor: validAccentColors.has(appearance.accentColor)
        ? appearance.accentColor
        : base.appearance.accentColor,
      density: validDensityModes.has(appearance.density)
        ? appearance.density
        : base.appearance.density
    },
    workspace: {
      layoutMode: validLayoutModes.has(workspace.layoutMode)
        ? workspace.layoutMode
        : base.workspace.layoutMode,
      weekStartDay: validWeekStartDays.has(workspace.weekStartDay)
        ? workspace.weekStartDay
        : base.workspace.weekStartDay,
      showInsights:
        typeof workspace.showInsights === "boolean"
          ? workspace.showInsights
          : base.workspace.showInsights,
      showProgressSidebar:
        typeof workspace.showProgressSidebar === "boolean"
          ? workspace.showProgressSidebar
          : base.workspace.showProgressSidebar,
      showQuickActions:
        typeof workspace.showQuickActions === "boolean"
          ? workspace.showQuickActions
          : base.workspace.showQuickActions
    }
  };
}

function loadSettings() {
  if (typeof window === "undefined") {
    return createDefaultSettings();
  }

  try {
    const raw = window.localStorage.getItem(storageKey);

    if (!raw) {
      return createDefaultSettings();
    }

    return normalizeSettings(JSON.parse(raw));
  } catch {
    return createDefaultSettings();
  }
}

function persistSettings(settings) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  } catch {
    // Keep the app usable even if storage is blocked.
  }
}

function resolveThemeMode(themeMode) {
  if (themeMode !== "system") {
    return themeMode;
  }

  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyWorkspaceSettings(settings) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const activeTheme = resolveThemeMode(settings.appearance.themeMode);

  root.dataset.theme = activeTheme;
  root.dataset.accent = settings.appearance.accentColor;
  root.dataset.density = settings.appearance.density;
  root.dataset.layout = settings.workspace.layoutMode;
  root.dataset.weekStart = settings.workspace.weekStartDay;
  root.style.colorScheme = activeTheme;
  root.style.setProperty(
    "--surface-padding",
    densityPaddingMap[settings.appearance.density] ?? densityPaddingMap.comfortable
  );
}

export {
  applyWorkspaceSettings,
  createDefaultSettings,
  loadSettings,
  persistSettings,
  resolveThemeMode
};