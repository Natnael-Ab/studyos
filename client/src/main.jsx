import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import WorkspaceAccessProvider from "./context/WorkspaceAccessProvider";
import StudyDataProvider from "./context/StudyDataProvider";
import "./styles/tokens.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WorkspaceAccessProvider>
      <StudyDataProvider>
        <App />
      </StudyDataProvider>
    </WorkspaceAccessProvider>
  </React.StrictMode>
);