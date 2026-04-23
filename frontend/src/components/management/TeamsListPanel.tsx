import TeamListItem from "./TeamListItem";
import Card from "../ui/Card";
import StatusMessage from "../ui/StatusMessage";
import type { Team } from "../../types/team";
import {
  badgeStyle,
  cardTitleStyle,
  colors,
} from "../../styles/ui";
import { managementCreateButtonStyle, PlusIcon } from "./ManagementUi";

type TeamsListPanelProps = {
  teamCount: number;
  filteredTeams: Team[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onCreateTeam: () => void;
  isLoading: boolean;
  loadError: string;
  isEditorOpen: boolean;
  editingTeamId: number | null;
  hoveredTeamId: number | null;
  onHoverTeam: (teamId: number) => void;
  onLeaveTeam: (teamId: number) => void;
  onOpenEdit: (teamId: number) => void;
};

function TeamsListPanel({
  teamCount,
  filteredTeams,
  searchValue,
  onSearchChange,
  onClearSearch,
  onCreateTeam,
  isLoading,
  loadError,
  isEditorOpen,
  editingTeamId,
  hoveredTeamId,
  onHoverTeam,
  onLeaveTeam,
  onOpenEdit,
}: TeamsListPanelProps) {
  const teamCountLabel =
    teamCount === 1 ? "1 Mannschaft" : `${teamCount} Mannschaften`;

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
            Mannschaften
          </h2>
          <p
            style={{
              margin: 0,
              color: colors.textMuted,
              fontSize: "0.92rem",
            }}
          >
            Mannschaften auswählen, suchen und bearbeiten
          </p>
        </div>

        {!isEditorOpen ? <div style={badgeStyle}>{teamCountLabel}</div> : null}
      </div>

      <div style={{ marginBottom: "0.8rem", position: "relative" }}>
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Mannschaft suchen..."
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
          onClick={onCreateTeam}
          style={managementCreateButtonStyle}
        >
          <PlusIcon />
          <span>Neue Mannschaft</span>
        </button>
      </div>

      {isLoading ? (
        <StatusMessage marginTop="0">Lade Mannschaften...</StatusMessage>
      ) : loadError ? (
        <StatusMessage variant="error" marginTop="0">
          {loadError}
        </StatusMessage>
      ) : filteredTeams.length === 0 ? (
        <StatusMessage variant="muted" marginTop="0">
          Keine Mannschaften gefunden.
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
            {filteredTeams.map((team, index) => (
              <TeamListItem
                key={team.id}
                team={team}
                isLast={index === filteredTeams.length - 1}
                isEditorOpen={isEditorOpen}
                isEditingThisTeam={editingTeamId === team.id}
                isHovered={hoveredTeamId === team.id}
                onMouseEnter={() => onHoverTeam(team.id)}
                onMouseLeave={() => onLeaveTeam(team.id)}
                onOpenEdit={() => onOpenEdit(team.id)}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export default TeamsListPanel;