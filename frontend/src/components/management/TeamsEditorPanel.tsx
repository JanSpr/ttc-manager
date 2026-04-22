import { useMemo, useState } from "react";
import Card from "../ui/Card";
import FormField from "../ui/FormField";
import StatusMessage from "../ui/StatusMessage";
import TeamForm from "./TeamForm";
import type { Member } from "../../types/member";
import type {
  Team,
  TeamMembership,
  TeamMembershipSummary,
  TeamMembershipUpsertRequest,
  TeamUpsertRequest,
} from "../../types/team";
import {
  badgeStyle,
  colors,
  primaryButtonStyle,
  secondaryButtonStyle,
  textInputStyle,
} from "../../styles/ui";

type TeamsEditorPanelProps = {
  editorMode: "create" | "edit";
  team: Team | null;
  allMembers: Member[];
  memberships: TeamMembership[];
  membershipLoadError: string;
  isSubmitting: boolean;
  isMembershipSubmitting: boolean;
  onSubmit: (request: TeamUpsertRequest) => Promise<void>;
  onCancelEdit: () => void;
  onDelete?: () => Promise<void>;
  onCreateMembership: (
    request: TeamMembershipUpsertRequest
  ) => Promise<void>;
  onDeleteMembership: (membershipId: number) => Promise<void>;
  onSaveLineup: (memberships: TeamMembership[]) => Promise<void>;
};

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

function createMembershipSignature(memberships: TeamMembership[]): string {
  return memberships
    .map(
      (membership) =>
        `${membership.id}:${membership.lineupPosition ?? ""}:${membership.memberId}`
    )
    .join("|");
}

function formatMembershipRole(
  membership: Pick<
    TeamMembership | TeamMembershipSummary,
    "player" | "captain" | "viceCaptain"
  >
): string {
  const labels: string[] = [];

  if (membership.captain) {
    labels.push("Mannschaftsführer");
  }

  if (membership.viceCaptain) {
    labels.push("Stellvertretung");
  }

  if (membership.player) {
    labels.push("Spieler");
  }

  return labels.length > 0 ? labels.join(" · ") : "Keine Teamfunktion";
}

function formatLineupPosition(position: number | null | undefined): string {
  if (position == null) {
    return "–";
  }

  return String(position);
}

function getTeamTypeLabel(type: Team["type"]): string {
  return type === "YOUTH" ? "Jugend" : "Erwachsene";
}

function getTeamShortCode(team: Pick<Team, "name" | "type">): string {
  const normalizedName = team.name.trim();

  const romanMatch = normalizedName.match(
    /\b(I|II|III|IV|V|VI|VII|VIII|IX|X)\b/i
  );
  const digitMatch = normalizedName.match(/\b(\d+)\b/);

  const teamNumber = digitMatch?.[1] ?? romanMatch?.[1]?.toUpperCase() ?? "";

  if (team.type === "YOUTH") {
    return teamNumber ? `J${teamNumber}` : "J";
  }

  return teamNumber ? `H${teamNumber}` : "H";
}

function EditIcon({ size = 15 }: { size?: number }) {
  return (
    <span aria-hidden="true" style={iconWrapperStyle(size)}>
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 17.25V21h3.75L18.8 8.95l-3.75-3.75L3 17.25z" />
        <path d="M14.9 5.2l3.75 3.75" />
      </svg>
    </span>
  );
}

function MembersIcon({ size = 15 }: { size?: number }) {
  return (
    <span aria-hidden="true" style={iconWrapperStyle(size)}>
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="3.5" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a3.5 3.5 0 0 1 0 6.74" />
      </svg>
    </span>
  );
}

function PlusIcon({ size = 15 }: { size?: number }) {
  return (
    <span aria-hidden="true" style={iconWrapperStyle(size)}>
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    </span>
  );
}

function DragHandleIcon({ size = 16 }: { size?: number }) {
  return (
    <span aria-hidden="true" style={iconWrapperStyle(size)}>
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <circle cx="9" cy="6.5" r="1.2" />
        <circle cx="15" cy="6.5" r="1.2" />
        <circle cx="9" cy="12" r="1.2" />
        <circle cx="15" cy="12" r="1.2" />
        <circle cx="9" cy="17.5" r="1.2" />
        <circle cx="15" cy="17.5" r="1.2" />
      </svg>
    </span>
  );
}

function iconWrapperStyle(size: number) {
  return {
    display: "inline-flex",
    width: size,
    height: size,
    alignItems: "center",
    justifyContent: "center",
    color: "currentColor",
    flexShrink: 0,
  } as const;
}

function TeamsEditorPanel({
  editorMode,
  team,
  allMembers,
  memberships,
  membershipLoadError,
  isSubmitting,
  isMembershipSubmitting,
  onSubmit,
  onCancelEdit,
  onDelete,
  onCreateMembership,
  onDeleteMembership,
  onSaveLineup,
}: TeamsEditorPanelProps) {
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [memberSearchValue, setMemberSearchValue] = useState("");
  const [membershipError, setMembershipError] = useState("");
  const [draggedMembershipId, setDraggedMembershipId] = useState<number | null>(
    null
  );
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [lineupDraft, setLineupDraft] = useState<{
    baseSignature: string;
    memberships: TeamMembership[];
  } | null>(null);

  const isEditMode = editorMode === "edit" && team;

  const sortedBaseMemberships = useMemo(
    () => sortMemberships(memberships),
    [memberships]
  );

  const membershipsSignature = useMemo(
    () => createMembershipSignature(sortedBaseMemberships),
    [sortedBaseMemberships]
  );

  const activeDraft =
    lineupDraft != null && lineupDraft.baseSignature === membershipsSignature
      ? lineupDraft
      : null;

  const hasLineupChanges = activeDraft != null;
  const sortedMemberships = activeDraft?.memberships ?? sortedBaseMemberships;

  const assignedMemberIds = useMemo(
    () => new Set(sortedMemberships.map((membership) => membership.memberId)),
    [sortedMemberships]
  );

  const availableMembers = useMemo(
    () =>
      [...allMembers]
        .filter((member) => !assignedMemberIds.has(member.id))
        .sort((left, right) =>
          left.fullName.localeCompare(right.fullName, "de", {
            sensitivity: "base",
          })
        ),
    [allMembers, assignedMemberIds]
  );

  const filteredAvailableMembers = useMemo(() => {
    const normalizedSearch = memberSearchValue.trim().toLocaleLowerCase("de");

    if (!normalizedSearch) {
      return availableMembers;
    }

    return availableMembers.filter((member) =>
      member.fullName.toLocaleLowerCase("de").includes(normalizedSearch)
    );
  }, [availableMembers, memberSearchValue]);

  const selectedMember = useMemo(
    () =>
      availableMembers.find(
        (member) => String(member.id) === selectedMemberId
      ) ?? null,
    [availableMembers, selectedMemberId]
  );

  async function handleAddMembership() {
    if (!isEditMode || hasLineupChanges) {
      return;
    }

    const memberId = Number(selectedMemberId);

    if (!selectedMemberId || Number.isNaN(memberId)) {
      setMembershipError("Bitte wähle zuerst ein Mitglied aus.");
      return;
    }

    setMembershipError("");

    await onCreateMembership({
      memberId,
      lineupPosition: sortedBaseMemberships.length + 1,
      player: true,
      captain: false,
      viceCaptain: false,
    });

    setSelectedMemberId("");
    setMemberSearchValue("");
  }

  function handleResetLineupDraft() {
    setDraggedMembershipId(null);
    setDragOverIndex(null);
    setLineupDraft(null);
    setMembershipError("");
  }

  async function handleSaveLineupDraft() {
    if (!activeDraft) {
      return;
    }

    setDraggedMembershipId(null);
    setDragOverIndex(null);
    setMembershipError("");

    await onSaveLineup(activeDraft.memberships);
    setLineupDraft(null);
  }

  function handleMembershipDrop(targetIndex: number) {
    if (
      draggedMembershipId == null ||
      targetIndex < 0 ||
      targetIndex > sortedMemberships.length
    ) {
      setDraggedMembershipId(null);
      setDragOverIndex(null);
      return;
    }

    const baseMemberships = hasLineupChanges
      ? [...sortedMemberships]
      : sortedBaseMemberships.map((membership) => ({ ...membership }));

    const sourceIndex = baseMemberships.findIndex(
      (membership) => membership.id === draggedMembershipId
    );

    if (sourceIndex < 0) {
      setDraggedMembershipId(null);
      setDragOverIndex(null);
      return;
    }

    const [movedMembership] = baseMemberships.splice(sourceIndex, 1);
    const adjustedTargetIndex =
      sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;

    baseMemberships.splice(adjustedTargetIndex, 0, movedMembership);

    const normalizedMemberships = baseMemberships.map((membership, index) => ({
      ...membership,
      lineupPosition: index + 1,
    }));

    setLineupDraft({
      baseSignature: membershipsSignature,
      memberships: normalizedMemberships,
    });
    setDraggedMembershipId(null);
    setDragOverIndex(null);
    setMembershipError("");
  }

  function renderDropZone(index: number) {
    const isDragging = draggedMembershipId != null;
    const isActive = dragOverIndex === index;
    const isEdge = index === 0 || index === sortedMemberships.length;

    return (
      <div
        key={`drop-zone-${index}`}
        onDragOver={(event) => {
          event.preventDefault();

          if (dragOverIndex !== index) {
            setDragOverIndex(index);
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();

          if (dragOverIndex !== index) {
            setDragOverIndex(index);
          }
        }}
        onDrop={() => handleMembershipDrop(index)}
        style={{
          ...dropZoneWrapperStyle,
          height: isDragging ? (isActive ? "28px" : isEdge ? "18px" : "8px") : "0px",
          opacity: isDragging ? 1 : 0,
        }}
      >
        <div
          style={{
            ...dropZoneIndicatorStyle,
            opacity: isActive ? 1 : 0,
          }}
        />
      </div>
    );
  }

  return (
    <Card style={{ marginTop: 0 }}>
      <div style={{ display: "grid", gap: "1rem" }}>
        {isEditMode && team ? (
          <div style={teamSummaryCardStyle}>
            <div style={teamSummaryIconStyle}>{getTeamShortCode(team)}</div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={teamSummaryNameStyle}>{team.name}</div>
              <div style={teamSummaryMetaStyle}>
                ID: {team.id}
                {" · "}
                {getTeamTypeLabel(team.type)}
                {" · "}
                {team.memberCount}{" "}
                {team.memberCount === 1 ? "Mitglied" : "Mitglieder"}
              </div>
            </div>
          </div>
        ) : null}

        <section style={sectionCardStyle}>
          <div style={sectionHeaderRowStyle}>
            <div style={sectionHeaderTextStyle}>
              <div style={sectionBadgeRowStyle}>
                <span style={badgeStyle}>Mannschaftsdaten</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDetailsOpen((current) => !current)}
              style={sectionActionButtonStyle}
              aria-expanded={isDetailsOpen}
            >
              <span style={buttonIconTextRowStyle}>
                <EditIcon />
                <span>{isDetailsOpen ? "Schließen" : "Bearbeiten"}</span>
              </span>
            </button>
          </div>

          {isDetailsOpen ? (
            <div style={sectionContentStyle}>
              <TeamForm
                key={editorMode === "edit" ? team?.id ?? "edit-team" : "new-team"}
                team={editorMode === "edit" ? team : null}
                isSubmitting={isSubmitting}
                onSubmit={onSubmit}
                onCancelEdit={onCancelEdit}
                onDelete={editorMode === "edit" ? onDelete : undefined}
                showHeader={false}
                showSelectedInfo={false}
              />
            </div>
          ) : (
            <div style={sectionCollapsedHintStyle}>
              Name, Kategorie und Beschreibung der Mannschaft bearbeiten.
            </div>
          )}
        </section>

        {isEditMode ? (
          <section style={sectionCardStyle}>
            <div style={sectionHeaderRowStyle}>
              <div style={sectionHeaderTextStyle}>
                <div style={sectionBadgeRowStyle}>
                  <span style={badgeStyle}>Mannschaftsmitglieder</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMembersOpen((current) => !current)}
                style={sectionActionButtonStyle}
                aria-expanded={isMembersOpen}
              >
                <span style={buttonIconTextRowStyle}>
                  <MembersIcon />
                  <span>{isMembersOpen ? "Schließen" : "Verwalten"}</span>
                </span>
              </button>
            </div>

            {isMembersOpen ? (
              <div style={sectionContentStyle}>
                {membershipLoadError ? (
                  <StatusMessage variant="error" marginTop="0">
                    {membershipLoadError}
                  </StatusMessage>
                ) : null}

                <div style={memberAddAreaStyle}>
                  <FormField
                    label="Mitglied auswählen"
                    htmlFor="team-membership-member-search"
                  >
                    <div style={comboboxWrapperStyle}>
                      <div style={searchInputWrapperStyle}>
                        <input
                          id="team-membership-member-search"
                          type="text"
                          value={memberSearchValue}
                          onChange={(event) => {
                            setMemberSearchValue(event.target.value);
                            setSelectedMemberId("");
                          }}
                          style={searchInputStyle}
                          placeholder="Mitglied suchen..."
                          disabled={
                            isMembershipSubmitting ||
                            availableMembers.length === 0 ||
                            hasLineupChanges
                          }
                        />

                        {memberSearchValue ? (
                          <button
                            type="button"
                            onClick={() => {
                              setMemberSearchValue("");
                              setSelectedMemberId("");
                              setMembershipError("");
                            }}
                            style={clearButtonStyle}
                            aria-label="Suche löschen"
                            disabled={
                              isMembershipSubmitting ||
                              availableMembers.length === 0 ||
                              hasLineupChanges
                            }
                          >
                            ✕
                          </button>
                        ) : null}
                      </div>

                      {selectedMember ? (
                        <div style={selectedMemberInfoStyle}>
                          Ausgewählt: {selectedMember.fullName}
                        </div>
                      ) : null}

                      {memberSearchValue.trim() &&
                      filteredAvailableMembers.length > 0 ? (
                        <div style={comboboxResultsStyle}>
                          {filteredAvailableMembers.slice(0, 8).map((member) => {
                            const isSelected =
                              String(member.id) === selectedMemberId;

                            return (
                              <button
                                key={member.id}
                                type="button"
                                onClick={() => {
                                  setSelectedMemberId(String(member.id));
                                  setMemberSearchValue(member.fullName);
                                  setMembershipError("");
                                }}
                                style={{
                                  ...comboboxResultItemStyle,
                                  backgroundColor: isSelected
                                    ? colors.primarySoft
                                    : colors.surface,
                                  color: isSelected ? colors.primary : colors.text,
                                }}
                                disabled={
                                  isMembershipSubmitting || hasLineupChanges
                                }
                              >
                                {member.fullName}
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </FormField>

                  {memberSearchValue.trim() && filteredAvailableMembers.length === 0 ? (
                    <StatusMessage variant="muted" marginTop="0">
                      Keine verfügbaren Mitglieder zur Suche gefunden.
                    </StatusMessage>
                  ) : null}

                  <div style={addActionRowStyle}>
                    <button
                      type="button"
                      onClick={() => void handleAddMembership()}
                      disabled={
                        isMembershipSubmitting ||
                        availableMembers.length === 0 ||
                        hasLineupChanges
                      }
                      style={{
                        ...primaryButtonStyle,
                        ...compactButtonStyle,
                        opacity:
                          isMembershipSubmitting ||
                          availableMembers.length === 0 ||
                          hasLineupChanges
                            ? 0.7
                            : 1,
                        cursor:
                          isMembershipSubmitting ||
                          availableMembers.length === 0 ||
                          hasLineupChanges
                            ? "default"
                            : "pointer",
                      }}
                    >
                      <span style={buttonIconTextRowStyle}>
                        <PlusIcon />
                        <span>
                          {isMembershipSubmitting
                            ? "Wird hinzugefügt..."
                            : "Mitglied hinzufügen"}
                        </span>
                      </span>
                    </button>
                  </div>

                  {hasLineupChanges ? (
                    <StatusMessage variant="muted" marginTop="0">
                      Bitte die geänderte Aufstellung erst speichern oder
                      zurücksetzen.
                    </StatusMessage>
                  ) : null}

                  {availableMembers.length === 0 ? (
                    <StatusMessage variant="muted" marginTop="0">
                      Alle verfügbaren Mitglieder sind dieser Mannschaft bereits
                      zugeordnet.
                    </StatusMessage>
                  ) : null}

                  {membershipError ? (
                    <StatusMessage variant="error" marginTop="0">
                      {membershipError}
                    </StatusMessage>
                  ) : null}
                </div>

                {sortedMemberships.length === 0 ? (
                  <StatusMessage variant="muted" marginTop="0">
                    Dieser Mannschaft sind aktuell keine Mitglieder zugeordnet.
                  </StatusMessage>
                ) : (
                  <>
                    <div style={reorderHintStyle}>
                      Spieler per Ziehen neu anordnen.
                    </div>

                    <div style={membershipListStyle}>
                      {renderDropZone(0)}

                      {sortedMemberships.map((membership, index) => {
                        const isDragged = draggedMembershipId === membership.id;

                        return (
                          <div key={membership.id}>
                            <div
                              draggable={!isMembershipSubmitting}
                              onDragStart={() => {
                                setMembershipError("");
                                setDraggedMembershipId(membership.id);
                              }}
                              onDragEnd={() => {
                                setDraggedMembershipId(null);
                                setDragOverIndex(null);
                              }}
                              style={{
                                ...membershipRowStyle,
                                opacity: isDragged ? 0.55 : 1,
                                borderBottom:
                                  index < sortedMemberships.length - 1
                                    ? `1px solid ${colors.border}`
                                    : "none",
                              }}
                            >
                              <div
                                style={dragHandleStyle}
                                title="Ziehen zum Umsortieren"
                                aria-hidden="true"
                              >
                                <DragHandleIcon />
                              </div>

                              <div style={membershipPositionStyle}>
                                {formatLineupPosition(membership.lineupPosition)}
                              </div>

                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={membershipNameStyle}>
                                  {membership.memberFullName}
                                </div>
                                <div style={membershipMetaStyle}>
                                  {formatMembershipRole(membership)}
                                </div>
                              </div>

                              <div style={membershipActionsStyle}>
                                <button
                                  type="button"
                                  onClick={() => void onDeleteMembership(membership.id)}
                                  disabled={isMembershipSubmitting || hasLineupChanges}
                                  title={
                                    hasLineupChanges
                                      ? "Erst Aufstellung speichern oder zurücksetzen"
                                      : "Mitglied entfernen"
                                  }
                                  aria-label={`${
                                    membership.memberFullName
                                  } aus der Mannschaft entfernen`}
                                  style={{
                                    ...iconDeleteButtonStyle,
                                    opacity:
                                      isMembershipSubmitting || hasLineupChanges
                                        ? 0.45
                                        : 1,
                                    cursor:
                                      isMembershipSubmitting || hasLineupChanges
                                        ? "not-allowed"
                                        : "pointer",
                                    color:
                                      isMembershipSubmitting || hasLineupChanges
                                        ? colors.textMuted
                                        : colors.danger,
                                    borderColor:
                                      isMembershipSubmitting || hasLineupChanges
                                        ? colors.border
                                        : "#fecaca",
                                    backgroundColor:
                                      isMembershipSubmitting || hasLineupChanges
                                        ? colors.surfaceSoft
                                        : colors.dangerSoft,
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            </div>

                            {renderDropZone(index + 1)}
                          </div>
                        );
                      })}
                    </div>

                    {hasLineupChanges ? (
                      <div style={lineupDraftNoticeStyle}>
                        <span>Die Aufstellung wurde geändert.</span>

                        <div style={lineupDraftActionsStyle}>
                          <button
                            type="button"
                            onClick={handleResetLineupDraft}
                            disabled={isMembershipSubmitting}
                            style={{
                              ...secondaryButtonStyle,
                              ...compactSecondaryActionButtonStyle,
                              opacity: isMembershipSubmitting ? 0.7 : 1,
                              cursor: isMembershipSubmitting ? "default" : "pointer",
                            }}
                          >
                            Zurücksetzen
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleSaveLineupDraft()}
                            disabled={isMembershipSubmitting}
                            style={{
                              ...primaryButtonStyle,
                              ...compactButtonStyle,
                              opacity: isMembershipSubmitting ? 0.7 : 1,
                              cursor: isMembershipSubmitting ? "default" : "pointer",
                            }}
                          >
                            Aufstellung speichern
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            ) : (
              <div style={sectionCollapsedHintStyle}>
                Mitglieder verwalten und Aufstellung bearbeiten.
              </div>
            )}
          </section>
        ) : null}
      </div>
    </Card>
  );
}

const sectionCardStyle = {
  display: "grid",
  gap: "0.9rem",
  padding: "1rem",
  borderRadius: "16px",
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surface,
};

const sectionHeaderRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "1rem",
  flexWrap: "wrap" as const,
};

const sectionHeaderTextStyle = {
  minWidth: 0,
  flex: 1,
};

const sectionBadgeRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const sectionActionButtonStyle = {
  minHeight: "38px",
  padding: "0.55rem 0.8rem",
  borderRadius: "10px",
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surfaceSoft,
  color: colors.text,
  fontWeight: 700,
  cursor: "pointer",
  flexShrink: 0,
};

const sectionContentStyle = {
  display: "grid",
  gap: "1rem",
};

const sectionCollapsedHintStyle = {
  padding: "0.85rem 0.95rem",
  borderRadius: "12px",
  border: `1px dashed ${colors.border}`,
  backgroundColor: colors.surfaceSoft,
  color: colors.textMuted,
  fontSize: "0.92rem",
  lineHeight: 1.5,
};

const teamSummaryCardStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.85rem",
  padding: "0.9rem 1rem",
  borderRadius: "14px",
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surfaceSoft,
};

const teamSummaryIconStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
  background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
  color: colors.primary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: "0.95rem",
  flexShrink: 0,
};

const teamSummaryNameStyle = {
  color: colors.text,
  fontWeight: 700,
  lineHeight: 1.35,
};

const teamSummaryMetaStyle = {
  marginTop: "0.2rem",
  color: colors.textMuted,
  fontSize: "0.88rem",
  lineHeight: 1.5,
};

const memberAddAreaStyle = {
  display: "grid",
  gap: "0.9rem",
};

const comboboxWrapperStyle = {
  display: "grid",
  gap: "0.5rem",
};

const searchInputWrapperStyle = {
  position: "relative" as const,
  display: "flex",
  alignItems: "center",
};

const searchInputStyle = {
  ...textInputStyle,
  paddingRight: "2.3rem",
};

const clearButtonStyle = {
  position: "absolute" as const,
  right: "0.55rem",
  width: "24px",
  height: "24px",
  border: "none",
  borderRadius: "6px",
  background: "transparent",
  color: colors.textMuted,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.9rem",
};

const comboboxResultsStyle = {
  display: "grid",
  border: `1px solid ${colors.border}`,
  borderRadius: "12px",
  overflow: "hidden",
  backgroundColor: colors.surface,
  maxHeight: "220px",
  overflowY: "auto" as const,
};

const comboboxResultItemStyle = {
  border: "none",
  borderBottom: `1px solid ${colors.border}`,
  background: colors.surface,
  color: colors.text,
  padding: "0.75rem 0.9rem",
  textAlign: "left" as const,
  cursor: "pointer",
  fontSize: "0.95rem",
};

const selectedMemberInfoStyle = {
  padding: "0.65rem 0.8rem",
  borderRadius: "10px",
  backgroundColor: colors.surfaceSoft,
  color: colors.textMuted,
  fontSize: "0.9rem",
  lineHeight: 1.4,
};

const addActionRowStyle = {
  display: "flex",
  justifyContent: "center",
};

const compactButtonStyle = {
  minHeight: "40px",
  padding: "0.62rem 0.95rem",
  borderRadius: "10px",
};

const compactSecondaryActionButtonStyle = {
  minHeight: "38px",
  padding: "0.55rem 0.8rem",
  borderRadius: "10px",
};

const buttonIconTextRowStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
};

const reorderHintStyle = {
  padding: "0.7rem 0.9rem",
  borderRadius: "12px",
  border: `1px dashed ${colors.border}`,
  backgroundColor: colors.surfaceSoft,
  color: colors.textMuted,
  fontSize: "0.9rem",
  lineHeight: 1.45,
};

const membershipListStyle = {
  display: "grid",
  border: `1px solid ${colors.border}`,
  borderRadius: "14px",
  overflow: "hidden",
};

const membershipRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.9rem",
  padding: "0.95rem 1rem",
  backgroundColor: colors.surface,
};

const membershipPositionStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "999px",
  backgroundColor: colors.primarySoft,
  color: colors.primary,
  fontWeight: 800,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const membershipNameStyle = {
  color: colors.text,
  fontWeight: 700,
  lineHeight: 1.35,
};

const membershipMetaStyle = {
  marginTop: "0.2rem",
  color: colors.textMuted,
  fontSize: "0.9rem",
  lineHeight: 1.45,
};

const membershipActionsStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  flexShrink: 0,
};

const iconDeleteButtonStyle = {
  minWidth: "32px",
  width: "32px",
  height: "32px",
  padding: "0",
  borderRadius: "10px",
  border: "1px solid #fecaca",
  backgroundColor: colors.dangerSoft,
  color: colors.danger,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
};

const lineupDraftNoticeStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  flexWrap: "wrap" as const,
  padding: "0.9rem 1rem",
  borderRadius: "14px",
  border: `1px dashed ${colors.border}`,
  backgroundColor: colors.surfaceSoft,
  color: colors.textMuted,
};

const lineupDraftActionsStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.65rem",
  flexWrap: "wrap" as const,
};

const dropZoneWrapperStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 0.85rem",
  transition: "height 0.15s ease, opacity 0.15s ease",
};

const dropZoneIndicatorStyle = {
  width: "100%",
  height: "2px",
  borderRadius: "999px",
  backgroundColor: "#9ca3af",
  transition: "opacity 0.12s ease",
};

const dragHandleStyle = {
  width: "28px",
  height: "28px",
  borderRadius: "8px",
  color: colors.textMuted,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  cursor: "grab",
};

export default TeamsEditorPanel;