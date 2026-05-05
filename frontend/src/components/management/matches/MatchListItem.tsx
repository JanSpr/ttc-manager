import type { CSSProperties } from "react";
import type { Match } from "../../../types/match";
import { colors } from "../../../styles/ui";
import { EditIcon } from "../common/ManagementIcons";

type Props = {
  match: Match;
  isLast: boolean;
  isEditorOpen: boolean;
  isEditing: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onOpenEdit: () => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function MatchListItem({
  match,
  isLast,
  isEditorOpen,
  isEditing,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onOpenEdit,
}: Props) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        padding: "0.8rem 0.9rem",
        borderBottom: isLast ? "none" : `1px solid ${colors.border}`,
        backgroundColor: isEditing ? colors.surfaceSoft : "transparent",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "0.75rem",
        cursor: "pointer",
      }}
      onClick={onOpenEdit}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 700, color: colors.text }}>
          {match.teamName} vs {match.opponentName}
        </div>

        <div style={{ fontSize: "0.85rem", color: colors.textMuted }}>
          {formatDate(match.matchDateTime)}
        </div>
      </div>

      {(isHovered || isEditorOpen) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenEdit();
          }}
          style={iconButtonStyle}
        >
          <EditIcon />
        </button>
      )}
    </div>
  );
}

const iconButtonStyle: CSSProperties = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  color: colors.textMuted,
};