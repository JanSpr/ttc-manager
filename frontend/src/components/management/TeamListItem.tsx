import { useNavigate } from "react-router-dom";
import type { CSSProperties, ReactNode } from "react";
import type { Team } from "../../types/team";
import { colors } from "../../styles/ui";

type TeamListItemProps = {
  team: Team;
  isLast: boolean;
  isEditorOpen: boolean;
  isEditingThisTeam: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onOpenEdit: () => void;
};

function getTeamTypeLabel(type: Team["type"]): string {
  return type === "YOUTH" ? "Jugend" : "Erwachsene";
}

function getTeamShortCode(team: Team): string {
  const normalizedName = team.name.trim();

  const romanMatch = normalizedName.match(
    /\b(I|II|III|IV|V|VI|VII|VIII|IX|X)\b/i
  );
  const digitMatch = normalizedName.match(/\b(\d+)\b/);

  const teamNumber = digitMatch?.[1] ?? romanMatch?.[1]?.toUpperCase() ?? "";

  if (team.type === "YOUTH") {
    return teamNumber ? `J${teamNumber}` : "J";
  }

  return teamNumber ? `H${teamNumber}` : "H";
}

/* ================= ICONS ================= */

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

function EditIcon({ size = 16 }: { size?: number }) {
  return (
    <IconWrapper size={size}>
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 20h4l10-10-4-4L4 16v4z" />
        <path d="M12 6l4 4" />
      </svg>
    </IconWrapper>
  );
}

function EyeIcon({ size = 16 }: { size?: number }) {
  return (
    <IconWrapper size={size}>
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </IconWrapper>
  );
}

/* ================= COMPONENT ================= */

function TeamListItem({
  team,
  isLast,
  isEditorOpen,
  isEditingThisTeam,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onOpenEdit,
}: TeamListItemProps) {
  const navigate = useNavigate();

  const memberLabel =
    team.memberCount === 1 ? "1 Mitglied" : `${team.memberCount} Mitglieder`;

  const showActionsInList = !isEditorOpen && isHovered;
  const showActionsInEditor =
    isEditorOpen && (isHovered || isEditingThisTeam);

  function handleOpenDetails() {
    navigate(`/teams/${team.id}`);
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
        backgroundColor: isEditingThisTeam
          ? colors.primarySoft
          : colors.surface,
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "12px",
          border: `1px solid ${colors.borderStrong}`,
          background:
            "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
          color: colors.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.88rem",
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        {getTeamShortCode(team)}
      </div>

      {/* Text */}
      <button
        type="button"
        onClick={() => isEditorOpen && onOpenEdit()}
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
          margin: 0,
          flex: 1,
          textAlign: "left",
          cursor: isEditorOpen ? "pointer" : "default",
        }}
      >
        <div style={{ fontWeight: 700 }}>{team.name}</div>
        <div style={{ fontSize: "0.85rem", color: colors.textMuted }}>
          {getTeamTypeLabel(team.type)} · {memberLabel}
        </div>
      </button>

      {/* ACTIONS */}
      {isEditorOpen ? (
        <div
          style={{
            display: "flex",
            gap: "0.45rem",
            opacity: showActionsInEditor ? 1 : 0,
            pointerEvents: showActionsInEditor ? "auto" : "none",
            transition: "opacity 0.15s",
          }}
        >
          <button
            type="button"
            onClick={handleOpenDetails}
            title="Details anzeigen"
            style={iconOnlyButton}
          >
            <EyeIcon />
          </button>

          <button
            type="button"
            onClick={onOpenEdit}
            title="Bearbeiten"
            style={iconOnlyButton}
          >
            <EditIcon />
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            gap: "0.45rem",
            opacity: showActionsInList ? 1 : 0,
            pointerEvents: showActionsInList ? "auto" : "none",
            transition: "opacity 0.15s",
          }}
        >
          <button
            type="button"
            onClick={handleOpenDetails}
            style={listActionButton}
          >
            <EyeIcon />
            <span>Details</span>
          </button>

          <button
            type="button"
            onClick={onOpenEdit}
            style={listActionButton}
          >
            <EditIcon />
            <span>Bearbeiten</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const listActionButton: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.45rem 0.7rem",
  borderRadius: "10px",
  border: `1px solid ${colors.border}`,
  background: "#fff",
  cursor: "pointer",
  fontSize: "0.85rem",
};

const iconOnlyButton: CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  border: `1px solid ${colors.border}`,
  background: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

export default TeamListItem;