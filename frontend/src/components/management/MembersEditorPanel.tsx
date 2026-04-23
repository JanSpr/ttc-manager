import { useState } from "react";
import Card from "../ui/Card";
import MemberForm from "./MemberForm";
import EditorSection from "./EditorSection";
import type { Member, MemberUpsertRequest } from "../../types/member";
import { colors } from "../../styles/ui";
import { EditIcon } from "./ManagementIcons";

type MembersEditorPanelProps = {
  selectedMember: Member | null;
  isSubmitting: boolean;
  onSubmit: (request: MemberUpsertRequest) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
};

function getMemberTypeLabel(type: Member["type"]): string {
  return type === "YOUTH" ? "Jugend" : "Erwachsene";
}

function getMemberInitials(member: Pick<Member, "firstName" | "lastName">): string {
  return `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`
    .toUpperCase()
    .trim() || "?";
}

function MembersEditorPanel({
  selectedMember,
  isSubmitting,
  onSubmit,
  onCancel,
  onDelete,
}: MembersEditorPanelProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const isEditMode = Boolean(selectedMember);

  return (
    <Card style={{ marginTop: 0 }}>
      <div style={{ display: "grid", gap: "1rem" }}>
        {isEditMode && selectedMember ? (
          <div style={memberSummaryCardStyle}>
            <div style={memberSummaryIconStyle}>
              {getMemberInitials(selectedMember)}
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={memberSummaryNameStyle}>{selectedMember.fullName}</div>
              <div style={memberSummaryMetaStyle}>
                ID: {selectedMember.id}
                {selectedMember.userId != null
                  ? ` · User-ID ${selectedMember.userId}`
                  : ""}
                {" · "}
                {getMemberTypeLabel(selectedMember.type)}
              </div>
            </div>
          </div>
        ) : null}

        <EditorSection
          title="Mitgliedsdaten"
          actionLabel={isDetailsOpen ? "Schließen" : "Bearbeiten"}
          actionIcon={<EditIcon />}
          isOpen={isDetailsOpen}
          onToggle={() => setIsDetailsOpen((current) => !current)}
          collapsedHint="Stammdaten und optionale User-Verknüpfung des Mitglieds bearbeiten."
        >
          <MemberForm
            member={selectedMember}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancelEdit={onCancel}
            onDelete={onDelete}
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

const memberSummaryIconStyle = {
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
  userSelect: "none" as const,
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