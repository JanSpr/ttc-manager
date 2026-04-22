import { useState } from "react";
import type { CSSProperties, FormEvent, ReactNode } from "react";
import FormField from "../ui/FormField";
import StatusMessage from "../ui/StatusMessage";
import type { Team, TeamType, TeamUpsertRequest } from "../../types/team";
import {
  colors,
  primaryButtonStyle,
  secondaryButtonStyle,
  textInputStyle,
} from "../../styles/ui";

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

type IconProps = {
  size?: number;
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

function SaveIcon({ size = 16 }: IconProps) {
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
        <path d="M5 3h11l3 3v15H5z" />
        <path d="M8 3v6h8V3" />
        <path d="M9 17h6" />
      </svg>
    </IconWrapper>
  );
}

function TrashIcon({ size = 17 }: IconProps) {
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
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 10v6" />
        <path d="M14 10v6" />
      </svg>
    </IconWrapper>
  );
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
    <form onSubmit={handleSubmit} style={formStyle}>
      {showHeader ? (
        <div style={headerStyle}>
          <div>
            <h2 style={titleStyle}>{title}</h2>
            <p style={descriptionStyle}>
              {isEditMode
                ? "Passe hier Name, Kategorie und Beschreibung der Mannschaft an."
                : "Lege hier eine neue Mannschaft für den Spielbetrieb oder die Planung an."}
            </p>
          </div>
        </div>
      ) : null}

      {isEditMode && team && showSelectedInfo ? (
        <div style={selectedInfoStyle}>
          <div style={selectedIconStyle}>{getTeamShortCode(team)}</div>

          <div style={{ minWidth: 0 }}>
            <div style={selectedNameStyle}>{team.name}</div>
            <div style={selectedMetaStyle}>
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

      <div style={gridStyle}>
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

      <p style={hintStyle}>
        Die Beschreibung ist optional und eignet sich zum Beispiel für Liga,
        Altersklasse, Saisonhinweise oder interne Notizen.
      </p>

      {errorMessage ? (
        <StatusMessage variant="error" marginTop="0">
          {errorMessage}
        </StatusMessage>
      ) : null}

      {isEditMode ? (
        <div style={actionsWrapperStyle}>
          <div style={centeredActionsStyle}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...primaryButtonStyle,
                ...compactPrimaryButtonStyle,
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
                ...compactSecondaryButtonStyle,
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? "default" : "pointer",
              }}
            >
              Abbrechen
            </button>
          </div>

          <div style={dangerRowStyle}>
            <button
              type="button"
              onClick={() => void onDelete?.()}
              disabled={isSubmitting}
              style={{
                ...dangerButtonStyle,
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
        <div style={actionsWrapperStyle}>
          <div style={centeredActionsStyle}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...primaryButtonStyle,
                ...compactPrimaryButtonStyle,
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
                ...compactSecondaryButtonStyle,
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

const formStyle: CSSProperties = {
  display: "grid",
  gap: "1.1rem",
};

const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "1rem",
  flexWrap: "wrap",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "1.05rem",
  fontWeight: 800,
  color: colors.text,
};

const descriptionStyle: CSSProperties = {
  margin: "0.35rem 0 0 0",
  color: colors.textMuted,
  lineHeight: 1.5,
  fontSize: "0.95rem",
};

const selectedInfoStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.85rem",
  padding: "0.9rem",
  borderRadius: "14px",
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surfaceSoft,
};

const selectedIconStyle: CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "12px",
  border: `1px solid ${colors.borderStrong}`,
  background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
  color: colors.primary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: "0.95rem",
  flexShrink: 0,
};

const selectedNameStyle: CSSProperties = {
  color: colors.text,
  fontWeight: 700,
};

const selectedMetaStyle: CSSProperties = {
  marginTop: "0.2rem",
  color: colors.textMuted,
  fontSize: "0.88rem",
  lineHeight: 1.5,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "1rem",
};

const hintStyle: CSSProperties = {
  margin: 0,
  color: colors.textMuted,
  fontSize: "0.92rem",
  lineHeight: 1.55,
};

const actionsWrapperStyle: CSSProperties = {
  display: "grid",
  gap: "0.9rem",
};

const centeredActionsStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "0.65rem",
  flexWrap: "wrap",
};

const dangerRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
};

const compactPrimaryButtonStyle: CSSProperties = {
  minHeight: "40px",
  padding: "0.62rem 0.95rem",
  borderRadius: "10px",
};

const compactSecondaryButtonStyle: CSSProperties = {
  minHeight: "40px",
  padding: "0.62rem 0.95rem",
  borderRadius: "10px",
};

const dangerButtonStyle: CSSProperties = {
  minHeight: "42px",
  padding: "0.62rem 1rem",
  borderRadius: "10px",
  border: "1px solid #fecaca",
  backgroundColor: colors.dangerSoft,
  color: colors.danger,
  fontWeight: 700,
};

export default TeamForm;