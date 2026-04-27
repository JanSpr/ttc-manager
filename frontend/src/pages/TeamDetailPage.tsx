import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchTeamById } from "../api/teamApi";
import type { Team, TeamMembershipSummary } from "../types/team";
import PageIntro from "../components/layout/PageIntro";
import MemberAvatar from "../components/MemberAvatar";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import ClickableCard from "../components/ui/ClickableCard";
import StatusMessage from "../components/ui/StatusMessage";
import TeamAvatar from "../components/ui/TeamAvatar";
import { cardTitleStyle, colors } from "../styles/ui";

type LocationState = {
  fromManagementTeams?: boolean;
};

function formatMembershipRole(membership: TeamMembershipSummary): string {
  const labels: string[] = [];

  if (membership.captain) labels.push("Mannschaftsführer");
  if (membership.viceCaptain) labels.push("Stellvertretung");
  if (membership.player) labels.push("Spieler");

  return labels.length > 0 ? labels.join(" · ") : "Keine Teamfunktion";
}

function formatLineupPosition(position: number | null | undefined): string {
  return position == null ? "–" : String(position);
}

const lineupBadgeStyle = {
  minWidth: "38px",
  height: "38px",
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
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? null;

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

  const captain = team?.memberships.find((membership) => membership.captain);
  const playerMemberships =
    team?.memberships.filter((membership) => membership.player) ?? [];

  const backTarget = state?.fromManagementTeams ? "/management/teams" : "/teams";
  const backLabel = state?.fromManagementTeams
    ? "← Zurück zur Mannschaftsverwaltung"
    : "← Zurück zur Mannschaftsübersicht";

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
        to={backTarget}
        style={{
          color: colors.primary,
          textDecoration: "none",
          fontWeight: 600,
          width: "fit-content",
        }}
      >
        {backLabel}
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
            eyebrow="Mannschaft"
            style={{
              position: "relative",
              paddingLeft: "6.75rem",
              paddingRight: captain ? "20rem" : "1.75rem",
              minHeight: captain ? "150px" : "112px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          />

          <div
            style={{
              position: "relative",
              marginTop: "-10.9rem",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "1.75rem",
                top: "2.35rem",
                pointerEvents: "auto",
              }}
            >
              <TeamAvatar
                teamName={team.name}
                size={68}
                borderColor={colors.border}
                fontSize="1.1rem"
                fontWeight={700}
                boxShadow="0 8px 20px rgba(15, 23, 42, 0.06)"
              />
            </div>

            {captain ? (
              <div
                style={{
                  position: "absolute",
                  right: "1.75rem",
                  bottom: "2.55rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  pointerEvents: "auto",
                }}
              >
                <div
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: colors.textMuted,
                    whiteSpace: "nowrap",
                  }}
                >
                  Mannschaftsführer:
                </div>

                <Link
                  to={`/members/${captain.memberId}`}
                  state={{
                    fromTeamId: team.id,
                    fromTeamName: team.name,
                  }}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <ClickableCard style={{ padding: "0.38rem 0.58rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <MemberAvatar
                        fullName={captain.memberFullName}
                        isRegistered={captain.accountActivated}
                        size={30}
                        fontSize="0.78rem"
                        boxShadow="0 6px 16px rgba(15, 23, 42, 0.05)"
                      />

                      <div
                        style={{
                          fontSize: "0.92rem",
                          fontWeight: 700,
                          color: colors.text,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {captain.memberFullName}
                      </div>
                    </div>
                  </ClickableCard>
                </Link>
              </div>
            ) : null}
          </div>

          <Card>
            <h2 style={cardTitleStyle}>Mannschaftsmitglieder</h2>

            {playerMemberships.length === 0 ? (
              <div style={{ color: colors.textMuted }}>
                Dieser Mannschaft sind aktuell keine Spieler zugeordnet.
              </div>
            ) : (
              <div style={{ display: "grid", gap: "0.9rem" }}>
                {playerMemberships.map((membership) => {
                  const hasActiveAccount = membership.accountActivated;

                  return (
                    <div
                      key={membership.memberId}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "38px minmax(0, 1fr)",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <div style={lineupBadgeStyle}>
                        {formatLineupPosition(membership.lineupPosition)}
                      </div>

                      <Link
                        to={`/members/${membership.memberId}`}
                        state={{
                          fromTeamId: team.id,
                          fromTeamName: team.name,
                        }}
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
                              <MemberAvatar
                                fullName={membership.memberFullName}
                                isRegistered={hasActiveAccount}
                                size={46}
                                fontSize="0.95rem"
                                boxShadow="0 6px 16px rgba(15, 23, 42, 0.05)"
                              />

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
                              <Badge
                                variant={
                                  hasActiveAccount ? "primary" : "neutral"
                                }
                                size="sm"
                              >
                                {hasActiveAccount
                                  ? "Account aktiv"
                                  : "Kein Account"}
                              </Badge>

                              <Badge size="md">Profil</Badge>
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