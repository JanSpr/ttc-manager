import { useState } from "react";
import type { FormEvent } from "react";
import FormField from "../../ui/FormField";
import StatusMessage from "../../ui/StatusMessage";
import type { Match, MatchUpsertRequest } from "../../../types/match";
import type { Team } from "../../../types/team";
import {
  colors,
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
  managementFormStyle,
  managementFormTitleStyle,
} from "../common/managementFormStyles";

type Props = {
  match?: Match | null;
  teams: Team[];
  onSubmit: (request: MatchUpsertRequest) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  isSubmitting: boolean;
};

type FormValues = {
  teamId: number;
  opponentName: string;
  competition: string;
  matchDateTime: string;
  location: string;
  homeMatch: boolean;
  notes: string;
};

function toDateTimeLocalValue(value?: string | null): string {
  if (!value) return "";
  return value.slice(0, 16);
}

function createFormValues(match: Match | null | undefined, teams: Team[]): FormValues {
  return {
    teamId: match?.teamId ?? teams[0]?.id ?? 0,
    opponentName: match?.opponentName ?? "",
    competition: match?.competition ?? "",
    matchDateTime: toDateTimeLocalValue(match?.matchDateTime),
    location: match?.location ?? "",
    homeMatch: match?.homeMatch ?? true,
    notes: match?.notes ?? "",
  };
}

export default function MatchForm({
  match,
  teams,
  onSubmit,
  onCancel,
  onDelete,
  isSubmitting,
}: Props) {
  const [values, setValues] = useState<FormValues>(() =>
    createFormValues(match, teams)
  );
  const [errorMessage, setErrorMessage] = useState("");

  const isEditMode = Boolean(match);

  function updateField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function buildRequest(): MatchUpsertRequest | null {
    const opponentName = values.opponentName.trim();
    const matchDateTime = values.matchDateTime.trim();

    if (!values.teamId) {
      setErrorMessage("Bitte wähle eine Mannschaft aus.");
      return null;
    }

    if (!opponentName) {
      setErrorMessage("Bitte gib einen Gegner ein.");
      return null;
    }

    if (!matchDateTime) {
      setErrorMessage("Bitte gib Datum und Uhrzeit an.");
      return null;
    }

    setErrorMessage("");

    return {
      teamId: values.teamId,
      opponentName,
      competition: values.competition.trim() || null,
      matchDateTime,
      location: values.location.trim() || null,
      homeMatch: values.homeMatch,
      notes: values.notes.trim() || null,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const request = buildRequest();
    if (!request) return;

    await onSubmit(request);
  }

  return (
    <form onSubmit={handleSubmit} style={managementFormStyle}>
      <div style={managementFormHeaderStyle}>
        <div>
          <h2 style={managementFormTitleStyle}>
            {isEditMode ? "Spiel bearbeiten" : "Spiel anlegen"}
          </h2>
          <p style={managementFormDescriptionStyle}>
            Erfasse hier Mannschaft, Gegner, Wettbewerb, Termin und Spielort.
          </p>
        </div>
      </div>

      <div style={managementFormGridStyle}>
        <FormField label="Mannschaft" htmlFor="match-team">
          <select
            id="match-team"
            value={values.teamId}
            onChange={(event) => updateField("teamId", Number(event.target.value))}
            style={textInputStyle}
            disabled={isSubmitting || teams.length === 0}
          >
            {teams.length === 0 ? (
              <option value={0}>Keine Mannschaft vorhanden</option>
            ) : null}

            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Gegner" htmlFor="match-opponent">
          <input
            id="match-opponent"
            type="text"
            value={values.opponentName}
            onChange={(event) => updateField("opponentName", event.target.value)}
            style={textInputStyle}
            placeholder="z. B. TTC Beispielstadt"
            disabled={isSubmitting}
          />
        </FormField>
      </div>

      <div style={managementFormGridStyle}>
        <FormField label="Wettbewerb / Liga" htmlFor="match-competition">
          <input
            id="match-competition"
            type="text"
            value={values.competition}
            onChange={(event) => updateField("competition", event.target.value)}
            style={textInputStyle}
            placeholder="z. B. Bezirksliga, Kreisliga, Pokal"
            disabled={isSubmitting}
          />
        </FormField>

        <FormField label="Datum und Uhrzeit" htmlFor="match-date-time">
          <input
            id="match-date-time"
            type="datetime-local"
            value={values.matchDateTime}
            onChange={(event) => updateField("matchDateTime", event.target.value)}
            style={textInputStyle}
            disabled={isSubmitting}
          />
        </FormField>
      </div>

      <div style={managementFormGridStyle}>
        <FormField label="Spielort" htmlFor="match-location">
          <input
            id="match-location"
            type="text"
            value={values.location}
            onChange={(event) => updateField("location", event.target.value)}
            style={textInputStyle}
            placeholder="Optionaler Ort"
            disabled={isSubmitting}
          />
        </FormField>

        <FormField label="Spielart" htmlFor="match-home">
          <label style={checkboxRowStyle}>
            <input
              id="match-home"
              type="checkbox"
              checked={values.homeMatch}
              onChange={(event) => updateField("homeMatch", event.target.checked)}
              disabled={isSubmitting}
            />
            <span>Heimspiel</span>
          </label>
        </FormField>
      </div>

      <FormField label="Notizen" htmlFor="match-notes">
        <textarea
          id="match-notes"
          value={values.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          style={{
            ...textInputStyle,
            resize: "vertical",
            minHeight: "92px",
            fontFamily: "inherit",
          }}
          placeholder="Optionale Hinweise zum Spiel"
          disabled={isSubmitting}
        />
      </FormField>

      {errorMessage ? (
        <StatusMessage variant="error" marginTop="0">
          {errorMessage}
        </StatusMessage>
      ) : null}

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
            <span>{isSubmitting ? "Speichern..." : "Spiel speichern"}</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
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

        {onDelete ? (
          <div style={managementFormDangerRowStyle}>
            <button
              type="button"
              onClick={() => void onDelete()}
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
              <span>Spiel löschen</span>
            </button>
          </div>
        ) : null}
      </div>
    </form>
  );
}

const checkboxRowStyle = {
  minHeight: "46px",
  display: "flex",
  alignItems: "center",
  gap: "0.55rem",
  padding: "0 0.15rem",
  color: colors.text,
  fontWeight: 700,
};