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
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: "0 0 0.5rem 0" }}>Teams</h1>
        <p style={{ margin: 0, color: "#555", lineHeight: 1.6 }}>
          Hier findest du alle angelegten Mannschaften und kannst direkt in die
          jeweilige Detailansicht wechseln.
        </p>
      </div>

      {loading && <p>Teams werden geladen...</p>}
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}

      {!loading && !error && teams.length === 0 && (
        <p>Es wurden noch keine Teams gefunden.</p>
      )}

      {!loading && !error && teams.length > 0 && (
        <div style={{ display: "grid", gap: "1rem" }}>
          {teams.map((team) => (
            <Link
              key={team.id}
              to={`/teams/${team.id}`}
              style={{
                ...clickableCardStyle,
                borderRadius: "14px",
              }}
              onMouseEnter={(e) => applyClickableCardHover(e.currentTarget)}
              onMouseLeave={(e) => resetClickableCardHover(e.currentTarget)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem" }}>
                    {team.name}
                  </h2>

                  <p style={{ margin: "0 0 0.35rem 0", color: "#555" }}>
                    {team.description || "Keine Beschreibung vorhanden."}
                  </p>
                </div>

                <div
                  style={{
                    padding: "0.35rem 0.65rem",
                    borderRadius: "999px",
                    backgroundColor: "#eff6ff",
                    color: "#1d4ed8",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {team.memberCount} Mitglieder
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}