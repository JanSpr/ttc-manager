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
      <Link to={backLink}>{backLabel}</Link>

      {loading && <p style={{ marginTop: "1rem" }}>Member wird geladen...</p>}
      {error && <p style={{ marginTop: "1rem", color: "red" }}>{error}</p>}

      {!loading && !error && member && (
        <div style={contentCardStyle}>
          <h1 style={{ marginTop: 0, marginBottom: "0.75rem" }}>
            {member.fullName}
          </h1>

          <div style={{ display: "grid", gap: "0.75rem" }}>
            <div>
              <strong>Vorname:</strong> {member.firstName}
            </div>

            <div>
              <strong>Nachname:</strong> {member.lastName}
            </div>

            <div>
              <strong>Status:</strong> {member.active ? "Aktiv" : "Inaktiv"}
            </div>

            <div>
              <strong>Verknüpfter User:</strong>{" "}
              {member.userId
                ? `User-ID ${member.userId}`
                : "Kein Login verknüpft"}
            </div>

            <div>
              <strong>Teams:</strong>
              {memberTeams.length === 0 ? (
                <span> Keine</span>
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
                      style={clickableCardStyle}
                      onMouseEnter={(e) =>
                        applyClickableCardHover(e.currentTarget)
                      }
                      onMouseLeave={(e) =>
                        resetClickableCardHover(e.currentTarget)
                      }
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {team.name}
                      </div>

                      <div style={{ color: "#555", marginBottom: "0.25rem" }}>
                        {team.description || "Keine Beschreibung vorhanden."}
                      </div>

                      <div style={{ fontSize: "0.95rem", color: "#666" }}>
                        Zugeordnete Mitglieder: {team.memberCount}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
