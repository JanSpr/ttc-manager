import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import type { Member } from "../../types/member";
import { colors } from "../../styles/ui";

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
  const initials =
    `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`
      .toUpperCase()
      .trim() || "?";

  const memberTypeLabel =
    member.type === "ADULT" ? "Erwachsene" : "Jugendliche";

  const mannschaftenLabel =
    member.teamIds.length === 1
      ? "1 Mannschaft"
      : `${member.teamIds.length} Mannschaften`;

  const showActionsInListOnly = !isEditorOpen && isHovered;
  const showEyeInEditor = isEditorOpen && (isHovered || isEditingThisMember);

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
      <div
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "999px",
          border: `1px solid ${colors.borderStrong}`,
          background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
          color: colors.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: "0.88rem",
          flexShrink: 0,
          userSelect: "none",
        }}
      >
        {initials}
      </div>

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
          {memberTypeLabel}
          {" · "}
          {mannschaftenLabel}
        </div>
      </button>

      <div
        style={{
          display: "flex",
          gap: "0.45rem",
          flexShrink: 0,
        }}
      >
        {isEditorOpen ? (
          <Link
            to={`/members/${member.id}`}
            state={{ fromManagement: true }}
            aria-label={`${member.fullName} öffnen`}
            title="Details öffnen"
            style={{
              ...iconOnlyActionStyle,
              opacity: showEyeInEditor ? 1 : 0,
              pointerEvents: showEyeInEditor ? "auto" : "none",
              transition: "opacity 0.15s ease",
            }}
          >
            👁
          </Link>
        ) : (
          <div
            style={{
              display: "flex",
              gap: "0.45rem",
              opacity: showActionsInListOnly ? 1 : 0,
              pointerEvents: showActionsInListOnly ? "auto" : "none",
              transition: "opacity 0.15s ease",
            }}
          >
            <Link
              to={`/members/${member.id}`}
              state={{ fromManagement: true }}
              aria-label={`${member.fullName} öffnen`}
              title="Details öffnen"
              style={{
                ...listActionButtonStyle,
                textDecoration: "none",
              }}
            >
              <span style={listActionIconStyle}>👁</span>
              <span>Details</span>
            </Link>

            <button
              type="button"
              onClick={onOpenEdit}
              aria-label={`${member.fullName} bearbeiten`}
              title="Mitglied bearbeiten"
              style={listActionButtonStyle}
            >
              <span style={listActionIconStyle}>✎</span>
              <span>Bearbeiten</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const listActionButtonStyle: CSSProperties = {
  minHeight: "36px",
  padding: "0.48rem 0.72rem",
  borderRadius: "10px",
  border: `1px solid ${colors.border}`,
  backgroundColor: "#ffffff",
  color: colors.textMuted,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  fontSize: "0.88rem",
  fontWeight: 600,
  cursor: "pointer",
};

const listActionIconStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "16px",
};

const iconOnlyActionStyle: CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  border: `1px solid ${colors.border}`,
  backgroundColor: "#ffffff",
  color: colors.textMuted,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  fontSize: "0.95rem",
};

export default MemberListItem;