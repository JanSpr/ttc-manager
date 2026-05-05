import { useEffect, useMemo, useState } from "react";
import { fetchUpcomingMatches } from "../api/matchApi";
import type { Match } from "../types/match";
import type { User } from "../types/user";
import PageIntro from "../components/layout/PageIntro";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import StatusMessage from "../components/ui/StatusMessage";
import { cardTitleStyle, colors } from "../styles/ui";

type MatchesPageProps = {
  user: User;
};

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatMatchType(match: Match): string {
  return match.homeMatch ? "Heimspiel" : "Auswärtsspiel";
}

function formatStatus(status: Match["status"]): string {
  switch (status) {
    case "PLANNED":
      return "Geplant";
    case "CONFIRMED":
      return "Bestätigt";
    case "COMPLETED":
      return "Abgeschlossen";
    case "CANCELLED":
      return "Abgesagt";
    default:
      return status;
  }
}

function sortByDate(a: Match, b: Match): number {
  return (
    new Date(a.matchDateTime).getTime() - new Date(b.matchDateTime).getTime()
  );
}

function MatchCard({ match }: { match: Match }) {
  return (
    <article
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: "16px",
        padding: "1rem 1.1rem",
        backgroundColor: colors.surface,
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
      }}
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
              color: colors.textMuted,
              fontSize: "0.88rem",
              fontWeight: 700,
              marginBottom: "0.35rem",
            }}
          >
            {formatDateTime(match.matchDateTime)}
          </div>

          <h3
            style={{
              margin: 0,
              color: colors.text,
              fontSize: "1.08rem",
            }}
          >
            {match.teamName} gegen {match.opponentName}
          </h3>
        </div>

        <Badge>{formatStatus(match.status)}</Badge>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.65rem",
          flexWrap: "wrap",
          marginTop: "0.85rem",
          color: colors.textMuted,
          fontSize: "0.95rem",
        }}
      >
        <span>{formatMatchType(match)}</span>
        {match.location ? <span>· {match.location}</span> : null}
      </div>

      {match.notes ? (
        <p
          style={{
            margin: "0.85rem 0 0",
            color: colors.textMuted,
            lineHeight: 1.5,
          }}
        >
          {match.notes}
        </p>
      ) : null}
    </article>
  );
}

function MatchSection({
  title,
  description,
  matches,
}: {
  title: string;
  description?: string;
  matches: Match[];
}) {
  if (matches.length === 0) {
    return null;
  }

  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "flex-start",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={cardTitleStyle}>{title}</h2>

          {description ? (
            <p
              style={{
                margin: 0,
                color: colors.textMuted,
                lineHeight: 1.5,
              }}
            >
              {description}
            </p>
          ) : null}
        </div>

        <Badge>{matches.length}</Badge>
      </div>

      <div style={{ display: "grid", gap: "0.85rem" }}>
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </Card>
  );
}

export default function MatchesPage({ user }: MatchesPageProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ownTeamIds = useMemo(() => new Set(user.teamIds ?? []), [user.teamIds]);

  const ownTeamMatches = useMemo(() => {
    if (ownTeamIds.size === 0) return [];

    return matches
      .filter((match) => ownTeamIds.has(match.teamId))
      .slice()
      .sort(sortByDate);
  }, [matches, ownTeamIds]);

  const otherMatches = useMemo(() => {
    if (ownTeamIds.size === 0) {
      return matches.slice().sort(sortByDate);
    }

    return matches
      .filter((match) => !ownTeamIds.has(match.teamId))
      .slice()
      .sort(sortByDate);
  }, [matches, ownTeamIds]);

  useEffect(() => {
    let isMounted = true;

    fetchUpcomingMatches()
      .then((upcomingMatches) => {
        if (!isMounted) return;

        setMatches(upcomingMatches);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;

        console.error("Fehler beim Laden der Spieltermine:", err);
        setError("Spieltermine konnten nicht geladen werden.");
      })
      .finally(() => {
        if (!isMounted) return;

        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <PageIntro
        eyebrow="Termine"
        title="Anstehende Spieltermine"
        description="Hier findest du die nächsten Mannschaftsspiele. Allgemeine Vereins- und Gruppentermine können später ergänzt werden."
        accent
      />

      {error ? <StatusMessage variant="error">{error}</StatusMessage> : null}

      {isLoading ? (
        <StatusMessage variant="muted">
          Spieltermine werden geladen...
        </StatusMessage>
      ) : null}

      {!isLoading && !error && matches.length === 0 ? (
        <StatusMessage variant="muted">
          Aktuell sind keine anstehenden Spieltermine eingetragen.
        </StatusMessage>
      ) : null}

      <MatchSection
        title="Deine nächsten Spiele"
        description="Spiele deiner zugeordneten Mannschaften."
        matches={ownTeamMatches}
      />

      <MatchSection
        title="Weitere anstehende Spiele"
        description="Alle weiteren geplanten und bestätigten Mannschaftsspiele."
        matches={otherMatches}
      />
    </>
  );
}