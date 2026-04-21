import { useEffect, useMemo, useState } from "react";
import PageIntro from "../components/layout/PageIntro";
import MembersListPanel from "../components/management/MembersListPanel";
import MembersEditorPanel from "../components/management/MembersEditorPanel";
import { useToast } from "../context/useToast";
import {
  createMember,
  deleteMember,
  fetchMembers,
  updateMember,
} from "../api/memberApi";
import type { Member, MemberUpsertRequest } from "../types/member";
import { pageContainerStyle } from "../styles/ui";

type EditorMode = "closed" | "create" | "edit";

function ManagementMembersPage() {
  const { showToast } = useToast();

  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>("closed");
  const [searchValue, setSearchValue] = useState("");
  const [hoveredMemberId, setHoveredMemberId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadInitialMembers() {
      try {
        const loadedMembers = await fetchMembers();

        if (!isMounted) {
          return;
        }

        setMembers(loadedMembers);
      } catch (error) {
        console.error("Mitglieder konnten nicht geladen werden.", error);

        if (!isMounted) {
          return;
        }

        setLoadError("Die Mitglieder konnten nicht geladen werden.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialMembers();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredMembers = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLocaleLowerCase("de");

    return [...members]
      .sort((left, right) =>
        left.fullName.localeCompare(right.fullName, "de", {
          sensitivity: "base",
        })
      )
      .filter((member) => {
        if (!normalizedSearch) {
          return true;
        }

        return (
          member.fullName.toLocaleLowerCase("de").includes(normalizedSearch) ||
          member.firstName.toLocaleLowerCase("de").includes(normalizedSearch) ||
          member.lastName.toLocaleLowerCase("de").includes(normalizedSearch) ||
          String(member.id).includes(normalizedSearch)
        );
      });
  }, [members, searchValue]);

  const selectedMember =
    editorMode === "edit"
      ? members.find((member) => member.id === selectedMemberId) ?? null
      : null;

  function openCreateMode() {
    setSelectedMemberId(null);
    setEditorMode("create");
  }

  function openEditMode(memberId: number) {
    setSelectedMemberId(memberId);
    setEditorMode("edit");
  }

  function closeEditor() {
    setSelectedMemberId(null);
    setEditorMode("closed");
  }

  async function handleSubmit(request: MemberUpsertRequest) {
    setIsSubmitting(true);

    try {
      if (editorMode === "edit" && selectedMember) {
        const updatedMember = await updateMember(selectedMember.id, request);

        setMembers((current) =>
          current.map((member) =>
            member.id === updatedMember.id ? updatedMember : member
          )
        );

        setSelectedMemberId(updatedMember.id);
        showToast("Mitglied erfolgreich aktualisiert.", "success");
        return;
      }

      const createdMember = await createMember(request);

      setMembers((current) => [...current, createdMember]);
      setSelectedMemberId(createdMember.id);
      setEditorMode("edit");
      showToast("Mitglied erfolgreich angelegt.", "success");
    } catch (error) {
      console.error("Mitglied konnte nicht gespeichert werden.", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Mitglied konnte nicht gespeichert werden.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!selectedMember) {
      return;
    }

    const confirmed = window.confirm(
      `Möchtest du ${selectedMember.fullName} wirklich löschen?`
    );

    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);

    try {
      await deleteMember(selectedMember.id);

      setMembers((current) =>
        current.filter((member) => member.id !== selectedMember.id)
      );
      setSelectedMemberId(null);
      setEditorMode("closed");

      showToast("Mitglied erfolgreich gelöscht.", "success");
    } catch (error) {
      console.error("Mitglied konnte nicht gelöscht werden.", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Mitglied konnte nicht gelöscht werden.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const isEditorOpen = editorMode !== "closed";

  return (
    <div style={pageContainerStyle}>
      <PageIntro
        title="Mitgliederverwaltung"
        description="Verwalte hier Mitglieder schnell und kompakt an einer Stelle."
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
        <MembersListPanel
          members={members}
          filteredMembers={filteredMembers}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onClearSearch={() => setSearchValue("")}
          onCreateMember={openCreateMode}
          isLoading={isLoading}
          loadError={loadError}
          isEditorOpen={isEditorOpen}
          selectedMemberId={selectedMemberId}
          hoveredMemberId={hoveredMemberId}
          onHoverMember={setHoveredMemberId}
          onLeaveMember={(memberId) =>
            setHoveredMemberId((current) =>
              current === memberId ? null : current
            )
          }
          onOpenEdit={openEditMode}
        />

        {isEditorOpen ? (
          <MembersEditorPanel
            editorMode={editorMode}
            member={selectedMember}
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

export default ManagementMembersPage;