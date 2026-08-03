import { useContext } from "react";
import WorkspaceSettingsContext from "../context/WorkspaceSettingsContext";

function useWorkspaceSettings() {
  const context = useContext(WorkspaceSettingsContext);

  if (!context) {
    throw new Error("useWorkspaceSettings must be used inside WorkspaceSettingsProvider");
  }

  return context;
}

export { useWorkspaceSettings };
export default useWorkspaceSettings;