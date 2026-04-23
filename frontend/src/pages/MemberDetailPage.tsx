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
import {
  badgeStyle,
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

function getAccountBadgeStyle(isRegistered: boolean) {
  return {
    ...badgeStyle,
    fontSize: "0.75rem",
    padding: "0.22rem 0.55rem",
    fontWeight: 700,
    backgroundColor: isRegistered ? colors.primarySoft : colors.surface,
    color: isRegistered ? colors.primary : "#60a5fa",
    border: `1px solid ${isRegistered ? colors.primarySoft : "#93c5fd"}`,
  };
}

function getActivityBadgeStyle(isActive: boolean) {
  return {
    ...badgeStyle,
    fontSize: "0.75rem",
    padding: "0.22rem 0.55rem",
    fontWeight: 700,
    backgroundColor: isActive ? colors.primarySoft : colors.surfaceSoft,
    color: isActive ? colors.primary : colors.textMuted,
    border: `1px solid ${isActive ? colors.primarySoft : colors.border}`,
  };
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
  const isRegistered = member.userId != null;
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
        <span style={getAccountBadgeStyle(isRegistered)}>
          {isRegistered ? "Account aktiv" : "Kein Account"}
        </span>

        <span style={getActivityBadgeStyle(member.active)}>
          {member.active ? "Aktives Mitglied" : "Inaktives Mitglied"}
        </span>

        {globalRoleLabels.map((label) => (
          <span key={label} style={badgeStyle}>
            {label}
          </span>
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
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <Link to={backTarget} style={{ color: colors.primary }}>
          {backLabel}
        </Link>
      </div>

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
              </div>
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
              <div
                style={{
                  display: "grid",
                  gap: "0.85rem",
                }}
              >
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

                          <div style={badgeStyle}>
                            {team.memberCount === 1
                              ? "1 Mitglied"
                              : `${team.memberCount} Mitglieder`}
                          </div>
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