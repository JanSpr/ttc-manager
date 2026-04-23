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

  return (
    <Card style={{ marginTop: 0 }}>
      <div style={{ display: "grid", gap: "1rem" }}>
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

export default TeamsEditorPanel;