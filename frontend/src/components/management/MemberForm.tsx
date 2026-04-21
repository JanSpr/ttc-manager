import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import FormField from "../ui/FormField";
import StatusMessage from "../ui/StatusMessage";
import type {
  Member,
  MemberType,
  MemberUpsertRequest,
} from "../../types/member";
import {
  colors,
  primaryButtonStyle,
  secondaryButtonStyle,
  textInputStyle,
} from "../../styles/ui";

type MemberFormProps = {
  member?: Member | null;
  isSubmitting: boolean;
  onSubmit: (request: MemberUpsertRequest) => Promise<void>;
  onCancelEdit?: () => void;
};

type FormValues = {
  firstName: string;
  lastName: string;
  active: boolean;
  type: MemberType;
  userIdInput: string;
};

function createFormValues(member?: Member | null): FormValues {
  if (!member) {
    return {
      firstName: "",
      lastName: "",
      active: true,
      type: "ADULT",
      userIdInput: "",
    };
  }

  return {
    firstName: member.firstName,
    lastName: member.lastName,
    active: member.active,
    type: member.type,
    userIdInput: member.userId != null ? String(member.userId) : "",
  };
}

function MemberForm({
  member,
  isSubmitting,
  onSubmit,
  onCancelEdit,
}: MemberFormProps) {
  const [values, setValues] = useState<FormValues>(() => createFormValues(member));
  const [errorMessage, setErrorMessage] = useState("");

  const isEditMode = Boolean(member);
  const title = isEditMode ? "Mitglied bearbeiten" : "Mitglied anlegen";

  function updateField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function buildRequest(): MemberUpsertRequest | null {
    const firstName = values.firstName.trim();
    const lastName = values.lastName.trim();

    if (!firstName) {
      setErrorMessage("Bitte gib einen Vornamen ein.");
      return null;
    }

    if (!lastName) {
      setErrorMessage("Bitte gib einen Nachnamen ein.");
      return null;
    }

    let userId: number | null = null;

    if (values.userIdInput.trim() !== "") {
      const parsedUserId = Number(values.userIdInput);

      if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
        setErrorMessage("Die User-ID muss eine positive ganze Zahl sein.");
        return null;
      }

      userId = parsedUserId;
    }

    setErrorMessage("");

    return {
      firstName,
      lastName,
      active: values.active,
      type: values.type,
      userId,
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

  function handleReset() {
    setValues(createFormValues(member));
    setErrorMessage("");
  }

  return (
    <form key={member?.id ?? "new"} onSubmit={handleSubmit} style={formStyle}>
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>{title}</h2>
          <p style={descriptionStyle}>
            {isEditMode
              ? "Bearbeite die Stammdaten des ausgewählten Mitglieds."
              : "Lege ein neues Mitglied für den Verein an."}
          </p>
        </div>
      </div>

      <div style={gridStyle}>
        <FormField label="Vorname" htmlFor="member-first-name">
          <input
            id="member-first-name"
            type="text"
            value={values.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
            style={textInputStyle}
            placeholder="Max"
            disabled={isSubmitting}
          />
        </FormField>

        <FormField label="Nachname" htmlFor="member-last-name">
          <input
            id="member-last-name"
            type="text"
            value={values.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
            style={textInputStyle}
            placeholder="Mustermann"
            disabled={isSubmitting}
          />
        </FormField>

        <FormField label="Typ" htmlFor="member-type">
          <select
            id="member-type"
            value={values.type}
            onChange={(event) =>
              updateField("type", event.target.value as MemberType)
            }
            style={textInputStyle}
            disabled={isSubmitting}
          >
            <option value="ADULT">Erwachsener</option>
            <option value="YOUTH">Jugend</option>
          </select>
        </FormField>

        <FormField label="User-ID (optional)" htmlFor="member-user-id">
          <input
            id="member-user-id"
            type="number"
            min="1"
            step="1"
            value={values.userIdInput}
            onChange={(event) => updateField("userIdInput", event.target.value)}
            style={textInputStyle}
            placeholder="z. B. 12"
            disabled={isSubmitting}
          />
        </FormField>
      </div>

      <div style={checkboxRowStyle}>
        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            checked={values.active}
            onChange={(event) => updateField("active", event.target.checked)}
            disabled={isSubmitting}
          />
          <span>Mitglied ist aktiv</span>
        </label>
      </div>

      <p style={hintStyle}>
        Die optionale User-ID verknüpft dieses Mitglied mit einem vorhandenen
        Benutzerkonto.
      </p>

      {errorMessage ? (
        <StatusMessage variant="error" marginTop="0">
          {errorMessage}
        </StatusMessage>
      ) : null}

      <div style={actionsStyle}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...primaryButtonStyle,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? "default" : "pointer",
          }}
        >
          {isSubmitting
            ? "Speichern..."
            : isEditMode
              ? "Änderungen speichern"
              : "Mitglied anlegen"}
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={isSubmitting}
          style={{
            ...secondaryButtonStyle,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? "default" : "pointer",
          }}
        >
          Zurücksetzen
        </button>

        {isEditMode && onCancelEdit ? (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={isSubmitting}
            style={{
              ...secondaryButtonStyle,
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "default" : "pointer",
            }}
          >
            Bearbeiten beenden
          </button>
        ) : null}
      </div>
    </form>
  );
}

const formStyle: CSSProperties = {
  display: "grid",
  gap: "1.25rem",
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
  fontSize: "1.15rem",
  fontWeight: 800,
  color: colors.text,
};

const descriptionStyle: CSSProperties = {
  margin: "0.4rem 0 0 0",
  color: colors.textMuted,
  lineHeight: 1.6,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "1rem",
};

const checkboxRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
};

const checkboxLabelStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.65rem",
  color: colors.text,
  fontWeight: 600,
};

const hintStyle: CSSProperties = {
  margin: 0,
  color: colors.textMuted,
  fontSize: "0.95rem",
  lineHeight: 1.6,
};

const actionsStyle: CSSProperties = {
  display: "flex",
  gap: "0.75rem",
  flexWrap: "wrap",
};

export default MemberForm;