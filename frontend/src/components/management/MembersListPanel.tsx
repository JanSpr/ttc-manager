import MemberListItem from "./MemberListItem";
import ManagementListPanel, {
  ManagementListPanelContent,
} from "./ManagementListPanel";
import type { Member } from "../../types/member";
import { PlusIcon } from "./ManagementIcons";

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
            isEditingThisMember={editingMemberId === member.id}
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