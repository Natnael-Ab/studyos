import { useCallback, useEffect, useMemo, useState } from "react";
import WorkspaceSettingsContext from "./WorkspaceSettingsContext";
import {
  applyWorkspaceSettings,
  createDefaultSettings,
  loadSettings,
  persistSettings
} from "./workspaceSettingsStorage";

function WorkspaceSettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    persistSettings(settings);
  }, [settings]);

  useEffect(() => {
    applyWorkspaceSettings(settings);

    if (typeof window === "undefined" || settings.appearance.themeMode !== "system") {
      return undefined;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyWorkspaceSettings(settings);

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }

    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, [settings]);

  const updateAppearance = useCallback((field, value) => {
    setSettings((current) => ({
      ...current,
      appearance: {
        ...current.appearance,
        [field]: value
      }
    }));
  }, []);

  const updateWorkspace = useCallback((field, value) => {
    setSettings((current) => ({
      ...current,
      workspace: {
        ...current.workspace,
        [field]: value
      }
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(createDefaultSettings());
  }, []);

  const value = useMemo(
    () => ({
      settings,
      appearance: settings.appearance,
      workspace: settings.workspace,
      updateAppearance,
      updateWorkspace,
      resetSettings
    }),
    [settings, updateAppearance, updateWorkspace, resetSettings]
  );

  return (
    <WorkspaceSettingsContext.Provider value={value}>
      {children}
    </WorkspaceSettingsContext.Provider>
  );
}

export default WorkspaceSettingsProvider;