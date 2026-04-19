import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TeamsPage from "./pages/TeamsPage";
import TeamDetailPage from "./pages/TeamDetailPage";
import MemberDetailPage from "./pages/MemberDetailPage";

function App() {
  return (
    <div className="app-shell">
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/">Home</Link> | <Link to="/teams">Teams</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/teams/:id" element={<TeamDetailPage />} />
        <Route path="/members/:id" element={<MemberDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
