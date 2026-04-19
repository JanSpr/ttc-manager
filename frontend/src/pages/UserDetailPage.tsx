import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchUserById } from "../api/userApi";
import type { User } from "../types/user";

type UserDetailLocationState = {
  fromTeamId?: number;
  fromTeamName?: string;
};

export default function UserDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigationState = (location.state as UserDetailLocationState) || {};

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
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

        const userData = await fetchUserById(userId);
        setUser(userData);
      } catch (err) {
        console.error("Fehler beim Laden des Benutzers:", err);
        setError("Benutzerdetails konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [id]);

  const backLink = navigationState.fromTeamId
    ? `/teams/${navigationState.fromTeamId}`
    : "/teams";

  const backLabel = navigationState.fromTeamName
    ? `← Zurück zu ${navigationState.fromTeamName}`
    : "← Zurück zur Teamliste";

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Link to={backLink}>{backLabel}</Link>

      {loading && <p style={{ marginTop: "1rem" }}>Benutzer wird geladen...</p>}

      {error && <p style={{ marginTop: "1rem", color: "red" }}>{error}</p>}

      {!loading && !error && user && (
        <div
          style={{
            marginTop: "1.5rem",
            border: "1px solid #d0d7de",
            borderRadius: "10px",
            padding: "1.25rem",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
            backgroundColor: "#ffffff",
          }}
        >
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
              <strong>Team-IDs:</strong>{" "}
              {user.teamIds.length > 0 ? user.teamIds.join(", ") : "Keine"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}