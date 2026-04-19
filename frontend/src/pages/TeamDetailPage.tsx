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
      <Link to="/teams">← Zurück zur Teamliste</Link>

      {loading && <p style={{ marginTop: "1rem" }}>Team wird geladen...</p>}
      {error && <p style={{ marginTop: "1rem", color: "red" }}>{error}</p>}

      {!loading && !error && team && (
        <div style={contentCardStyle}>
          <h1 style={{ marginTop: 0, marginBottom: "0.75rem" }}>{team.name}</h1>

          <p style={{ margin: 0, color: "#555", lineHeight: 1.5 }}>
            {team.description || "Keine Beschreibung vorhanden."}
          </p>

          <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
            Zugeordnete Mitglieder: {team.memberCount}
          </p>

          <div style={{ marginTop: "1.5rem" }}>
            <h2 style={{ marginBottom: "0.75rem", fontSize: "1.2rem" }}>
              Teammitglieder
            </h2>

            {team.memberships.length === 0 ? (
              <p style={{ color: "#666" }}>
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
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
