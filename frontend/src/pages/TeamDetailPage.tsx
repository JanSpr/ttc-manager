import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchTeamById } from "../api/teamApi";
import type { Team } from "../types/team";

export default function TeamDetailPage() {
  const { id } = useParams();

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTeam() {
      if (!id) {
        setError("Keine Team-ID in der URL gefunden.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await fetchTeamById(Number(id));
        setTeam(data);
      } catch (err) {
        console.error("Fehler beim Laden des Teams:", err);
        setError("Team konnte nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    }

    loadTeam();
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

      {error && (
        <p style={{ marginTop: "1rem", color: "red" }}>{error}</p>
      )}

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
            Mitglieder: {team.memberCount}
          </p>
        </div>
      )}
    </div>
  );
}