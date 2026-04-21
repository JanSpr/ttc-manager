import Card from "../ui/Card";
import TeamForm from "./TeamForm";
import type { Team, TeamUpsertRequest } from "../../types/team";

type TeamsEditorPanelProps = {
  editorMode: "create" | "edit";
  team: Team | null;
  isSubmitting: boolean;
  onSubmit: (request: TeamUpsertRequest) => Promise<void>;
  onCancelEdit: () => void;
  onDelete?: () => Promise<void>;
};

function TeamsEditorPanel({
  editorMode,
  team,
  isSubmitting,
  onSubmit,
  onCancelEdit,
  onDelete,
}: TeamsEditorPanelProps) {
  return (
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
  );
}

export default TeamsEditorPanel;