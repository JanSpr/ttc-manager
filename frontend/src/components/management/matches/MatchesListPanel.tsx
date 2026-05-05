import ManagementListPanel, {
  ManagementListPanelContent,
} from "../common/ManagementListPanel";
import MatchListItem from "./MatchListItem";
import type { Match } from "../../../types/match";
import { PlusIcon } from "../common/ManagementIcons";

type Props = {
  matches: Match[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onCreate: () => void;
  isLoading: boolean;
  loadError: string;
  isEditorOpen: boolean;
  editingId: number | null;
  hoveredId: number | null;
  onHover: (id: number) => void;
  onLeave: (id: number) => void;
  onOpenEdit: (id: number) => void;
};

export default function MatchesListPanel({
  matches,
  searchValue,
  onSearchChange,
  onClearSearch,
  onCreate,
  isLoading,
  loadError,
  isEditorOpen,
  editingId,
  hoveredId,
  onHover,
  onLeave,
  onOpenEdit,
}: Props) {
  return (
    <ManagementListPanel
      title="Spiele"
      description="Spiele verwalten"
      countLabel={`${matches.length} Spiele`}
      searchValue={searchValue}
      searchPlaceholder="Spiel suchen..."
      onSearchChange={onSearchChange}
      onClearSearch={onClearSearch}
      createLabel="Neues Spiel"
      onCreate={onCreate}
      createIcon={<PlusIcon />}
      isLoading={isLoading}
      loadingText="Lade Spiele..."
      loadError={loadError}
      emptyText="Keine Spiele vorhanden."
      isEditorOpen={isEditorOpen}
    >
      <ManagementListPanelContent
        isEmpty={matches.length === 0}
        emptyText="Keine Spiele vorhanden."
      >
        {matches.map((match, index) => (
          <MatchListItem
            key={match.id}
            match={match}
            isLast={index === matches.length - 1}
            isEditorOpen={isEditorOpen}
            isEditing={editingId === match.id}
            isHovered={hoveredId === match.id}
            onMouseEnter={() => onHover(match.id)}
            onMouseLeave={() => onLeave(match.id)}
            onOpenEdit={() => onOpenEdit(match.id)}
          />
        ))}
      </ManagementListPanelContent>
    </ManagementListPanel>
  );
}