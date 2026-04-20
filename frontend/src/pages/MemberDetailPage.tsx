import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchMemberById } from "../api/memberApi";
import { fetchTeams } from "../api/teamApi";
import type { Member } from "../types/member";
import type { Team } from "../types/team";
import {
  pageContainerStyle,
  contentCardStyle,
  clickableCardStyle,
  applyClickableCardHover,
  resetClickableCardHover,
  sectionTitleStyle,
  subtleLabelStyle,
  badgeStyle,
  colors,
} from "../styles/ui";

type MemberDetailLocationState = {
  fromTeamId?: number;
  fromTeamName?: string;
};

export default function MemberDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigationState = (location.state as MemberDetailLocationState) || {};

  const [member, setMember] = useState<Member | null>(null);
  const [memberTeams, setMemberTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMemberDetail() {
      if (!id) {
        setError("Keine Member-ID in der URL gefunden.");
        setLoading(false);
        return;
      }

      const memberId = Number(id);

      if (Number.isNaN(memberId)) {
        setError("Ungültige Member-ID.");
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

        setMember(memberData);
        setMemberTeams(resolvedTeams);
      } catch (err) {
        console.error("Fehler beim Laden des Members:", err);
        setError("Memberdetails konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    }

    loadMemberDetail();
  }, [id]);

  const backLink = navigationState.fromTeamId
    ? `/teams/${navigationState.fromTeamId}`
    : "/teams";

  const backLabel = navigationState.fromTeamName
    ? `← Zurück zu ${navigationState.fromTeamName}`
    : "← Zurück zur Teamliste";

  return (
    <div style={pageContainerStyle}>
      <div style={{ marginBottom: "1rem" }}>
        <Link to={backLink} style={{ color: colors.primary }}>
          {backLabel}
        </Link>
      </div>

      {loading && <p style={{ marginTop: "1rem" }}>Member wird geladen...</p>}
      {error && <p style={{ marginTop: "1rem", color: colors.danger }}>{error}</p>}

      {!loading && !error && member && (
        <>
          <div style={{ ...contentCardStyle, marginTop: 0 }}>
            <h1 style={sectionTitleStyle}>{member.fullName}</h1>

            <div
              style={{
                display: "grid",
                gap: "0.9rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              <div>
                <div style={subtleLabelStyle}>Vorname</div>
                <div style={{ fontWeight: 700 }}>{member.firstName}</div>
              </div>

              <div>
                <div style={subtleLabelStyle}>Nachname</div>
                <div style={{ fontWeight: 700 }}>{member.lastName}</div>
              </div>

              <div>
                <div style={subtleLabelStyle}>Status</div>
                <div style={{ fontWeight: 700 }}>
                  {member.active ? "Aktiv" : "Inaktiv"}
                </div>
              </div>

              <div>
                <div style={subtleLabelStyle}>Verknüpfter User</div>
                <div style={{ fontWeight: 700 }}>
                  {member.userId
                    ? `User-ID ${member.userId}`
                    : "Kein Login verknüpft"}
                </div>
              </div>
            </div>
          </div>

          <div style={contentCardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1.2rem" }}>
              Zugeordnete Teams
            </h2>

            {memberTeams.length === 0 ? (
              <p style={{ margin: 0, color: colors.textMuted }}>Keine Teams zugeordnet.</p>
            ) : (
              <div
                style={{
                  marginTop: "0.75rem",
                  display: "grid",
                  gap: "0.75rem",
                }}
              >
                {memberTeams.map((team) => (
                  <Link
                    key={team.id}
                    to={`/teams/${team.id}`}
                    style={{
                      ...clickableCardStyle,
                      borderRadius: "16px",
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
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "1rem",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            marginBottom: "0.25rem",
                            color: colors.text,
                          }}
                        >
                          {team.name}
                        </div>

                        <div style={{ color: colors.textMuted, marginBottom: "0.25rem" }}>
                          {team.description || "Keine Beschreibung vorhanden."}
                        </div>
                      </div>

                      <div style={badgeStyle}>{team.memberCount} Mitglieder</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}