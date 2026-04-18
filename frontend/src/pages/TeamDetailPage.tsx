import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchTeamById } from "../api/teamApi";
import { fetchUsers } from "../api/userApi";
import type { Team } from "../types/team";
import type { User } from "../types/user";

export default function TeamDetailPage() {
  const { id } = useParams();

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<User[]>([]);
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

        const [teamData, usersData] = await Promise.all([
          fetchTeamById(teamId),
          fetchUsers(),
        ]);

        const filteredMembers = usersData.filter((user) =>
          user.teamIds.includes(teamId)
        );

        setTeam(teamData);
        setMembers(filteredMembers);
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
    <div
      style={{
        padding: "2rem",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Link to="/teams">← Zurück zur Teamliste</Link>

      {loading && <p style={{ marginTop: "1rem" }}>Team wird geladen...</p>}

      {error && <p style={{ marginTop: "1rem", color: "red" }}>{error}</p>}

      {!loading && !error && team && (
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
            {team.name}
          </h1>

          <p style={{ margin: 0, color: "#555", lineHeight: 1.5 }}>
            {team.description || "Keine Beschreibung vorhanden."}
          </p>

          <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
            Mitglieder: {members.length}
          </p>

          <div style={{ marginTop: "1.5rem" }}>
            <h2 style={{ marginBottom: "0.75rem", fontSize: "1.2rem" }}>
              Teammitglieder
            </h2>

            {members.length === 0 ? (
              <p style={{ color: "#666" }}>
                Diesem Team sind aktuell keine Mitglieder zugeordnet.
              </p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {members.map((member) => (
                  <li
                    key={member.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "0.9rem 1rem",
                      marginBottom: "0.75rem",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                      {member.fullName}
                    </div>

                    <div style={{ color: "#555", marginBottom: "0.25rem" }}>
                      {member.email}
                    </div>

                    <div style={{ fontSize: "0.95rem", color: "#666" }}>
                      Rolle: {member.role} · Status:{" "}
                      {member.active ? "Aktiv" : "Inaktiv"}
                    </div>
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