import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchTeamById } from "../api/teamApi";
import type { Team, TeamMembershipSummary } from "../types/team";
import {
  pageContainerStyle,
  contentCardStyle,
  clickableCardStyle,
  applyClickableCardHover,
  resetClickableCardHover,
} from "../styles/ui";

function formatMembershipRole(membership: TeamMembershipSummary): string {
  const labels: string[] = [];

  if (membership.captain) {
    labels.push("Mannschaftsführer");
  }

  if (membership.viceCaptain) {
    labels.push("Stellvertretung");
  }

  if (membership.player) {
    labels.push("Spieler");
  }

  return labels.length > 0 ? labels.join(" · ") : "Keine Teamfunktion";
}

function formatLineupPosition(position: number | null): string {
  if (position == null) {
    return "–";
  }
  return String(position);
}

export default function TeamDetailPage() {
  const { id } = useParams();

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTeamDetail() {
      if (!id) {
        setError("Keine Team-ID in der URL gefunden.");
        setLoading(false);
        return;
      }

      const teamId = Number(id);

      if (Number.isNaN(teamId)) {
        setError("Ungültige Team-ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const teamData = await fetchTeamById(teamId);
        setTeam(teamData);
      } catch (err) {
        console.error("Fehler beim Laden der Team-Details:", err);
        setError("Teamdetails konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    }

    loadTeamDetail();
  }, [id]);

  return (
    <div style={pageContainerStyle}>
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/teams" style={{ color: "#2563eb", textDecoration: "none" }}>
          ← Zurück zur Teamliste
        </Link>
      </div>

      {loading && <p style={{ marginTop: "1rem" }}>Team wird geladen...</p>}
      {error && <p style={{ marginTop: "1rem", color: "#b91c1c" }}>{error}</p>}

      {!loading && !error && team && (
        <>
          <div style={{ ...contentCardStyle, marginBottom: "1.5rem" }}>
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
                <h1 style={{ marginTop: 0, marginBottom: "0.75rem" }}>
                  {team.name}
                </h1>

                <p style={{ margin: 0, color: "#555", lineHeight: 1.6 }}>
                  {team.description || "Keine Beschreibung vorhanden."}
                </p>
              </div>

              <div
                style={{
                  padding: "0.45rem 0.8rem",
                  borderRadius: "999px",
                  backgroundColor: "#eff6ff",
                  color: "#1d4ed8",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                {team.memberCount} Mitglieder
              </div>
            </div>
          </div>

          <div style={contentCardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1.2rem" }}>
              Teammitglieder
            </h2>

            {team.memberships.length === 0 ? (
              <p style={{ color: "#666", margin: 0 }}>
                Diesem Team sind aktuell keine Mitglieder zugeordnet.
              </p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {team.memberships.map((membership) => (
                  <li
                    key={membership.membershipId}
                    style={{ marginBottom: "0.75rem" }}
                  >
                    <Link
                      to={`/members/${membership.memberId}`}
                      state={{
                        fromTeamId: team.id,
                        fromTeamName: team.name,
                      }}
                      style={{
                        ...clickableCardStyle,
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        borderRadius: "14px",
                      }}
                      onMouseEnter={(e) =>
                        applyClickableCardHover(e.currentTarget)
                      }
                      onMouseLeave={(e) =>
                        resetClickableCardHover(e.currentTarget)
                      }
                    >
                      <div
                        style={{
                          minWidth: "2.5rem",
                          height: "2.5rem",
                          borderRadius: "999px",
                          backgroundColor: "#eff6ff",
                          color: "#1d4ed8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1rem",
                          fontWeight: "bold",
                          flexShrink: 0,
                        }}
                      >
                        {formatLineupPosition(membership.lineupPosition)}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: "bold",
                            marginBottom: "0.25rem",
                            color: "#111827",
                          }}
                        >
                          {membership.memberFullName}
                        </div>

                        <div style={{ color: "#555", marginBottom: "0.25rem" }}>
                          {formatMembershipRole(membership)}
                        </div>

                        <div style={{ fontSize: "0.95rem", color: "#666" }}>
                          {membership.userId
                            ? `Mit Login verknüpft (User-ID: ${membership.userId})`
                            : "Kein Login verknüpft"}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}