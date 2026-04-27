import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTeams } from "../api/teamApi";
import type { Team } from "../types/team";
import PageIntro from "../components/layout/PageIntro";
import Badge from "../components/ui/Badge";
import ClickableCard from "../components/ui/ClickableCard";
import StatusMessage from "../components/ui/StatusMessage";
import TeamAvatar from "../components/ui/TeamAvatar";
import { colors } from "../styles/ui";

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

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div>
        <Badge
          style={{
            fontSize: "0.9rem",
            padding: "0.35rem 0.75rem",
          }}
        >
          {label}
        </Badge>
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
            style={{ textDecoration: "none" }}
          >
            <ClickableCard>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.9rem",
                }}
              >
                <TeamAvatar teamName={team.name} />

                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: "grid",
                    gap: "0.3rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.05rem",
                        color: colors.text,
                      }}
                    >
                      {team.name}
                    </h3>

                    <Badge
                      size="sm"
                      style={{
                        opacity: 0.8,
                        fontWeight: 500,
                      }}
                    >
                      {team.memberCount} Mitglieder
                    </Badge>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      color: colors.textMuted,
                      fontSize: "0.85rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {team.description || "Keine Beschreibung vorhanden."}
                  </p>
                </div>
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams()
      .then(setTeams)
      .catch((err) => {
        console.error("Fehler beim Laden der Mannschaften:", err);
        setError("Mannschaften konnten nicht geladen werden.");
      });
  }, []);

  const adultTeams = useMemo(
    () =>
      teams
        .filter((team) => team.type === "ADULT")
        .slice()
        .sort(sortTeamsByName),
    [teams],
  );

  const youthTeams = useMemo(
    () =>
      teams
        .filter((team) => team.type === "YOUTH")
        .slice()
        .sort(sortTeamsByName),
    [teams],
  );

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <PageIntro
        eyebrow="Mannschaften"
        title="Mannschaften"
        description="Hier findest du alle aktuell erfassten Erwachsenen- und Jugendmannschaften im Überblick."
        accent
      />

      {error && <StatusMessage variant="error">{error}</StatusMessage>}

      <TeamSection teams={adultTeams} type="ADULT" />
      <TeamSection teams={youthTeams} type="YOUTH" />
    </div>
  );
}