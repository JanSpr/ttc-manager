import { useEffect, useMemo, useState } from "react";
import PageIntro from "../components/layout/PageIntro";
import MatchesListPanel from "../components/management/matches/MatchesListPanel";
import MatchForm from "../components/management/matches/MatchForm";
import Card from "../components/ui/Card";
import { useToast } from "../context/useToast";
import {
  createMatch,
  deleteMatch,
  fetchMatches,
  updateMatch,
} from "../api/matchApi";
import { fetchTeams } from "../api/teamApi";
import type { Match, MatchUpsertRequest } from "../types/match";
import type { Team } from "../types/team";
import { pageContainerStyle } from "../styles/ui";

type EditorMode = "closed" | "create" | "edit";

function sortMatchesByDate(matches: Match[]): Match[] {
  return [...matches].sort(
    (left, right) =>
      new Date(left.matchDateTime).getTime() -
      new Date(right.matchDateTime).getTime()
  );
}

function ManagementMatchesPage() {
  const { showToast } = useToast();

  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>("closed");
  const [searchValue, setSearchValue] = useState("");
  const [hoveredMatchId, setHoveredMatchId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [loadedMatches, loadedTeams] = await Promise.all([
          fetchMatches(),
          fetchTeams(),
        ]);

        if (!isMounted) return;

        setMatches(sortMatchesByDate(loadedMatches));
        setTeams(loadedTeams);
      } catch (error) {
        console.error("Spiele oder Mannschaften konnten nicht geladen werden.", error);

        if (!isMounted) return;

        setLoadError("Die Spiele konnten nicht geladen werden.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredMatches = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLocaleLowerCase("de");

    return sortMatchesByDate(matches).filter((match) => {
      if (!normalizedSearch) return true;

      return (
        match.teamName.toLocaleLowerCase("de").includes(normalizedSearch) ||
        match.opponentName.toLocaleLowerCase("de").includes(normalizedSearch) ||
        (match.competition ?? "")
          .toLocaleLowerCase("de")
          .includes(normalizedSearch) ||
        (match.location ?? "").toLocaleLowerCase("de").includes(normalizedSearch)
      );
    });
  }, [matches, searchValue]);

  const selectedMatch =
    editorMode === "edit"
      ? matches.find((match) => match.id === selectedMatchId) ?? null
      : null;

  const isEditorOpen = editorMode !== "closed";
  const editingMatchId = editorMode === "edit" ? selectedMatchId : null;

  function openCreateMode() {
    setSelectedMatchId(null);
    setEditorMode("create");
  }

  function openEditMode(matchId: number) {
    setSelectedMatchId(matchId);
    setEditorMode("edit");
  }

  function closeEditor() {
    setSelectedMatchId(null);
    setEditorMode("closed");
  }

  async function handleSubmit(request: MatchUpsertRequest) {
    setIsSubmitting(true);

    try {
      if (editorMode === "edit" && selectedMatch) {
        const updatedMatch = await updateMatch(selectedMatch.id, request);

        setMatches((current) =>
          sortMatchesByDate(
            current.map((match) =>
              match.id === updatedMatch.id ? updatedMatch : match
            )
          )
        );

        setSelectedMatchId(updatedMatch.id);
        showToast("Spiel erfolgreich aktualisiert.", "success");
        return;
      }

      const createdMatch = await createMatch(request);

      setMatches((current) => sortMatchesByDate([...current, createdMatch]));
      setSelectedMatchId(createdMatch.id);
      setEditorMode("edit");
      showToast("Spiel erfolgreich angelegt.", "success");
    } catch (error) {
      console.error("Spiel konnte nicht gespeichert werden.", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Spiel konnte nicht gespeichert werden.",
        "error"
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!selectedMatch) return;

    const confirmed = window.confirm(
      `Möchtest du das Spiel "${selectedMatch.teamName} gegen ${selectedMatch.opponentName}" wirklich löschen?`
    );

    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      await deleteMatch(selectedMatch.id);

      setMatches((current) =>
        current.filter((match) => match.id !== selectedMatch.id)
      );
      closeEditor();

      showToast("Spiel erfolgreich gelöscht.", "success");
    } catch (error) {
      console.error("Spiel konnte nicht gelöscht werden.", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Spiel konnte nicht gelöscht werden.",
        "error"
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={pageContainerStyle}>
      <PageIntro
        title="Spielverwaltung"
        description="Lege hier Spieltermine an und pflege Gegner, Liga, Spielort und weitere Hinweise."
        eyebrow="Verwaltung"
        accent
        style={{ padding: "1.1rem 1.3rem" }}
      />

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: isEditorOpen
            ? "minmax(320px, 0.85fr) minmax(0, 1.15fr)"
            : "minmax(560px, 820px)",
          justifyContent: "center",
          alignItems: "start",
          marginTop: "1rem",
        }}
      >
        <MatchesListPanel
          matches={filteredMatches}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onClearSearch={() => setSearchValue("")}
          onCreate={openCreateMode}
          isLoading={isLoading}
          loadError={loadError}
          isEditorOpen={isEditorOpen}
          editingId={editingMatchId}
          hoveredId={hoveredMatchId}
          onHover={setHoveredMatchId}
          onLeave={(matchId) =>
            setHoveredMatchId((current) => (current === matchId ? null : current))
          }
          onOpenEdit={openEditMode}
        />

        {isEditorOpen ? (
          <Card style={{ marginTop: 0 }}>
            <MatchForm
              key={selectedMatch?.id ?? "create"}
              match={selectedMatch}
              teams={teams}
              onSubmit={handleSubmit}
              onCancel={closeEditor}
              onDelete={editorMode === "edit" ? handleDelete : undefined}
              isSubmitting={isSubmitting}
            />
          </Card>
        ) : null}
      </div>
    </div>
  );
}

export default ManagementMatchesPage;