import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageIntro from "../components/layout/PageIntro";
import Card from "../components/ui/Card";
import StatusMessage from "../components/ui/StatusMessage";
import MemberForm from "../components/management/MemberForm";
import { useToast } from "../context/useToast";
import {
  createMember,
  deleteMember,
  fetchMembers,
  updateMember,
} from "../api/memberApi";
import type { Member, MemberUpsertRequest } from "../types/member";
import {
  badgeStyle,
  cardTitleStyle,
  colors,
  pageContainerStyle,
  secondaryButtonStyle,
} from "../styles/ui";

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
        <Card style={{ marginTop: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginBottom: "0.9rem",
            }}
          >
            <div>
              <h2 style={{ ...cardTitleStyle, marginBottom: "0.2rem" }}>
                Mitglieder
              </h2>
              <p
                style={{
                  margin: 0,
                  color: colors.textMuted,
                  fontSize: "0.92rem",
                }}
              >
                Kompakte Liste mit Auswahl und Suche
              </p>
            </div>

            <div style={badgeStyle}>{members.length}</div>
          </div>

          <div style={{ marginBottom: "0.8rem", position: "relative" }}>
            <input
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Mitglied suchen..."
              style={{
                width: "100%",
                padding: "11px 36px 11px 13px",
                borderRadius: "12px",
                border: `1px solid ${colors.borderStrong}`,
                backgroundColor: "#ffffff",
                color: colors.text,
                boxSizing: "border-box",
              }}
            />

            {searchValue ? (
              <button
                type="button"
                onClick={() => setSearchValue("")}
                aria-label="Suche zurücksetzen"
                title="Suche zurücksetzen"
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "24px",
                  height: "24px",
                  borderRadius: "999px",
                  border: "none",
                  background: "transparent",
                  color: colors.textMuted,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.55rem",
              flexWrap: "wrap",
              marginBottom: "0.9rem",
            }}
          >
            <button
              type="button"
              onClick={openCreateMode}
              style={{
                ...secondaryButtonStyle,
                padding: "0.58rem 0.85rem",
                minHeight: "38px",
                borderRadius: "10px",
              }}
            >
              Neues Mitglied
            </button>
          </div>

          {isLoading ? (
            <StatusMessage marginTop="0">Lade Mitglieder...</StatusMessage>
          ) : loadError ? (
            <StatusMessage variant="error" marginTop="0">
              {loadError}
            </StatusMessage>
          ) : filteredMembers.length === 0 ? (
            <StatusMessage variant="muted" marginTop="0">
              Keine Mitglieder gefunden.
            </StatusMessage>
          ) : (
            <div
              style={{
                border: `1px solid ${colors.border}`,
                borderRadius: "14px",
                overflow: "hidden",
                backgroundColor: colors.surfaceSoft,
              }}
            >
              <div
                style={{
                  maxHeight: "540px",
                  overflowY: "auto",
                }}
              >
                {filteredMembers.map((member, index) => {
                  const isEditingThisMember =
                    editorMode === "edit" && member.id === selectedMemberId;

                  const initials =
                    `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`
                      .toUpperCase()
                      .trim() || "?";

                  const memberTypeLabel =
                    member.type === "ADULT" ? "Erwachsene" : "Jugendliche";

                  const mannschaftenLabel =
                    member.teamIds.length === 1
                      ? "1 Mannschaft"
                      : `${member.teamIds.length} Mannschaften`;

                  const showActionsInListOnly =
                    !isEditorOpen && hoveredMemberId === member.id;

                  const showEyeInEditor =
                    isEditorOpen &&
                    (hoveredMemberId === member.id || isEditingThisMember);

                  return (
                    <div
                      key={member.id}
                      onMouseEnter={() => setHoveredMemberId(member.id)}
                      onMouseLeave={() =>
                        setHoveredMemberId((current) =>
                          current === member.id ? null : current
                        )
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                        padding: "0.78rem 0.9rem",
                        borderBottom:
                          index < filteredMembers.length - 1
                            ? `1px solid ${colors.border}`
                            : "none",
                        backgroundColor: isEditingThisMember
                          ? colors.primarySoft
                          : colors.surface,
                      }}
                    >
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "999px",
                          border: `1px solid ${colors.borderStrong}`,
                          background:
                            "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
                          color: colors.primary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "0.88rem",
                          flexShrink: 0,
                          userSelect: "none",
                        }}
                      >
                        {initials}
                      </div>

                      <button
                        type="button"
                        onClick={() => isEditorOpen && openEditMode(member.id)}
                        style={{
                          border: "none",
                          background: "transparent",
                          padding: 0,
                          margin: 0,
                          minWidth: 0,
                          flex: 1,
                          textAlign: "left",
                          cursor: isEditorOpen ? "pointer" : "default",
                        }}
                      >
                        <div
                          style={{
                            color: colors.text,
                            fontWeight: isEditingThisMember ? 800 : 700,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {member.fullName}
                        </div>

                        <div
                          style={{
                            marginTop: "0.18rem",
                            color: colors.textMuted,
                            fontSize: "0.84rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {memberTypeLabel}
                          {" · "}
                          {mannschaftenLabel}
                        </div>
                      </button>

                      <div
                        style={{
                          display: "flex",
                          gap: "0.45rem",
                          flexShrink: 0,
                        }}
                      >
                        {isEditorOpen ? (
                          <Link
                            to={`/members/${member.id}`}
                            state={{ fromManagement: true }}
                            aria-label={`${member.fullName} öffnen`}
                            title="Details öffnen"
                            style={{
                              ...iconOnlyActionStyle,
                              opacity: showEyeInEditor ? 1 : 0,
                              pointerEvents: showEyeInEditor ? "auto" : "none",
                              transition: "opacity 0.15s ease",
                            }}
                          >
                            👁
                          </Link>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              gap: "0.45rem",
                              opacity: showActionsInListOnly ? 1 : 0,
                              pointerEvents: showActionsInListOnly ? "auto" : "none",
                              transition: "opacity 0.15s ease",
                            }}
                          >
                            <Link
                              to={`/members/${member.id}`}
                              state={{ fromManagement: true }}
                              aria-label={`${member.fullName} öffnen`}
                              title="Details öffnen"
                              style={{
                                ...listActionButtonStyle,
                                textDecoration: "none",
                              }}
                            >
                              <span style={listActionIconStyle}>👁</span>
                              <span>Details</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => openEditMode(member.id)}
                              aria-label={`${member.fullName} bearbeiten`}
                              title="Mitglied bearbeiten"
                              style={listActionButtonStyle}
                            >
                              <span style={listActionIconStyle}>✎</span>
                              <span>Bearbeiten</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>

        {isEditorOpen ? (
          <Card style={{ marginTop: 0 }}>
            <MemberForm
              key={
                editorMode === "edit"
                  ? selectedMember?.id ?? "edit-member"
                  : "new-member"
              }
              member={editorMode === "edit" ? selectedMember : null}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onCancelEdit={closeEditor}
              onDelete={editorMode === "edit" ? handleDelete : undefined}
            />
          </Card>
        ) : null}
      </div>
    </div>
  );
}

const listActionButtonStyle = {
  minHeight: "36px",
  padding: "0.48rem 0.72rem",
  borderRadius: "10px",
  border: `1px solid ${colors.border}`,
  backgroundColor: "#ffffff",
  color: colors.textMuted,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  fontSize: "0.88rem",
  fontWeight: 600,
  cursor: "pointer",
};

const listActionIconStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "16px",
};

const iconOnlyActionStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  border: `1px solid ${colors.border}`,
  backgroundColor: "#ffffff",
  color: colors.textMuted,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  fontSize: "0.95rem",
};

export default ManagementMembersPage;