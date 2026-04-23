import type { ReactNode } from "react";
import MemberListItem from "./MemberListItem";
import ManagementListPanel, {
  ManagementListPanelContent,
} from "./ManagementListPanel";
import type { Member } from "../../types/member";

type MembersListPanelProps = {
  memberCount: number;
  filteredMembers: Member[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onCreateMember: () => void;
  isLoading: boolean;
  loadError: string;
  isEditorOpen: boolean;
  editingMemberId: number | null;
  hoveredMemberId: number | null;
  onHoverMember: (memberId: number) => void;
  onLeaveMember: (memberId: number) => void;
  onOpenEdit: (memberId: number) => void;
};

function IconWrapper({
  children,
  size = 16,
}: {
  children: ReactNode;
  size?: number;
}) {
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
      {children}
    </span>
  );
}

function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <IconWrapper size={size}>
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
    </IconWrapper>
  );
}

function MembersListPanel({
  memberCount,
  filteredMembers,
  searchValue,
  onSearchChange,
  onClearSearch,
  onCreateMember,
  isLoading,
  loadError,
  isEditorOpen,
  editingMemberId,
  hoveredMemberId,
  onHoverMember,
  onLeaveMember,
  onOpenEdit,
}: MembersListPanelProps) {
  const memberCountLabel =
    memberCount === 1 ? "1 Mitglied" : `${memberCount} Mitglieder`;

  return (
    <ManagementListPanel
      title="Mitglieder"
      description="Mitglieder auswählen, suchen und bearbeiten"
      countLabel={memberCountLabel}
      searchValue={searchValue}
      searchPlaceholder="Mitglied suchen..."
      onSearchChange={onSearchChange}
      onClearSearch={onClearSearch}
      createLabel="Neues Mitglied"
      onCreate={onCreateMember}
      createIcon={<PlusIcon />}
      isLoading={isLoading}
      loadingText="Lade Mitglieder..."
      loadError={loadError}
      emptyText="Keine Mitglieder gefunden."
      isEditorOpen={isEditorOpen}
    >
      <ManagementListPanelContent
        isEmpty={filteredMembers.length === 0}
        emptyText="Keine Mitglieder gefunden."
      >
        {filteredMembers.map((member, index) => (
          <MemberListItem
            key={member.id}
            member={member}
            isLast={index === filteredMembers.length - 1}
            isEditorOpen={isEditorOpen}
            isEditingThisMember={member.id === editingMemberId}
            isHovered={hoveredMemberId === member.id}
            onMouseEnter={() => onHoverMember(member.id)}
            onMouseLeave={() => onLeaveMember(member.id)}
            onOpenEdit={() => onOpenEdit(member.id)}
          />
        ))}
      </ManagementListPanelContent>
    </ManagementListPanel>
  );
}

export default MembersListPanel;