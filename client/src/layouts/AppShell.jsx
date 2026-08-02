import { Outlet } from "react-router-dom";
import TopBar from "../components/navigation/TopBar";

function AppShell() {
  return (
    <div className="app-shell">
      <TopBar />
      <main className="app-shell__main">
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;