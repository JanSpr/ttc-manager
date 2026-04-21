import Card from "../ui/Card";
import MemberForm from "./MemberForm";
import type { Member, MemberUpsertRequest } from "../../types/member";

type MembersEditorPanelProps = {
  editorMode: "create" | "edit";
  member: Member | null;
  isSubmitting: boolean;
  onSubmit: (request: MemberUpsertRequest) => Promise<void>;
  onCancelEdit: () => void;
  onDelete?: () => Promise<void>;
};

function MembersEditorPanel({
  editorMode,
  member,
  isSubmitting,
  onSubmit,
  onCancelEdit,
  onDelete,
}: MembersEditorPanelProps) {
  return (
    <Card style={{ marginTop: 0 }}>
      <MemberForm
        key={editorMode === "edit" ? member?.id ?? "edit-member" : "new-member"}
        member={editorMode === "edit" ? member : null}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        onCancelEdit={onCancelEdit}
        onDelete={editorMode === "edit" ? onDelete : undefined}
      />
    </Card>
  );
}

export default MembersEditorPanel;