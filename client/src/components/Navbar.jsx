import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav aria-label="Primary" style={{ display: "flex", gap: 12, padding: 16 }}>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/dashboard">Dashboard</Link>
    </nav>
  );
}

export default Navbar;