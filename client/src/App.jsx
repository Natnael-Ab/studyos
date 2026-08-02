import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./layouts/AppShell";
import DashboardPage from "./pages/dashboard/DashboardPage";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;