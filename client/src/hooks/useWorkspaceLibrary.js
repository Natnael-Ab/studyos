import { useContext } from "react";
import WorkspaceLibraryContext from "../context/WorkspaceLibraryContext";

function useWorkspaceLibrary() {
  const context = useContext(WorkspaceLibraryContext);

  if (!context) {
    throw new Error("useWorkspaceLibrary must be used inside WorkspaceLibraryProvider");
  }

  return context;
}

export { useWorkspaceLibrary };
export default useWorkspaceLibrary;