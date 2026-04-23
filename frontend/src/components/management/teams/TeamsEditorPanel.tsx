import { useState } from "react";
import Card from "../../ui/Card";
import TeamForm from "./TeamForm";
import EditorSection from "../common/EditorSection";
import TeamMembershipEditorSection from "./TeamMembershipEditorSection";
import type { Member } from "../../../types/member";
import type {
  Team,
  TeamMembership,
  TeamMembershipUpsertRequest,
  TeamUpsertRequest,
} from "../../../types/team";
import { colors } from "../../../styles/ui";
import { EditIcon } from "../common/ManagementIcons";

type TeamsEditorPanelProps = {
  editorMode: "create" | "edit";
  team: Team | null;
  allMembers: Member[];
  memberships: TeamMembership[];
  membershipLoadError: string;
  isSubmitting: boolean;
  isMembershipSubmitting: boolean;
  onSubmit: (request: TeamUpsertRequest) => Promise<void>;
  onDelete?: () => Promise<void>;
  onCreateMembership: (
    request: TeamMembershipUpsertRequest
  ) => Promise<void>;
  onAssignCaptain: (memberId: number) => Promise<void>;
  onDeleteMembership: (membershipId: number) => Promise<void>;
  onSaveLineup: (memberships: TeamMembership[]) => Promise<void>;
};

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

function getCaptainName(team: Team): string | null {
  return team.memberships.find((membership) => membership.captain)?.memberFullName ?? null;
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
  onDelete,
  onCreateMembership,
  onAssignCaptain,
  onDeleteMembership,
  onSaveLineup,
}: TeamsEditorPanelProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(editorMode === "create");

  const isEditMode = editorMode === "edit" && team;
  const captainName = team ? getCaptainName(team) : null;

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

              <div style={teamSummaryCaptainStyle}>
                Mannschaftsführer: {captainName ?? "nicht gesetzt"}
              </div>
            </div>
          </div>
        ) : null}

        <EditorSection
          title="Mannschaftsdaten"
          actionLabel={isDetailsOpen ? "Schließen" : "Bearbeiten"}
          actionIcon={<EditIcon />}
          isOpen={isDetailsOpen}
          onToggle={() => setIsDetailsOpen((current) => !current)}
          collapsedHint="Name, Kategorie, Beschreibung und Mannschaftsführer bearbeiten."
        >
          <TeamForm
            key={editorMode === "edit" ? team?.id ?? "edit-team" : "new-team"}
            team={editorMode === "edit" ? team : null}
            allMembers={allMembers}
            memberships={memberships}
            isSubmitting={isSubmitting}
            isMembershipSubmitting={isMembershipSubmitting}
            onSubmit={onSubmit}
            onAssignCaptain={onAssignCaptain}
            onCancel={() => setIsDetailsOpen(false)}
            onDelete={editorMode === "edit" ? onDelete : undefined}
            onSubmitSuccess={() => setIsDetailsOpen(false)}
            showHeader={false}
            showSelectedInfo={false}
          />
        </EditorSection>

        {isEditMode ? (
          <TeamMembershipEditorSection
            allMembers={allMembers}
            memberships={memberships}
            membershipLoadError={membershipLoadError}
            isMembershipSubmitting={isMembershipSubmitting}
            onCreateMembership={onCreateMembership}
            onDeleteMembership={onDeleteMembership}
            onSaveLineup={onSaveLineup}
          />
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

const teamSummaryCaptainStyle = {
  marginTop: "0.25rem",
  color: colors.text,
  fontSize: "0.88rem",
  lineHeight: 1.5,
  fontWeight: 600,
};

export default TeamsEditorPanel;