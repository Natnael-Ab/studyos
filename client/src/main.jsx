import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { StudyDataProvider } from "./context/StudyDataContext";
import "./styles/tokens.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StudyDataProvider>
      <App />
    </StudyDataProvider>
  </React.StrictMode>
);