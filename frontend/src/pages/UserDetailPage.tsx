import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchUserById } from "../api/userApi";
import { fetchTeams } from "../api/teamApi";
import type { User } from "../types/user";
import type { Team } from "../types/team";
import {
  pageContainerStyle,
  contentCardStyle,
  clickableCardStyle,
  applyClickableCardHover,
  resetClickableCardHover,
} from "../styles/ui";

type UserDetailLocationState = {
  fromTeamId?: number;
  fromTeamName?: string;
};

export default function UserDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigationState = (location.state as UserDetailLocationState) || {};

  const [user, setUser] = useState<User | null>(null);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserDetail() {
      if (!id) {
        setError("Keine Benutzer-ID in der URL gefunden.");
        setLoading(false);
        return;
      }

      const userId = Number(id);

      if (Number.isNaN(userId)) {
        setError("Ungültige Benutzer-ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [userData, teamsData] = await Promise.all([
          fetchUserById(userId),
          fetchTeams(),
        ]);

        const resolvedTeams = teamsData.filter((team) =>
          userData.teamIds.includes(team.id),
        );

        setUser(userData);
        setUserTeams(resolvedTeams);
      } catch (err) {
        console.error("Fehler beim Laden des Benutzers:", err);
        setError("Benutzerdetails konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    }

    loadUserDetail();
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

      {loading && <p style={{ marginTop: "1rem" }}>Benutzer wird geladen...</p>}

      {error && <p style={{ marginTop: "1rem", color: "red" }}>{error}</p>}

      {!loading && !error && user && (
        <div style={contentCardStyle}>
          <h1 style={{ marginTop: 0, marginBottom: "0.75rem" }}>
            {user.fullName}
          </h1>

          <div style={{ display: "grid", gap: "0.75rem" }}>
            <div>
              <strong>Vorname:</strong> {user.firstName}
            </div>

            <div>
              <strong>Nachname:</strong> {user.lastName}
            </div>

            <div>
              <strong>E-Mail:</strong> {user.email}
            </div>

            <div>
              <strong>Rolle:</strong> {user.role}
            </div>

            <div>
              <strong>Status:</strong> {user.active ? "Aktiv" : "Inaktiv"}
            </div>

            <div>
              <strong>Teams:</strong>
              {userTeams.length === 0 ? (
                <span> Keine</span>
              ) : (
                <div
                  style={{
                    marginTop: "0.75rem",
                    display: "grid",
                    gap: "0.75rem",
                  }}
                >
                  {userTeams.map((team) => (
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
                        Mitglieder: {team.memberCount}
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
