import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTeams } from "../api/teamApi";
import type { Team } from "../types/team";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

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
    <div
      style={{
        padding: "2rem",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "1.5rem" }}>Teams</h1>

      {loading && <p>Teams werden geladen...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && teams.length === 0 && (
        <p>Es wurden noch keine Teams gefunden.</p>
      )}

      {!loading && !error && teams.length > 0 && (
        <div
          style={{
            display: "grid",
            gap: "1rem",
          }}
        >
          {teams.map((team) => (
            <div
              key={team.id}
              onClick={() => navigate(`/teams/${team.id}`)}
              style={{
                border: "1px solid #d0d7de",
                borderRadius: "10px",
                padding: "1rem 1.25rem",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                backgroundColor: "#ffffff",
                cursor: "pointer",
              }}
            >
              <h2
                style={{
                  margin: "0 0 0.5rem 0",
                  fontSize: "1.2rem",
                }}
              >
                {team.name}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#555",
                  lineHeight: 1.5,
                }}
              >
                {team.description || "Keine Beschreibung vorhanden."}
              </p>
              <p
                style={{
                  margin: 0,
                  color: "555",
                  lineHeight: 1.5,
                }}
                >
                  Mitglieder: {team.memberCount}
                </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}