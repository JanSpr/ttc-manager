import { useEffect, useMemo, useState } from "react";
import PageIntro from "../components/layout/PageIntro";
import TeamsListPanel from "../components/management/TeamsListPanel";
import TeamsEditorPanel from "../components/management/TeamsEditorPanel";
import { useToast } from "../context/useToast";
import {
  createTeam,
  deleteTeam,
  fetchTeams,
  updateTeam,
} from "../api/teamApi";
import type { Team, TeamUpsertRequest } from "../types/team";
import { pageContainerStyle } from "../styles/ui";

type EditorMode = "closed" | "create" | "edit";

function ManagementTeamsPage() {
  const { showToast } = useToast();

  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>("closed");
  const [searchValue, setSearchValue] = useState("");
  const [hoveredTeamId, setHoveredTeamId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadInitialTeams() {
      try {
        const loadedTeams = await fetchTeams();

        if (!isMounted) {
          return;
        }

        setTeams(loadedTeams);
      } catch (error) {
        console.error("Mannschaften konnten nicht geladen werden.", error);

        if (!isMounted) {
          return;
        }

        setLoadError("Die Mannschaften konnten nicht geladen werden.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialTeams();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTeams = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLocaleLowerCase("de");

    return [...teams]
      .sort((left, right) => {
        if (left.type !== right.type) {
          return left.type === "ADULT" ? -1 : 1;
        }

        return left.name.localeCompare(right.name, "de", {
          sensitivity: "base",
        });
      })
      .filter((team) => {
        if (!normalizedSearch) {
          return true;
        }

        return (
          team.name.toLocaleLowerCase("de").includes(normalizedSearch) ||
          (team.description ?? "")
            .toLocaleLowerCase("de")
            .includes(normalizedSearch) ||
          String(team.id).includes(normalizedSearch)
        );
      });
  }, [teams, searchValue]);

  const selectedTeam =
    editorMode === "edit"
      ? teams.find((team) => team.id === selectedTeamId) ?? null
      : null;

  const isEditorOpen = editorMode !== "closed";
  const editingTeamId = editorMode === "edit" ? selectedTeamId : null;

  function openCreateMode() {
    setSelectedTeamId(null);
    setEditorMode("create");
  }

  function openEditMode(teamId: number) {
    setSelectedTeamId(teamId);
    setEditorMode("edit");
  }

  function closeEditor() {
    setSelectedTeamId(null);
    setEditorMode("closed");
  }

  async function handleSubmit(request: TeamUpsertRequest) {
    setIsSubmitting(true);

    try {
      if (editorMode === "edit" && selectedTeam) {
        const updatedTeam = await updateTeam(selectedTeam.id, request);

        setTeams((current) =>
          current.map((team) => (team.id === updatedTeam.id ? updatedTeam : team))
        );

        setSelectedTeamId(updatedTeam.id);
        showToast("Mannschaft erfolgreich aktualisiert.", "success");
        return;
      }

      const createdTeam = await createTeam(request);

      setTeams((current) => [...current, createdTeam]);
      setSelectedTeamId(createdTeam.id);
      setEditorMode("edit");
      showToast("Mannschaft erfolgreich angelegt.", "success");
    } catch (error) {
      console.error("Mannschaft konnte nicht gespeichert werden.", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Mannschaft konnte nicht gespeichert werden.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!selectedTeam) {
      return;
    }

    const confirmed = window.confirm(
      `Möchtest du die Mannschaft "${selectedTeam.name}" wirklich löschen?`
    );

    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);

    try {
      await deleteTeam(selectedTeam.id);

      setTeams((current) =>
        current.filter((team) => team.id !== selectedTeam.id)
      );
      setSelectedTeamId(null);
      setEditorMode("closed");

      showToast("Mannschaft erfolgreich gelöscht.", "success");
    } catch (error) {
      console.error("Mannschaft konnte nicht gelöscht werden.", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Mannschaft konnte nicht gelöscht werden.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={pageContainerStyle}>
      <PageIntro
        title="Mannschaftsverwaltung"
        description="Lege hier Mannschaften an und pflege ihre grundlegenden Stammdaten."
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
        <TeamsListPanel
          teamCount={teams.length}
          filteredTeams={filteredTeams}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onClearSearch={() => setSearchValue("")}
          onCreateTeam={openCreateMode}
          isLoading={isLoading}
          loadError={loadError}
          isEditorOpen={isEditorOpen}
          editingTeamId={editingTeamId}
          hoveredTeamId={hoveredTeamId}
          onHoverTeam={setHoveredTeamId}
          onLeaveTeam={(teamId) =>
            setHoveredTeamId((current) => (current === teamId ? null : current))
          }
          onOpenEdit={openEditMode}
        />

        {isEditorOpen ? (
          <TeamsEditorPanel
            editorMode={editorMode}
            team={selectedTeam}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancelEdit={closeEditor}
            onDelete={editorMode === "edit" ? handleDelete : undefined}
          />
        ) : null}
      </div>
    </div>
  );
}

export default ManagementTeamsPage;