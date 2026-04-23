import { useState } from "react";
import type { FormEvent } from "react";
import FormField from "../../ui/FormField";
import StatusMessage from "../../ui/StatusMessage";
import type { Team, TeamType, TeamUpsertRequest } from "../../../types/team";
import {
  primaryButtonStyle,
  secondaryButtonStyle,
  textInputStyle,
} from "../../../styles/ui";
import { SaveIcon, TrashIcon } from "../common/ManagementFormIcons";
import {
  managementFormActionsWrapperStyle,
  managementFormCenteredActionsStyle,
  managementFormCompactPrimaryButtonStyle,
  managementFormCompactSecondaryButtonStyle,
  managementFormDangerButtonStyle,
  managementFormDangerRowStyle,
  managementFormDescriptionStyle,
  managementFormGridStyle,
  managementFormHeaderStyle,
  managementFormHintStyle,
  managementFormStyle,
  managementFormTitleStyle,
  managementSelectedBadgeStyle,
  managementSelectedInfoStyle,
  managementSelectedMetaStyle,
  managementSelectedNameStyle,
} from "../common/managementFormStyles";

type TeamFormProps = {
  team?: Team | null;
  isSubmitting: boolean;
  onSubmit: (request: TeamUpsertRequest) => Promise<void>;
  onCancelEdit?: () => void;
  onDelete?: () => Promise<void>;
  showHeader?: boolean;
  showSelectedInfo?: boolean;
};

type FormValues = {
  name: string;
  description: string;
  type: TeamType;
};

function createFormValues(team?: Team | null): FormValues {
  if (!team) {
    return {
      name: "",
      description: "",
      type: "ADULT",
    };
  }

  return {
    name: team.name,
    description: team.description ?? "",
    type: team.type,
  };
}

function getTeamTypeLabel(type: TeamType): string {
  return type === "YOUTH" ? "Jugend" : "Erwachsene";
}

function getTeamShortCode(team: Pick<Team, "name" | "type">): string {
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

function TeamForm({
  team,
  isSubmitting,
  onSubmit,
  onCancelEdit,
  onDelete,
  showHeader = true,
  showSelectedInfo = true,
}: TeamFormProps) {
  const [values, setValues] = useState<FormValues>(() => createFormValues(team));
  const [errorMessage, setErrorMessage] = useState("");

  const isEditMode = Boolean(team);
  const title = isEditMode ? "Mannschaft bearbeiten" : "Mannschaft anlegen";

  function updateField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function buildRequest(): TeamUpsertRequest | null {
    const name = values.name.trim();
    const description = values.description.trim();

    if (!name) {
      setErrorMessage("Bitte gib einen Mannschaftsnamen ein.");
      return null;
    }

    setErrorMessage("");

    return {
      name,
      description,
      type: values.type,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const request = buildRequest();
    if (!request) {
      return;
    }

    await onSubmit(request);

    if (!isEditMode) {
      setValues(createFormValues(null));
    }
  }

  return (
    <form onSubmit={handleSubmit} style={managementFormStyle}>
      {showHeader ? (
        <div style={managementFormHeaderStyle}>
          <div>
            <h2 style={managementFormTitleStyle}>{title}</h2>
            <p style={managementFormDescriptionStyle}>
              {isEditMode
                ? "Passe hier Name, Kategorie und Beschreibung der Mannschaft an."
                : "Lege hier eine neue Mannschaft für den Spielbetrieb oder die Planung an."}
            </p>
          </div>
        </div>
      ) : null}

      {isEditMode && team && showSelectedInfo ? (
        <div style={managementSelectedInfoStyle}>
          <div style={managementSelectedBadgeStyle}>{getTeamShortCode(team)}</div>

          <div style={{ minWidth: 0 }}>
            <div style={managementSelectedNameStyle}>{team.name}</div>
            <div style={managementSelectedMetaStyle}>
              ID: {team.id}
              {" · "}
              {getTeamTypeLabel(team.type)}
              {" · "}
              {team.memberCount}{" "}
              {team.memberCount === 1 ? "Mitglied" : "Mitglieder"}
            </div>
          </div>
        </div>
      ) : null}

      <div style={managementFormGridStyle}>
        <FormField label="Name" htmlFor="team-name">
          <input
            id="team-name"
            type="text"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            style={textInputStyle}
            placeholder="z. B. Herren I"
            disabled={isSubmitting}
          />
        </FormField>

        <FormField label="Kategorie" htmlFor="team-type">
          <select
            id="team-type"
            value={values.type}
            onChange={(event) =>
              updateField("type", event.target.value as TeamType)
            }
            style={textInputStyle}
            disabled={isSubmitting}
          >
            <option value="ADULT">Erwachsene</option>
            <option value="YOUTH">Jugend</option>
          </select>
        </FormField>
      </div>

      <FormField label="Beschreibung" htmlFor="team-description">
        <textarea
          id="team-description"
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
          style={{
            ...textInputStyle,
            resize: "vertical",
            minHeight: "120px",
            fontFamily: "inherit",
          }}
          placeholder="Optionaler Hinweis, z. B. Liga, Saison oder Besonderheiten"
          disabled={isSubmitting}
        />
      </FormField>

      <p style={managementFormHintStyle}>
        Die Beschreibung ist optional und eignet sich zum Beispiel für Liga,
        Altersklasse, Saisonhinweise oder interne Notizen.
      </p>

      {errorMessage ? (
        <StatusMessage variant="error" marginTop="0">
          {errorMessage}
        </StatusMessage>
      ) : null}

      {isEditMode ? (
        <div style={managementFormActionsWrapperStyle}>
          <div style={managementFormCenteredActionsStyle}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...primaryButtonStyle,
                ...managementFormCompactPrimaryButtonStyle,
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? "default" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.55rem",
              }}
            >
              <SaveIcon />
              <span>{isSubmitting ? "Speichern..." : "Änderungen speichern"}</span>
            </button>

            <button
              type="button"
              onClick={onCancelEdit}
              disabled={isSubmitting}
              style={{
                ...secondaryButtonStyle,
                ...managementFormCompactSecondaryButtonStyle,
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? "default" : "pointer",
              }}
            >
              Abbrechen
            </button>
          </div>

          <div style={managementFormDangerRowStyle}>
            <button
              type="button"
              onClick={() => void onDelete?.()}
              disabled={isSubmitting}
              style={{
                ...managementFormDangerButtonStyle,
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? "default" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.65rem",
              }}
            >
              <TrashIcon />
              <span>Mannschaft löschen</span>
            </button>
          </div>
        </div>
      ) : (
        <div style={managementFormActionsWrapperStyle}>
          <div style={managementFormCenteredActionsStyle}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...primaryButtonStyle,
                ...managementFormCompactPrimaryButtonStyle,
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? "default" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.55rem",
              }}
            >
              <SaveIcon />
              <span>{isSubmitting ? "Speichern..." : "Mannschaft anlegen"}</span>
            </button>

            <button
              type="button"
              onClick={onCancelEdit}
              disabled={isSubmitting}
              style={{
                ...secondaryButtonStyle,
                ...managementFormCompactSecondaryButtonStyle,
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? "default" : "pointer",
              }}
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

export default TeamForm;