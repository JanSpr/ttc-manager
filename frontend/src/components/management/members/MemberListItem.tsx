import { useNavigate } from "react-router-dom";
import type { Member } from "../../../types/member";
import { colors } from "../../../styles/ui";
import MemberAvatar from "../../MemberAvatar";
import { EditIcon, EyeIcon } from "../common/ManagementIcons";
import {
  getManagementActionGroupStyle,
  managementIconOnlyActionStyle,
  managementListActionButtonStyle,
} from "../common/managementUiStyles";

type MemberListItemProps = {
  member: Member;
  isLast: boolean;
  isEditorOpen: boolean;
  isEditingThisMember: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onOpenEdit: () => void;
};

function getMemberTypeLabel(type: Member["type"]): string {
  return type === "YOUTH" ? "Jugend" : "Erwachsene";
}

function MemberListItem({
  member,
  isLast,
  isEditorOpen,
  isEditingThisMember,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onOpenEdit,
}: MemberListItemProps) {
  const navigate = useNavigate();

  const showActionsInList = !isEditorOpen && isHovered;
  const showActionsInEditor =
    isEditorOpen && (isHovered || isEditingThisMember);

  function handleOpenDetails() {
    navigate(`/members/${member.id}`);
  }

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.8rem",
        padding: "0.78rem 0.9rem",
        borderBottom: !isLast ? `1px solid ${colors.border}` : "none",
        backgroundColor: isEditingThisMember
          ? colors.primarySoft
          : colors.surface,
      }}
    >
      <MemberAvatar member={member} size={38} fontSize="0.88rem" boxShadow="none" />

      <button
        type="button"
        onClick={() => isEditorOpen && onOpenEdit()}
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
          margin: 0,
          minWidth: 0,
          flex: 1,
          textAlign: "left",
          cursor: isEditorOpen ? "pointer" : "default",
        }}
      >
        <div
          style={{
            color: colors.text,
            fontWeight: isEditingThisMember ? 800 : 700,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {member.fullName}
        </div>

        <div
          style={{
            marginTop: "0.18rem",
            color: colors.textMuted,
            fontSize: "0.84rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {getMemberTypeLabel(member.type)}
          {member.userId != null ? ` · User-ID ${member.userId}` : ""}
        </div>
      </button>

      {isEditorOpen ? (
        <div style={getManagementActionGroupStyle(showActionsInEditor)}>
          <button
            type="button"
            onClick={handleOpenDetails}
            aria-label={`${member.fullName} Details anzeigen`}
            title="Details anzeigen"
            style={managementIconOnlyActionStyle}
          >
            <EyeIcon size={15} />
          </button>

          <button
            type="button"
            onClick={onOpenEdit}
            aria-label={`${member.fullName} bearbeiten`}
            title="Mitglied bearbeiten"
            style={managementIconOnlyActionStyle}
          >
            <EditIcon size={15} />
          </button>
        </div>
      ) : (
        <div style={getManagementActionGroupStyle(showActionsInList)}>
          <button
            type="button"
            onClick={handleOpenDetails}
            aria-label={`${member.fullName} Details anzeigen`}
            title="Details anzeigen"
            style={managementListActionButtonStyle}
          >
            <EyeIcon size={15} />
            <span>Details</span>
          </button>

          <button
            type="button"
            onClick={onOpenEdit}
            aria-label={`${member.fullName} bearbeiten`}
            title="Mitglied bearbeiten"
            style={managementListActionButtonStyle}
          >
            <EditIcon size={15} />
            <span>Bearbeiten</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default MemberListItem;