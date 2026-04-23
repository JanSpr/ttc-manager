import MemberListItem from "./MemberListItem";
import Card from "../ui/Card";
import StatusMessage from "../ui/StatusMessage";
import type { Member } from "../../types/member";
import { badgeStyle, cardTitleStyle, colors } from "../../styles/ui";
import { PlusIcon } from "./ManagementIcons";
import { managementCreateButtonStyle } from "./managementUiStyles";

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
    <Card style={{ marginTop: 0 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: isEditorOpen ? "flex-start" : "center",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginBottom: "0.9rem",
        }}
      >
        <div>
          <h2 style={{ ...cardTitleStyle, marginBottom: "0.2rem" }}>
            Mitglieder
          </h2>
          <p
            style={{
              margin: 0,
              color: colors.textMuted,
              fontSize: "0.92rem",
            }}
          >
            Mitglieder auswählen, suchen und bearbeiten
          </p>
        </div>

        {!isEditorOpen ? <div style={badgeStyle}>{memberCountLabel}</div> : null}
      </div>

      <div style={{ marginBottom: "0.8rem", position: "relative" }}>
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Mitglied suchen..."
          style={{
            width: "100%",
            padding: "11px 36px 11px 13px",
            borderRadius: "12px",
            border: `1px solid ${colors.borderStrong}`,
            backgroundColor: "#ffffff",
            color: colors.text,
            boxSizing: "border-box",
          }}
        />

        {searchValue ? (
          <button
            type="button"
            onClick={onClearSearch}
            aria-label="Suche zurücksetzen"
            title="Suche zurücksetzen"
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "24px",
              height: "24px",
              borderRadius: "999px",
              border: "none",
              background: "transparent",
              color: colors.textMuted,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.55rem",
          flexWrap: "wrap",
          marginBottom: "0.9rem",
        }}
      >
        <button
          type="button"
          onClick={onCreateMember}
          style={managementCreateButtonStyle}
        >
          <PlusIcon />
          <span>Neues Mitglied</span>
        </button>
      </div>

      {isLoading ? (
        <StatusMessage marginTop="0">Lade Mitglieder...</StatusMessage>
      ) : loadError ? (
        <StatusMessage variant="error" marginTop="0">
          {loadError}
        </StatusMessage>
      ) : filteredMembers.length === 0 ? (
        <StatusMessage variant="muted" marginTop="0">
          Keine Mitglieder gefunden.
        </StatusMessage>
      ) : (
        <div
          style={{
            border: `1px solid ${colors.border}`,
            borderRadius: "14px",
            overflow: "hidden",
            backgroundColor: colors.surfaceSoft,
          }}
        >
          <div
            style={{
              maxHeight: "540px",
              overflowY: "auto",
            }}
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
          </div>
        </div>
      )}
    </Card>
  );
}

export default MembersListPanel;