import { useContext } from "react";
import WorkspaceAccessContext from "../context/WorkspaceAccessContext";

function useWorkspaceAccess() {
  const context = useContext(WorkspaceAccessContext);

  if (!context) {
    throw new Error("useWorkspaceAccess must be used inside WorkspaceAccessProvider");
  }

  return context;
}

export { useWorkspaceAccess };
export default useWorkspaceAccess;