import { useEffect, useState } from "react";

import { Link, useLocation, useParams } from "react-router-dom";

import { fetchMemberById } from "../api/memberApi";
import { fetchTeams } from "../api/teamApi";
import { fetchUserById } from "../api/userApi";

import type { Member } from "../types/member";
import type { Team, TeamMembershipSummary } from "../types/team";
import type { User } from "../types/user";

import MemberAvatar from "../components/MemberAvatar";
import TeamAvatar from "../components/ui/TeamAvatar";
import Card from "../components/ui/Card";
import DataField from "../components/ui/DataField";
import ClickableCard from "../components/ui/ClickableCard";
import StatusMessage from "../components/ui/StatusMessage";
import Badge from "../components/ui/Badge";

import {
  cardTitleStyle,
  colors,
  contentCardStyle,
  sectionDescriptionStyle,
  sectionTitleStyle,
} from "../styles/ui";

type LocationState = {
  fromTeamId?: number;
  fromTeamName?: string;
  fromManagement?: boolean;
};

function ClipboardIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 5H7.8C6.7 5 6 5.7 6 6.8V19.2C6 20.3 6.7 21 7.8 21H16.2C17.3 21 18 20.3 18 19.2V6.8C18 5.7 17.3 5 16.2 5H15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 5.5C9 4.7 9.7 4 10.5 4H13.5C14.3 4 15 4.7 15 5.5C15 6.3 14.3 7 13.5 7H10.5C9.7 7 9 6.3 9 5.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getGlobalRoleLabels(user: User | null): string[] {
  if (!user) {
    return [];
  }

  const labels: string[] = [];

  if (user.roles.includes("ADMIN")) {
    labels.push("Admin");
  }

  if (user.roles.includes("BOARD")) {
    labels.push("Vorstand");
  }

  return labels.length > 0 ? labels : ["Spieler"];
}

function getAccountStatusLabel(member: Member): string {
  return member.accountActivated ? "registriert" : "nicht registriert";
}

function getMembershipRoleLabel(
  membership: TeamMembershipSummary | undefined,
): string {
  if (!membership) {
    return "Keine Rolle hinterlegt";
  }

  const roles: string[] = [];

  if (membership.captain) {
    roles.push("Mannschaftsführer");
  }

  if (membership.viceCaptain) {
    roles.push("Stellvertretung");
  }

  if (membership.player) {
    roles.push("Spieler");
  }

  return roles.length > 0 ? roles.join(" · ") : "Keine Teamfunktion";
}

function getLineupLabel(membership: TeamMembershipSummary | undefined): string {
  if (!membership || membership.lineupPosition == null) {
    return "Keine Aufstellungsposition";
  }

  return `Position ${membership.lineupPosition}`;
}

function MemberHeader({
  member,
  user,
}: {
  member: Member;
  user: User | null;
}) {
  const hasActiveAccount = member.accountActivated;
  const accountStatusLabel = getAccountStatusLabel(member);
  const globalRoleLabels = getGlobalRoleLabels(user);

  return (
    <section
      style={{
        ...contentCardStyle,
        marginTop: 0,
        padding: "1.75rem",
        display: "flex",
        alignItems: "center",
        gap: "1.25rem",
        flexWrap: "wrap",
      }}
    >
      <MemberAvatar
        member={member}
        size={82}
        fontSize="1.25rem"
        boxShadow="0 10px 24px rgba(15, 23, 42, 0.07)"
      />

      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            marginBottom: "0.45rem",
            fontSize: "0.82rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: colors.primary,
          }}
        >
          Mitglied
        </div>

        <h1 style={sectionTitleStyle}>{member.fullName}</h1>

        <p style={sectionDescriptionStyle}>
          Detailansicht eines Vereinsmitglieds.
        </p>
      </div>

      <div
        style={{
          alignSelf: "flex-start",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "0.45rem",
          flexWrap: "wrap",
        }}
      >
        <Badge variant={hasActiveAccount ? "primary" : "neutral"} size="sm">
          {accountStatusLabel}
        </Badge>

        <Badge variant={member.active ? "primary" : "neutral"} size="sm">
          {member.active ? "Aktives Mitglied" : "Inaktives Mitglied"}
        </Badge>

        {globalRoleLabels.map((label) => (
          <Badge key={label} size="md">
            {label}
          </Badge>
        ))}
      </div>
    </section>
  );
}

export default function MemberDetailPage() {
  const { id } = useParams();
  const location = useLocation();

  const state = (location.state as LocationState | null) ?? null;

  const [member, setMember] = useState<Member | null>(null);
  const [linkedUser, setLinkedUser] = useState<User | null>(null);
  const [memberTeams, setMemberTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [isCopyHovered, setIsCopyHovered] = useState(false);

  useEffect(() => {
    async function loadMember() {
      if (!id) {
        setError("Keine Mitglieder-ID in der URL gefunden.");
        setLoading(false);
        return;
      }

      const memberId = Number(id);

      if (Number.isNaN(memberId)) {
        setError("Ungültige Mitglieder-ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setCopyMessage(null);

        const [memberData, teamsData] = await Promise.all([
          fetchMemberById(memberId),
          fetchTeams(),
        ]);

        const resolvedTeams = teamsData.filter((team) =>
          memberData.teamIds.includes(team.id),
        );

        const resolvedUser = memberData.userId
          ? await fetchUserById(memberData.userId)
          : null;

        setMember(memberData);
        setLinkedUser(resolvedUser);
        setMemberTeams(resolvedTeams);
      } catch (err) {
        console.error("Fehler beim Laden des Mitglieds:", err);
        setError("Mitglied konnte nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    }

    void loadMember();
  }, [id]);

  useEffect(() => {
    if (!copyMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopyMessage(null);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [copyMessage]);

  async function copyActivationCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopyMessage("Aktivierungscode wurde kopiert.");
    } catch (err) {
      console.error("Aktivierungscode konnte nicht kopiert werden:", err);
      setCopyMessage("Aktivierungscode konnte nicht kopiert werden.");
    }
  }

  let backTarget = "/teams";
  let backLabel = "← Zurück zur Mannschaftsübersicht";

  if (state?.fromManagement) {
    backTarget = "/management/members";
    backLabel = "← Zurück zur Mitgliederverwaltung";
  } else if (state?.fromTeamId) {
    backTarget = `/teams/${state.fromTeamId}`;
    backLabel = state.fromTeamName
      ? `← Zurück zu ${state.fromTeamName}`
      : "← Zurück zur Mannschaft";
  }

  const memberTypeLabel =
    member?.type === "ADULT" ? "Erwachsene" : "Jugendliche";

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

      {loading && <StatusMessage>Mitglied wird geladen...</StatusMessage>}

      {error && <StatusMessage variant="error">{error}</StatusMessage>}

      {!loading && !error && member && (
        <>
          <MemberHeader member={member} user={linkedUser} />

          <Card>
            <h2 style={cardTitleStyle}>Grunddaten</h2>

            <div
              style={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              }}
            >
              <DataField label="Vorname" value={member.firstName || "-"} />
              <DataField label="Nachname" value={member.lastName || "-"} />
              <DataField label="Kategorie" value={memberTypeLabel} />
            </div>
          </Card>

          <Card>
            <h2 style={cardTitleStyle}>Verknüpftes Benutzerkonto</h2>

            {linkedUser ? (
              <>
                <div
                  style={{
                    display: "grid",
                    gap: "1rem",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  }}
                >
                  <DataField label="Benutzername" value={linkedUser.username} />
                  <DataField label="E-Mail" value={linkedUser.email} />

                  <DataField
                    label="Globale Rolle"
                    value={getGlobalRoleLabels(linkedUser).join(", ")}
                  />

                  {linkedUser.activationCode && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.45rem",
                      }}
                    >
                      <DataField
                        label="Aktivierungscode"
                        value={linkedUser.activationCode}
                      />

                      <button
                        type="button"
                        title="Code kopieren"
                        aria-label="Aktivierungscode kopieren"
                        onClick={() =>
                          void copyActivationCode(linkedUser.activationCode!)
                        }
                        onMouseEnter={() => setIsCopyHovered(true)}
                        onMouseLeave={() => setIsCopyHovered(false)}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          border: `1px solid ${
                            isCopyHovered ? colors.borderStrong : colors.border
                          }`,
                          backgroundColor: isCopyHovered
                            ? colors.surfaceSoft
                            : colors.surface,
                          color: isCopyHovered
                            ? colors.primary
                            : colors.textMuted,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition:
                            "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease",
                          flexShrink: 0,
                        }}
                      >
                        <ClipboardIcon />
                      </button>
                    </div>
                  )}
                </div>

                {copyMessage && (
                  <StatusMessage variant="muted" marginTop="1rem">
                    {copyMessage}
                  </StatusMessage>
                )}
              </>
            ) : (
              <StatusMessage variant="muted" marginTop="0">
                Diesem Mitglied ist aktuell kein Benutzerkonto zugeordnet.
              </StatusMessage>
            )}
          </Card>

          <Card>
            <h2 style={cardTitleStyle}>Mannschaften</h2>

            {memberTeams.length === 0 ? (
              <StatusMessage variant="muted" marginTop="0">
                Dieses Mitglied ist aktuell keiner Mannschaft zugeordnet.
              </StatusMessage>
            ) : (
              <div style={{ display: "grid", gap: "0.85rem" }}>
                {memberTeams.map((team) => {
                  const membership = team.memberships.find(
                    (teamMembership) => teamMembership.memberId === member.id,
                  );

                  return (
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
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.85rem",
                              minWidth: 0,
                              flex: 1,
                            }}
                          >
                            <TeamAvatar
                              teamName={team.name}
                              size={44}
                              boxShadow="0 6px 16px rgba(15, 23, 42, 0.05)"
                            />

                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  fontWeight: 700,
                                  color: colors.text,
                                  marginBottom: "0.25rem",
                                }}
                              >
                                {team.name}
                              </div>

                              <div
                                style={{
                                  color: colors.textMuted,
                                  fontSize: "0.9rem",
                                  lineHeight: 1.45,
                                }}
                              >
                                {getMembershipRoleLabel(membership)}
                                {" · "}
                                {getLineupLabel(membership)}
                              </div>
                            </div>
                          </div>

                          <Badge>
                            {team.memberCount === 1
                              ? "1 Mitglied"
                              : `${team.memberCount} Mitglieder`}
                          </Badge>
                        </div>
                      </ClickableCard>
                    </Link>
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