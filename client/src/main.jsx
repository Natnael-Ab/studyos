import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import WorkspaceSettingsProvider from "./context/WorkspaceSettingsProvider";
import WorkspaceAccessProvider from "./context/WorkspaceAccessProvider";
import StudyDataProvider from "./context/StudyDataProvider";
import WorkspaceLibraryProvider from "./context/WorkspaceLibraryProvider";
import UiFeedbackProvider from "./context/UiFeedbackProvider";
import ToastStack from "./components/feedback/ToastStack";
import ConfirmDialog from "./components/feedback/ConfirmDialog";
import "./styles/tokens.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UiFeedbackProvider>
      <WorkspaceSettingsProvider>
        <WorkspaceAccessProvider>
          <StudyDataProvider>
            <WorkspaceLibraryProvider>
              <App />
              <ToastStack />
              <ConfirmDialog />
            </WorkspaceLibraryProvider>
          </StudyDataProvider>
        </WorkspaceAccessProvider>
      </WorkspaceSettingsProvider>
    </UiFeedbackProvider>
  </React.StrictMode>
);