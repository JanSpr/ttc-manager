import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTeams } from "../api/teamApi";
import type { Team } from "../types/team";
import {
  pageContainerStyle,
  clickableCardStyle,
  applyClickableCardHover,
  resetClickableCardHover,
} from "../styles/ui";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTeams() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchTeams();
        setTeams(data);
      } catch (err) {
        console.error("Fehler beim Laden der Teams:", err);
        setError("Teams konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    }

    loadTeams();
  }, []);

  return (
    <div style={pageContainerStyle}>
      <h1 style={{ marginBottom: "1.5rem" }}>Teams</h1>

      {loading && <p>Teams werden geladen...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && teams.length === 0 && (
        <p>Es wurden noch keine Teams gefunden.</p>
      )}

      {!loading && !error && teams.length > 0 && (
        <div style={{ display: "grid", gap: "1rem" }}>
          {teams.map((team) => (
            <Link
              key={team.id}
              to={`/teams/${team.id}`}
              style={clickableCardStyle}
              onMouseEnter={(e) => applyClickableCardHover(e.currentTarget)}
              onMouseLeave={(e) => resetClickableCardHover(e.currentTarget)}
            >
              <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem" }}>
                {team.name}
              </h2>

              <p style={{ margin: "0 0 0.35rem 0", color: "#555" }}>
                {team.description || "Keine Beschreibung vorhanden."}
              </p>

              <p style={{ margin: 0, color: "#666" }}>
                Mitglieder: {team.memberCount}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
