import { useNavigate } from "react-router-dom";
import type { Team } from "../../../types/team";
import { colors } from "../../../styles/ui";
import { EditIcon, EyeIcon } from "../common/ManagementIcons";
import {
  getManagementActionGroupStyle,
  managementIconOnlyActionStyle,
  managementListActionButtonStyle,
} from "../common/managementUiStyles";

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

function getCaptainName(team: Team): string | null {
  return (
    team.memberships.find((membership) => membership.captain)?.memberFullName ??
    null
  );
}

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

  const captainName = getCaptainName(team);

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
      <div
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "12px",
          border: `1px solid ${colors.borderStrong}`,
          background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
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

        <div style={captainRowStyle}>
          <span style={captainLabelStyle}>Mannschaftsführer</span>

          {captainName ? (
            <span style={captainValueStyle}>{captainName}</span>
          ) : (
            <span style={captainMissingStyle}>nicht gesetzt</span>
          )}
        </div>
      </button>

      {isEditorOpen ? (
        <div style={getManagementActionGroupStyle(showActionsInEditor)}>
          <button
            type="button"
            onClick={handleOpenDetails}
            title="Details anzeigen"
            style={managementIconOnlyActionStyle}
          >
            <EyeIcon />
          </button>

          <button
            type="button"
            onClick={onOpenEdit}
            title="Bearbeiten"
            style={managementIconOnlyActionStyle}
          >
            <EditIcon />
          </button>
        </div>
      ) : (
        <div style={getManagementActionGroupStyle(showActionsInList)}>
          <button
            type="button"
            onClick={handleOpenDetails}
            style={managementListActionButtonStyle}
          >
            <EyeIcon />
            <span>Details</span>
          </button>

          <button
            type="button"
            onClick={onOpenEdit}
            style={managementListActionButtonStyle}
          >
            <EditIcon />
            <span>Bearbeiten</span>
          </button>
        </div>
      )}
    </div>
  );
}

const captainRowStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  alignItems: "center",
  gap: "0.4rem",
  marginTop: "0.3rem",
};

const captainLabelStyle = {
  color: colors.textMuted,
  fontSize: "0.8rem",
  fontWeight: 600,
};

const captainValueStyle = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "1.5rem",
  padding: "0.12rem 0.5rem",
  borderRadius: "999px",
  backgroundColor: colors.surfaceSoft,
  color: colors.text,
  fontSize: "0.8rem",
  fontWeight: 600,
};

const captainMissingStyle = {
  color: colors.textMuted,
  fontSize: "0.8rem",
};

export default TeamListItem;