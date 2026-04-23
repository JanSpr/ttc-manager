import { useEffect, useMemo, useState } from "react";
import PageIntro from "../components/layout/PageIntro";
import TeamsListPanel from "../components/management/teams/TeamsListPanel";
import TeamsEditorPanel from "../components/management/teams/TeamsEditorPanel";
import { useToast } from "../context/useToast";
import { fetchMembers } from "../api/memberApi";
import {
  createTeam,
  createTeamMembership,
  deleteTeam,
  deleteTeamMembership,
  fetchTeamById,
  fetchTeamMemberships,
  fetchTeams,
  updateTeam,
  updateTeamMembership,
} from "../api/teamApi";
import type { Member } from "../types/member";
import type {
  Team,
  TeamMembership,
  TeamMembershipUpsertRequest,
  TeamUpsertRequest,
} from "../types/team";
import { pageContainerStyle } from "../styles/ui";

type EditorMode = "closed" | "create" | "edit";

function sortMemberships(memberships: TeamMembership[]): TeamMembership[] {
  return [...memberships].sort((left, right) => {
    const leftPosition = left.lineupPosition ?? Number.MAX_SAFE_INTEGER;
    const rightPosition = right.lineupPosition ?? Number.MAX_SAFE_INTEGER;

    if (leftPosition !== rightPosition) {
      return leftPosition - rightPosition;
    }

    return left.memberFullName.localeCompare(right.memberFullName, "de", {
      sensitivity: "base",
    });
  });
}

function ManagementTeamsPage() {
  const { showToast } = useToast();

  const [teams, setTeams] = useState<Team[]>([]);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [memberships, setMemberships] = useState<TeamMembership[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>("closed");
  const [searchValue, setSearchValue] = useState("");
  const [hoveredTeamId, setHoveredTeamId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMembershipSubmitting, setIsMembershipSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [membershipLoadError, setMembershipLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [loadedTeams, loadedMembers] = await Promise.all([
          fetchTeams(),
          fetchMembers(),
        ]);

        if (!isMounted) {
          return;
        }

        setTeams(loadedTeams);
        setAllMembers(loadedMembers);
      } catch (error) {
        console.error(
          "Mannschaften oder Mitglieder konnten nicht geladen werden.",
          error
        );

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

    void loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadMembershipsForSelectedTeam() {
      if (editorMode !== "edit" || selectedTeamId == null) {
        setMemberships([]);
        setMembershipLoadError("");
        return;
      }

      try {
        setMembershipLoadError("");
        const loadedMemberships = await fetchTeamMemberships(selectedTeamId);

        if (!isMounted) {
          return;
        }

        setMemberships(sortMemberships(loadedMemberships));
      } catch (error) {
        console.error("TeamMemberships konnten nicht geladen werden.", error);

        if (!isMounted) {
          return;
        }

        setMemberships([]);
        setMembershipLoadError(
          "Die Mannschaftsmitglieder konnten nicht geladen werden."
        );
      }
    }

    void loadMembershipsForSelectedTeam();

    return () => {
      isMounted = false;
    };
  }, [editorMode, selectedTeamId]);

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
    setMemberships([]);
    setMembershipLoadError("");
    setEditorMode("create");
  }

  function openEditMode(teamId: number) {
    setSelectedTeamId(teamId);
    setMemberships([]);
    setMembershipLoadError("");
    setEditorMode("edit");
  }

  function closeEditor() {
    setSelectedTeamId(null);
    setMemberships([]);
    setMembershipLoadError("");
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
      setMemberships([]);
      setMembershipLoadError("");
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
      throw error;
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
      setMemberships([]);
      setMembershipLoadError("");
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
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function refreshTeamAndMemberships(teamId: number) {
    const [updatedTeam, updatedMemberships] = await Promise.all([
      fetchTeamById(teamId),
      fetchTeamMemberships(teamId),
    ]);

    setTeams((current) =>
      current.map((team) => (team.id === updatedTeam.id ? updatedTeam : team))
    );
    setMemberships(sortMemberships(updatedMemberships));
  }

  async function normalizeMembershipLineup(teamId: number) {
    const currentMemberships = sortMemberships(
      await fetchTeamMemberships(teamId)
    );

    const updates = currentMemberships
      .map((membership, index) => ({
        membership,
        nextLineupPosition: index + 1,
      }))
      .filter(
        ({ membership, nextLineupPosition }) =>
          membership.lineupPosition !== nextLineupPosition
      );

    for (const { membership, nextLineupPosition } of updates) {
      await updateTeamMembership(teamId, membership.id, {
        memberId: membership.memberId,
        lineupPosition: nextLineupPosition,
        player: membership.player,
        captain: membership.captain,
        viceCaptain: membership.viceCaptain,
      });
    }
  }

  async function handleCreateMembership(
    request: TeamMembershipUpsertRequest
  ) {
    if (!selectedTeam) {
      return;
    }

    setIsMembershipSubmitting(true);

    try {
      await createTeamMembership(selectedTeam.id, request);
      await normalizeMembershipLineup(selectedTeam.id);
      await refreshTeamAndMemberships(selectedTeam.id);
      showToast("Mitglied erfolgreich zur Mannschaft hinzugefügt.", "success");
    } catch (error) {
      console.error("Mitglied konnte nicht hinzugefügt werden.", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Mitglied konnte nicht hinzugefügt werden.",
        "error"
      );
      throw error;
    } finally {
      setIsMembershipSubmitting(false);
    }
  }

  async function handleAssignCaptain(memberId: number) {
    if (!selectedTeam) {
      return;
    }

    const currentCaptainMembership =
      memberships.find((membership) => membership.captain) ?? null;
    const selectedMembership =
      memberships.find((membership) => membership.memberId === memberId) ?? null;

    if (currentCaptainMembership?.memberId === memberId) {
      return;
    }

    setIsMembershipSubmitting(true);

    try {
      if (currentCaptainMembership) {
        const shouldRemoveCurrentCaptainMembership =
          !currentCaptainMembership.player && !currentCaptainMembership.viceCaptain;

        if (shouldRemoveCurrentCaptainMembership) {
          await deleteTeamMembership(selectedTeam.id, currentCaptainMembership.id);
        } else {
          await updateTeamMembership(
            selectedTeam.id,
            currentCaptainMembership.id,
            {
              memberId: currentCaptainMembership.memberId,
              lineupPosition:
                currentCaptainMembership.lineupPosition ?? memberships.length,
              player: currentCaptainMembership.player,
              captain: false,
              viceCaptain: currentCaptainMembership.viceCaptain,
            }
          );
        }
      }

      if (selectedMembership) {
        await updateTeamMembership(selectedTeam.id, selectedMembership.id, {
          memberId: selectedMembership.memberId,
          lineupPosition:
            selectedMembership.lineupPosition ?? memberships.length + 1,
          player: selectedMembership.player,
          captain: true,
          viceCaptain: selectedMembership.viceCaptain,
        });
      } else {
        await createTeamMembership(selectedTeam.id, {
          memberId,
          lineupPosition: memberships.length + 1,
          player: false,
          captain: true,
          viceCaptain: false,
        });
      }

      await normalizeMembershipLineup(selectedTeam.id);
      await refreshTeamAndMemberships(selectedTeam.id);
      showToast("Mannschaftsführer erfolgreich gesetzt.", "success");
    } catch (error) {
      console.error("Mannschaftsführer konnte nicht gesetzt werden.", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Mannschaftsführer konnte nicht gesetzt werden.",
        "error"
      );
      throw error;
    } finally {
      setIsMembershipSubmitting(false);
    }
  }

  async function handleSaveLineup(updatedMemberships: TeamMembership[]) {
    if (!selectedTeam) {
      return;
    }

    setIsMembershipSubmitting(true);

    try {
      const updates = updatedMemberships.filter((membership, index) => {
        const persistedMembership = memberships.find(
          (entry) => entry.id === membership.id
        );

        return (persistedMembership?.lineupPosition ?? null) !== index + 1;
      });

      for (const membership of updates) {
        await updateTeamMembership(selectedTeam.id, membership.id, {
          memberId: membership.memberId,
          lineupPosition: membership.lineupPosition ?? 0,
          player: membership.player,
          captain: membership.captain,
          viceCaptain: membership.viceCaptain,
        });
      }

      await refreshTeamAndMemberships(selectedTeam.id);
      showToast("Aufstellung gespeichert.", "success");
    } catch (error) {
      console.error("Aufstellung konnte nicht gespeichert werden.", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Aufstellung konnte nicht gespeichert werden.",
        "error"
      );
      throw error;
    } finally {
      setIsMembershipSubmitting(false);
    }
  }

  async function handleDeleteMembership(membershipId: number) {
    if (!selectedTeam) {
      return;
    }

    const membership = memberships.find((entry) => entry.id === membershipId);

    const confirmed = window.confirm(
      membership
        ? `Möchtest du ${membership.memberFullName} wirklich aus "${selectedTeam.name}" entfernen?`
        : "Möchtest du dieses Mitglied wirklich aus der Mannschaft entfernen?"
    );

    if (!confirmed) {
      return;
    }

    const previousMemberships = memberships;

    setMemberships((current) =>
      current
        .filter((membershipEntry) => membershipEntry.id !== membershipId)
        .map((membershipEntry, index) => ({
          ...membershipEntry,
          lineupPosition: index + 1,
        }))
    );

    setIsMembershipSubmitting(true);

    try {
      await deleteTeamMembership(selectedTeam.id, membershipId);
      await normalizeMembershipLineup(selectedTeam.id);
      await refreshTeamAndMemberships(selectedTeam.id);
      showToast("Mitglied erfolgreich aus der Mannschaft entfernt.", "success");
    } catch (error) {
      console.error("Mitglied konnte nicht entfernt werden.", error);
      setMemberships(previousMemberships);
      showToast(
        error instanceof Error
          ? error.message
          : "Mitglied konnte nicht entfernt werden.",
        "error"
      );
      throw error;
    } finally {
      setIsMembershipSubmitting(false);
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
            allMembers={allMembers}
            memberships={memberships}
            membershipLoadError={membershipLoadError}
            isSubmitting={isSubmitting}
            isMembershipSubmitting={isMembershipSubmitting}
            onSubmit={handleSubmit}
            onDelete={editorMode === "edit" ? handleDelete : undefined}
            onCreateMembership={handleCreateMembership}
            onAssignCaptain={handleAssignCaptain}
            onDeleteMembership={handleDeleteMembership}
            onSaveLineup={handleSaveLineup}
          />
        ) : null}
      </div>
    </div>
  );
}

export default ManagementTeamsPage;