import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchTeamById } from "../api/teamApi";
import type { Team, TeamMembershipSummary } from "../types/team";
import PageIntro from "../components/layout/PageIntro";
import Card from "../components/ui/Card";
import ClickableCard from "../components/ui/ClickableCard";
import StatusMessage from "../components/ui/StatusMessage";
import { cardTitleStyle, badgeStyle, colors } from "../styles/ui";

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
        setError("Keine Mannschafts-ID in der URL gefunden.");
        setLoading(false);
        return;
      }

      const teamId = Number(id);

      if (Number.isNaN(teamId)) {
        setError("Ungültige Mannschafts-ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const teamData = await fetchTeamById(teamId);
        setTeam(teamData);
      } catch (err) {
        console.error("Fehler beim Laden der Mannschafts-Details:", err);
        setError("Mannschaftsdetails konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    }

    void loadTeamDetail();
  }, [id]);

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/teams" style={{ color: colors.primary }}>
          ← Zurück zur Mannschaftsübersicht
        </Link>
      </div>

      {loading && <StatusMessage>Mannschaft wird geladen...</StatusMessage>}
      {error && <StatusMessage variant="error">{error}</StatusMessage>}

      {!loading && !error && team && (
        <>
          <PageIntro
            title={team.name}
            description={team.description || "Keine Beschreibung vorhanden."}
            eyebrow="Mannschaft"
          />

          <Card>
            <h2 style={cardTitleStyle}>Mannschaftsmitglieder</h2>

            {team.memberships.length === 0 ? (
              <StatusMessage variant="muted" marginTop="0">
                Dieser Mannschaft sind aktuell keine Mitglieder zugeordnet.
              </StatusMessage>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {team.memberships.map((membership) => (
                  <li key={membership.memberId} style={{ marginTop: "0.85rem" }}>
                    <Link
                      to={`/members/${membership.memberId}`}
                      state={{
                        fromTeamId: team.id,
                        fromTeamName: team.name,
                      }}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <ClickableCard style={{ borderRadius: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                          }}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "999px",
                              backgroundColor: colors.primarySoft,
                              color: colors.primary,
                              fontWeight: 800,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                            title="Aufstellung"
                          >
                            {formatLineupPosition(membership.lineupPosition)}
                          </div>

                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontWeight: 700,
                                marginBottom: "0.25rem",
                                color: colors.text,
                              }}
                            >
                              {membership.memberFullName}
                            </div>

                            <div
                              style={{
                                color: colors.textMuted,
                                marginBottom: "0.25rem",
                              }}
                            >
                              {formatMembershipRole(membership)}
                            </div>

                            <div
                              style={{
                                fontSize: "0.95rem",
                                color: colors.textMuted,
                              }}
                            >
                              {membership.userId
                                ? `Mit Login verknüpft (Benutzer-ID: ${membership.userId})`
                                : "Kein Login verknüpft"}
                            </div>
                          </div>

                          <div style={badgeStyle}>Profil</div>
                        </div>
                      </ClickableCard>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  );
}