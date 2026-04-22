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
};

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
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        color: "currentColor",
        flexShrink: 0,
      }}
    >
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
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        color: "currentColor",
        flexShrink: 0,
      }}
    >
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
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        color: "currentColor",
        flexShrink: 0,
      }}
    >
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
}: TeamsEditorPanelProps) {
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [lineupPosition, setLineupPosition] = useState("1");
  const [membershipError, setMembershipError] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);

  const isEditMode = editorMode === "edit" && team;

  const assignedMemberIds = useMemo(
    () => new Set(memberships.map((membership) => membership.memberId)),
    [memberships]
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

  const sortedMemberships = useMemo(
    () =>
      [...memberships].sort((left, right) => {
        const leftPosition = left.lineupPosition ?? Number.MAX_SAFE_INTEGER;
        const rightPosition = right.lineupPosition ?? Number.MAX_SAFE_INTEGER;

        if (leftPosition !== rightPosition) {
          return leftPosition - rightPosition;
        }

        return left.memberFullName.localeCompare(right.memberFullName, "de", {
          sensitivity: "base",
        });
      }),
    [memberships]
  );

  async function handleAddMembership() {
    if (!isEditMode) {
      return;
    }

    const memberId = Number(selectedMemberId);
    const parsedLineupPosition = Number(lineupPosition);

    if (!selectedMemberId || Number.isNaN(memberId)) {
      setMembershipError("Bitte wähle zuerst ein Mitglied aus.");
      return;
    }

    if (
      Number.isNaN(parsedLineupPosition) ||
      !Number.isInteger(parsedLineupPosition) ||
      parsedLineupPosition < 1
    ) {
      setMembershipError("Bitte gib eine gültige Aufstellungsposition ab 1 ein.");
      return;
    }

    setMembershipError("");

    await onCreateMembership({
      memberId,
      lineupPosition: parsedLineupPosition,
      player: true,
      captain: false,
      viceCaptain: false,
    });

    setSelectedMemberId("");
    setLineupPosition(String(sortedMemberships.length + 1));
    setIsMembersOpen(true);
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
              <EditIcon />
              <span>{isDetailsOpen ? "Schließen" : "Bearbeiten"}</span>
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
              Öffne diesen Bereich, um Name, Kategorie und Beschreibung zu
              bearbeiten.
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
                <MembersIcon />
                <span>{isMembersOpen ? "Schließen" : "Verwalten"}</span>
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
                  <div style={addGridStyle}>
                    <FormField label="Mitglied" htmlFor="team-membership-member">
                      <select
                        id="team-membership-member"
                        value={selectedMemberId}
                        onChange={(event) => setSelectedMemberId(event.target.value)}
                        style={textInputStyle}
                        disabled={
                          isMembershipSubmitting || availableMembers.length === 0
                        }
                      >
                        <option value="">Bitte auswählen</option>

                        {availableMembers.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.fullName}
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <FormField
                      label="Aufstellung"
                      htmlFor="team-membership-lineup-position"
                    >
                      <input
                        id="team-membership-lineup-position"
                        type="number"
                        min={1}
                        step={1}
                        value={lineupPosition}
                        onChange={(event) => setLineupPosition(event.target.value)}
                        style={textInputStyle}
                        disabled={
                          isMembershipSubmitting || availableMembers.length === 0
                        }
                      />
                    </FormField>
                  </div>

                  <div style={addActionRowStyle}>
                    <button
                      type="button"
                      onClick={() => void handleAddMembership()}
                      disabled={
                        isMembershipSubmitting || availableMembers.length === 0
                      }
                      style={{
                        ...primaryButtonStyle,
                        ...compactButtonStyle,
                        opacity:
                          isMembershipSubmitting || availableMembers.length === 0
                            ? 0.7
                            : 1,
                        cursor:
                          isMembershipSubmitting || availableMembers.length === 0
                            ? "default"
                            : "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <PlusIcon />
                      <span>
                        {isMembershipSubmitting
                          ? "Wird hinzugefügt..."
                          : "Mitglied hinzufügen"}
                      </span>
                    </button>
                  </div>

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
                  <div style={membershipListStyle}>
                    {sortedMemberships.map((membership, index) => (
                      <div
                        key={membership.id}
                        style={{
                          ...membershipRowStyle,
                          borderBottom:
                            index < sortedMemberships.length - 1
                              ? `1px solid ${colors.border}`
                              : "none",
                        }}
                      >
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
                            disabled={isMembershipSubmitting}
                            title="Mitglied entfernen"
                            aria-label={`${
                              membership.memberFullName
                            } aus der Mannschaft entfernen`}
                            style={{
                              ...secondaryButtonStyle,
                              ...iconActionButtonStyle,
                              opacity: isMembershipSubmitting ? 0.7 : 1,
                              cursor: isMembershipSubmitting ? "default" : "pointer",
                            }}
                          >
                            <span
                              aria-hidden="true"
                              style={{
                                fontSize: "1rem",
                                lineHeight: 1,
                                display: "inline-flex",
                              }}
                            >
                              ✕
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={sectionCollapsedHintStyle}>
                Öffne diesen Bereich, um Mitglieder hinzuzufügen, zu entfernen
                und später die Aufstellung zu verwalten.
              </div>
            )}
          </section>
        ) : null}
      </div>
    </Card>
  );
}

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
  border: `1px solid ${colors.borderStrong}`,
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
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
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

const memberAddAreaStyle = {
  display: "grid",
  gap: "0.9rem",
};

const addGridStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 140px",
  gap: "0.9rem",
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

const iconActionButtonStyle = {
  minWidth: "38px",
  width: "38px",
  height: "38px",
  padding: "0",
  borderRadius: "10px",
  color: colors.danger,
  borderColor: "#fecaca",
  backgroundColor: colors.dangerSoft,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

export default TeamsEditorPanel;