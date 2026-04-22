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
  cardTitleStyle,
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
  }

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <Card style={{ marginTop: 0 }}>
        <TeamForm
          key={editorMode === "edit" ? team?.id ?? "edit-team" : "new-team"}
          team={editorMode === "edit" ? team : null}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onCancelEdit={onCancelEdit}
          onDelete={editorMode === "edit" ? onDelete : undefined}
        />
      </Card>

      {isEditMode ? (
        <Card style={{ marginTop: 0 }}>
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <h2 style={cardTitleStyle}>Mannschaftsmitglieder</h2>
              <p style={sectionDescriptionStyle}>
                Weise dieser Mannschaft Mitglieder zu und lege ihre
                Aufstellungsposition fest.
              </p>
            </div>

            {membershipLoadError ? (
              <StatusMessage variant="error" marginTop="0">
                {membershipLoadError}
              </StatusMessage>
            ) : null}

            <div style={addSectionStyle}>
              <div style={addGridStyle}>
                <FormField label="Mitglied" htmlFor="team-membership-member">
                  <select
                    id="team-membership-member"
                    value={selectedMemberId}
                    onChange={(event) => setSelectedMemberId(event.target.value)}
                    style={textInputStyle}
                    disabled={isMembershipSubmitting || availableMembers.length === 0}
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
                    disabled={isMembershipSubmitting || availableMembers.length === 0}
                  />
                </FormField>
              </div>

              <div style={addActionRowStyle}>
                <button
                  type="button"
                  onClick={() => void handleAddMembership()}
                  disabled={isMembershipSubmitting || availableMembers.length === 0}
                  style={{
                    ...primaryButtonStyle,
                    ...compactButtonStyle,
                    opacity:
                      isMembershipSubmitting || availableMembers.length === 0 ? 0.7 : 1,
                    cursor:
                      isMembershipSubmitting || availableMembers.length === 0
                        ? "default"
                        : "pointer",
                  }}
                >
                  {isMembershipSubmitting ? "Wird hinzugefügt..." : "Mitglied hinzufügen"}
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
                      <div style={badgeStyle}>Pos. {formatLineupPosition(membership.lineupPosition)}</div>

                      <button
                        type="button"
                        onClick={() => void onDeleteMembership(membership.id)}
                        disabled={isMembershipSubmitting}
                        style={{
                          ...secondaryButtonStyle,
                          ...compactSecondaryActionButtonStyle,
                          color: colors.danger,
                          borderColor: "#fecaca",
                          backgroundColor: colors.dangerSoft,
                          opacity: isMembershipSubmitting ? 0.7 : 1,
                          cursor: isMembershipSubmitting ? "default" : "pointer",
                        }}
                      >
                        Entfernen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      ) : null}
    </div>
  );
}

const sectionDescriptionStyle = {
  margin: "0.35rem 0 0 0",
  color: colors.textMuted,
  lineHeight: 1.55,
  fontSize: "0.95rem",
};

const addSectionStyle = {
  display: "grid",
  gap: "0.9rem",
  padding: "1rem",
  borderRadius: "14px",
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surfaceSoft,
};

const addGridStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 140px",
  gap: "0.9rem",
};

const addActionRowStyle = {
  display: "flex",
  justifyContent: "flex-start",
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
  gap: "0.65rem",
  flexWrap: "wrap" as const,
  justifyContent: "flex-end",
};

const compactSecondaryActionButtonStyle = {
  minHeight: "38px",
  padding: "0.55rem 0.8rem",
  borderRadius: "10px",
};

export default TeamsEditorPanel;