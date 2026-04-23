import MemberForm from "./MemberForm";
import EditorSection from "./EditorSection";
import type { Member, MemberUpsertRequest } from "../../types/member";

type MembersEditorPanelProps = {
  selectedMember: Member | null;
  isSubmitting: boolean;
  onSubmit: (request: MemberUpsertRequest) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
};

function MembersEditorPanel({
  selectedMember,
  isSubmitting,
  onSubmit,
  onCancel,
  onDelete,
}: MembersEditorPanelProps) {
  const isEditMode = Boolean(selectedMember);

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <EditorSection
        title={isEditMode ? "Mitglied bearbeiten" : "Neues Mitglied"}
        defaultExpanded
      >
        <MemberForm
          member={selectedMember}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onCancelEdit={onCancel}
          onDelete={onDelete}
          showHeader={false}        // wichtig → Header kommt jetzt aus Section
          showSelectedInfo={true}
        />
      </EditorSection>
    </div>
  );
}

export default MembersEditorPanel;