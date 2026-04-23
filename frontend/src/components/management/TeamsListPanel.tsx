import TeamListItem from "./TeamListItem";
import ManagementListPanel, {
  ManagementListPanelContent,
} from "./ManagementListPanel";
import type { Team } from "../../types/team";
import { PlusIcon } from "./ManagementIcons";

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
    <ManagementListPanel
      title="Mannschaften"
      description="Mannschaften auswählen, suchen und bearbeiten"
      countLabel={teamCountLabel}
      searchValue={searchValue}
      searchPlaceholder="Mannschaft suchen..."
      onSearchChange={onSearchChange}
      onClearSearch={onClearSearch}
      createLabel="Neue Mannschaft"
      onCreate={onCreateTeam}
      createIcon={<PlusIcon />}
      isLoading={isLoading}
      loadingText="Lade Mannschaften..."
      loadError={loadError}
      emptyText="Keine Mannschaften gefunden."
      isEditorOpen={isEditorOpen}
    >
      <ManagementListPanelContent
        isEmpty={filteredTeams.length === 0}
        emptyText="Keine Mannschaften gefunden."
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
      </ManagementListPanelContent>
    </ManagementListPanel>
  );
}

export default TeamsListPanel;