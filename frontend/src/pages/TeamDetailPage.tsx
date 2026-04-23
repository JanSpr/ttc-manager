import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchTeamById } from "../api/teamApi";
import type { Team, TeamMembershipSummary } from "../types/team";
import PageIntro from "../components/layout/PageIntro";
import Card from "../components/ui/Card";
import ClickableCard from "../components/ui/ClickableCard";
import StatusMessage from "../components/ui/StatusMessage";
import { badgeStyle, cardTitleStyle, colors } from "../styles/ui";

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

function formatLineupPosition(position: number | null | undefined): string {
  if (position == null) {
    return "–";
  }

  return String(position);
}

function getInitials(value: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "?";
  }

  const words = trimmedValue.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return trimmedValue.slice(0, 2).toUpperCase();
}

function TeamAvatar({ teamName }: { teamName: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: "68px",
        height: "68px",
        borderRadius: "16px",
        border: `1px solid ${colors.border}`,
        background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
        color: colors.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: "1.1rem",
        flexShrink: 0,
        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.06)",
        userSelect: "none",
      }}
    >
      {getInitials(teamName)}
    </div>
  );
}

function MemberAvatar({ fullName }: { fullName: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: "48px",
        height: "48px",
        borderRadius: "14px",
        border: `1px solid ${colors.border}`,
        background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
        color: colors.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: "0.95rem",
        flexShrink: 0,
        boxShadow: "0 6px 16px rgba(15, 23, 42, 0.05)",
        userSelect: "none",
      }}
    >
      {getInitials(fullName)}
    </div>
  );
}

function getStatusBadgeStyle(isActive: boolean) {
  return {
    ...badgeStyle,
    fontSize: "0.75rem",
    padding: "0.2rem 0.5rem",
    fontWeight: 600,
    opacity: 1,
    backgroundColor: isActive ? colors.primarySoft : colors.surfaceSoft,
    color: isActive ? colors.primary : colors.textMuted,
  };
}

const profileBadgeStyle = {
  ...badgeStyle,
  fontSize: "0.75rem",
  padding: "0.2rem 0.5rem",
  fontWeight: 600,
};

const lineupBadgeStyle = {
  minWidth: "40px",
  height: "40px",
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surface,
  color: colors.text,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: "0.95rem",
  flexShrink: 0,
  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
};

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
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "1.5rem 1rem 3rem",
        display: "grid",
        gap: "1.5rem",
      }}
    >
      <Link
        to="/teams"
        style={{
          color: colors.primary,
          textDecoration: "none",
          fontWeight: 600,
          width: "fit-content",
        }}
      >
        ← Zurück zur Mannschaftsübersicht
      </Link>

      {loading && (
        <StatusMessage variant="info">
          Mannschaft wird geladen...
        </StatusMessage>
      )}

      {error && <StatusMessage variant="error">{error}</StatusMessage>}

      {!loading && !error && team && (
        <>
          <PageIntro
            title={team.name}
            description={team.description || "Keine Beschreibung vorhanden."}
            eyebrow={
              <div
                style={{
                  position: "absolute",
                  left: "1.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  margin: 0,
                }}
              >
                <TeamAvatar teamName={team.name} />
              </div>
            }
            style={{
              position: "relative",
              minHeight: "112px",
              paddingLeft: "6.75rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          />

          <Card>
            <h2 style={cardTitleStyle}>Mannschaftsmitglieder</h2>

            {team.memberships.length === 0 ? (
              <div
                style={{
                  color: colors.textMuted,
                }}
              >
                Dieser Mannschaft sind aktuell keine Mitglieder zugeordnet.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "0.9rem",
                }}
              >
                {team.memberships.map((membership) => {
                  const isRegistered = membership.userId != null;

                  return (
                    <div
                      key={membership.memberId}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "40px minmax(0, 1fr)",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <div style={lineupBadgeStyle}>
                        {formatLineupPosition(membership.lineupPosition)}
                      </div>

                      <Link
                        to={`/members/${membership.memberId}`}
                        style={{ textDecoration: "none", minWidth: 0 }}
                      >
                        <ClickableCard>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "1rem",
                              flexWrap: "wrap",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.9rem",
                                minWidth: 0,
                                flex: 1,
                              }}
                            >
                              <MemberAvatar fullName={membership.memberFullName} />

                              <div style={{ minWidth: 0 }}>
                                <div
                                  style={{
                                    fontWeight: 700,
                                    color: colors.text,
                                  }}
                                >
                                  {membership.memberFullName}
                                </div>

                                <div
                                  style={{
                                    color: colors.textMuted,
                                    fontSize: "0.9rem",
                                    marginTop: "2px",
                                  }}
                                >
                                  {formatMembershipRole(membership)}
                                </div>
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                flexWrap: "wrap",
                              }}
                            >
                              <span style={getStatusBadgeStyle(isRegistered)}>
                                {isRegistered ? "Aktiv" : "Nicht registriert"}
                              </span>
                              <span style={profileBadgeStyle}>Profil</span>
                            </div>
                          </div>
                        </ClickableCard>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}