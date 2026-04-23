import { useState } from "react";

import Card from "../../ui/Card";
import MemberAvatar from "../../MemberAvatar";
import MemberForm from "./MemberForm";
import EditorSection from "../common/EditorSection";
import type { Member, MemberUpsertRequest } from "../../../types/member";
import { colors } from "../../../styles/ui";
import { EditIcon } from "../common/ManagementIcons";

type EditorMode = "closed" | "create" | "edit";

type MembersEditorPanelProps = {
  editorMode: EditorMode;
  member: Member | null;
  isSubmitting: boolean;
  onSubmit: (request: MemberUpsertRequest) => Promise<void>;
  onCancelEdit: () => void;
  onDelete?: () => Promise<void>;
};

function getMemberTypeLabel(type: Member["type"]): string {
  return type === "YOUTH" ? "Jugend" : "Erwachsene";
}

function MembersEditorPanel({
  editorMode,
  member,
  isSubmitting,
  onSubmit,
  onCancelEdit,
  onDelete,
}: MembersEditorPanelProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(editorMode !== "closed");

  const isEditMode = editorMode === "edit" && Boolean(member);
  const isCreateMode = editorMode === "create";

  const formKey =
    editorMode === "edit"
      ? `edit-member-${member?.id ?? "unknown"}`
      : editorMode === "create"
        ? "new-member"
        : "closed-member";

  return (
    <Card style={{ marginTop: 0 }}>
      <div style={{ display: "grid", gap: "1rem" }}>
        {isEditMode && member ? (
          <div style={memberSummaryCardStyle}>
            <MemberAvatar member={member} size={42} fontSize="0.95rem" boxShadow="none" />

            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={memberSummaryNameStyle}>{member.fullName}</div>

              <div style={memberSummaryMetaStyle}>
                ID: {member.id}
                {member.userId != null ? ` · User-ID ${member.userId}` : ""}
                {" · "}
                {getMemberTypeLabel(member.type)}
              </div>
            </div>
          </div>
        ) : null}

        <EditorSection
          sectionId="member-data"
          title="Mitgliedsdaten"
          description={
            isCreateMode
              ? "Lege hier ein neues Vereinsmitglied an."
              : "Pflege hier die Stammdaten und die optionale User-Verknüpfung."
          }
          actionLabel={isDetailsOpen ? "Schließen" : isCreateMode ? "Formular öffnen" : "Bearbeiten"}
          actionIcon={<EditIcon />}
          isOpen={isDetailsOpen}
          onToggle={() => setIsDetailsOpen((current) => !current)}
          collapsedHint={
            isCreateMode
              ? "Öffne das Formular, um ein neues Mitglied anzulegen."
              : "Öffne den Bereich, um die Stammdaten dieses Mitglieds zu bearbeiten."
          }
        >
          <MemberForm
            key={formKey}
            member={editorMode === "edit" ? member : null}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancelEdit={onCancelEdit}
            onDelete={editorMode === "edit" ? onDelete : undefined}
            showHeader={false}
            showSelectedInfo={false}
          />
        </EditorSection>
      </div>
    </Card>
  );
}

const memberSummaryCardStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.85rem",
  padding: "0.9rem 1rem",
  borderRadius: "14px",
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surfaceSoft,
};

const memberSummaryNameStyle = {
  color: colors.text,
  fontWeight: 700,
  lineHeight: 1.35,
};

const memberSummaryMetaStyle = {
  marginTop: "0.2rem",
  color: colors.textMuted,
  fontSize: "0.88rem",
  lineHeight: 1.5,
};

export default MembersEditorPanel;