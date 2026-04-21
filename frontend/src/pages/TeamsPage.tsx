import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTeams } from "../api/teamApi";
import type { Team } from "../types/team";
import PageIntro from "../components/layout/PageIntro";
import ClickableCard from "../components/ui/ClickableCard";
import StatusMessage from "../components/ui/StatusMessage";
import { badgeStyle, colors } from "../styles/ui";

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
        console.error("Fehler beim Laden der Mannschaften:", err);
        setError("Mannschaften konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    }

    void loadTeams();
  }, []);

  return (
    <div>
      <PageIntro
        title="Mannschaften"
        description="Hier findest du alle angelegten Mannschaften und kannst direkt in die jeweilige Detailansicht wechseln."
        accent
      />

      {loading && <StatusMessage>Mannschaften werden geladen...</StatusMessage>}
      {error && <StatusMessage variant="error">{error}</StatusMessage>}

      {!loading && !error && teams.length === 0 && (
        <StatusMessage variant="muted">
          Es wurden noch keine Mannschaften gefunden.
        </StatusMessage>
      )}

      {!loading && !error && teams.length > 0 && (
        <div
          style={{
            display: "grid",
            gap: "1rem",
            marginTop: "1.5rem",
          }}
        >
          {teams.map((team) => (
            <Link
              key={team.id}
              to={`/teams/${team.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ClickableCard>
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

                    <p
                      style={{
                        margin: "0 0 0.35rem 0",
                        color: colors.textMuted,
                        lineHeight: 1.5,
                      }}
                    >
                      {team.description || "Keine Beschreibung vorhanden."}
                    </p>
                  </div>

                  <div style={badgeStyle}>{team.memberCount} Mitglieder</div>
                </div>
              </ClickableCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}