import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTeams } from "../api/teamApi";
import type { Team } from "../types/team";
import PageIntro from "../components/layout/PageIntro";
import ClickableCard from "../components/ui/ClickableCard";
import StatusMessage from "../components/ui/StatusMessage";
import { badgeStyle, colors } from "../styles/ui";

function sortTeamsByName(a: Team, b: Team): number {
  return a.name.localeCompare(b.name, "de", {
    numeric: true,
    sensitivity: "base",
  });
}

function TeamSection({
  teams,
  type,
}: {
  teams: Team[];
  type: "ADULT" | "YOUTH";
}) {
  const label = type === "YOUTH" ? "Jugend" : "Erwachsene";

  const sectionBadgeStyle = {
    ...badgeStyle,
    fontSize: "0.9rem",
    padding: "0.35rem 0.75rem",
  };

  const memberBadgeStyle = {
    ...badgeStyle,
    fontSize: "0.75rem",
    padding: "0.2rem 0.5rem",
    opacity: 0.85,
  };

  if (teams.length === 0) {
    return (
      <section style={{ display: "grid", gap: "0.85rem" }}>
        <div>
          <span style={sectionBadgeStyle}>{label}</span>
        </div>

        <div
          style={{
            border: `1px solid ${colors.border}`,
            borderRadius: "18px",
            backgroundColor: colors.surface,
            padding: "1.1rem 1.2rem",
            color: colors.textMuted,
          }}
        >
          Keine Mannschaften vorhanden.
        </div>
      </section>
    );
  }

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div>
        <span style={sectionBadgeStyle}>{label}</span>
      </div>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {teams.map((team) => (
          <Link
            key={team.id}
            to={`/teams/${team.id}`}
            aria-label={`Mannschaft ${team.name} öffnen`}
            style={{ textDecoration: "none" }}
          >
            <ClickableCard>
              <div
                style={{
                  display: "grid",
                  gap: "0.9rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1.1rem",
                      color: colors.text,
                    }}
                  >
                    {team.name}
                  </h3>

                  <span style={memberBadgeStyle}>
                    {team.memberCount} Mitglieder
                  </span>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: colors.textMuted,
                    lineHeight: 1.5,
                  }}
                >
                  {team.description || "Keine Beschreibung vorhanden."}
                </p>
              </div>
            </ClickableCard>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTeams() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTeams();
        setTeams(data);
      } catch (err) {
        console.error("Fehler beim Laden der Mannschaften:", err);
        setError("Mannschaften konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    }

    void loadTeams();
  }, []);

  const adultTeams = useMemo(
    () =>
      teams
        .filter((team) => team.type === "ADULT")
        .slice()
        .sort(sortTeamsByName),
    [teams]
  );

  const youthTeams = useMemo(
    () =>
      teams
        .filter((team) => team.type === "YOUTH")
        .slice()
        .sort(sortTeamsByName),
    [teams]
  );

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
      <PageIntro
        eyebrow="Mannschaften"
        title="Alle Mannschaften im Überblick"
        description="Hier findest du alle aktuell erfassten Erwachsenen- und Jugendmannschaften."
      />

      {loading && (
        <StatusMessage variant="info">
          Mannschaften werden geladen...
        </StatusMessage>
      )}

      {error && <StatusMessage variant="error">{error}</StatusMessage>}

      {!loading && !error && teams.length === 0 && (
        <StatusMessage variant="info">
          Es wurden noch keine Mannschaften gefunden.
        </StatusMessage>
      )}

      {!loading && !error && teams.length > 0 && (
        <>
          <TeamSection teams={adultTeams} type="ADULT" />
          <TeamSection teams={youthTeams} type="YOUTH" />
        </>
      )}
    </div>
  );
}