import { useNavigate } from "react-router-dom";
import type { Team } from "../../../types/team";
import { colors } from "../../../styles/ui";
import { EditIcon, EyeIcon } from "../common/ManagementIcons";
import {
  getManagementActionGroupStyle,
  managementIconOnlyActionStyle,
  managementListActionButtonStyle,
} from "../common/managementUiStyles";
import TeamAvatar from "../../ui/TeamAvatar";

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
    navigate(`/teams/${team.id}`, {
      state: {
        fromManagementTeams: true,
      },
    });
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
        backgroundColor: isEditingThisTeam ? "#dbeafe" : colors.surface,
      }}
    >
      <TeamAvatar
        teamName={team.name}
        size={38}
        borderRadius="12px"
        borderColor={colors.borderStrong}
        fontSize="0.88rem"
        fontWeight={800}
        boxShadow="none"
      />

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
          font: "inherit",
          color: "inherit",
        }}
      >
        <div style={{ fontWeight: 700 }}>{team.name}</div>

        <div style={metaTextStyle}>{memberLabel}</div>

        <div style={metaTextStyle}>MF: {captainName ?? "nicht gesetzt"}</div>
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

const metaTextStyle = {
  marginTop: "0.1rem",
  fontSize: "0.85rem",
  color: colors.textMuted,
  lineHeight: 1.3,
};

export default TeamListItem;