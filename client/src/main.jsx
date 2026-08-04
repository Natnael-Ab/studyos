import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import WorkspaceSettingsProvider from "./context/WorkspaceSettingsProvider";
import WorkspaceAccessProvider from "./context/WorkspaceAccessProvider";
import StudyDataProvider from "./context/StudyDataProvider";
import WorkspaceLibraryProvider from "./context/WorkspaceLibraryProvider";
import "./styles/tokens.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WorkspaceSettingsProvider>
      <WorkspaceAccessProvider>
        <StudyDataProvider>
          <WorkspaceLibraryProvider>
            <App />
          </WorkspaceLibraryProvider>
        </StudyDataProvider>
      </WorkspaceAccessProvider>
    </WorkspaceSettingsProvider>
  </React.StrictMode>
);