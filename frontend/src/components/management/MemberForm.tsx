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
  onDelete?: () => Promise<void>;
};

type FormValues = {
  firstName: string;
  lastName: string;
  type: MemberType;
  userIdInput: string;
};

function createFormValues(member?: Member | null): FormValues {
  if (!member) {
    return {
      firstName: "",
      lastName: "",
      type: "ADULT",
      userIdInput: "",
    };
  }

  return {
    firstName: member.firstName,
    lastName: member.lastName,
    type: member.type,
    userIdInput: member.userId != null ? String(member.userId) : "",
  };
}

function MemberForm({
  member,
  isSubmitting,
  onSubmit,
  onCancelEdit,
  onDelete,
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
      type: values.type,
      userId,
      active: member?.active ?? true,
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
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>{title}</h2>
          <p style={descriptionStyle}>
            {isEditMode
              ? "Du bearbeitest gerade das ausgewählte Mitglied."
              : "Lege ein neues Mitglied für den Verein an."}
          </p>
        </div>
      </div>

      {isEditMode && member ? (
        <div style={selectedInfoStyle}>
          <div style={selectedAvatarStyle}>
            {`${member.firstName.charAt(0)}${member.lastName.charAt(0)}`
              .toUpperCase()
              .trim() || "?"}
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={selectedNameStyle}>{member.fullName}</div>
            <div style={selectedMetaStyle}>
              ID: {member.id}
              {member.userId != null ? ` · User-ID: ${member.userId}` : ""}
              {" · "}
              {member.type === "ADULT" ? "Erwachsene" : "Jugendliche"}
            </div>
          </div>
        </div>
      ) : null}

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

        <FormField label="Kategorie" htmlFor="member-type">
          <select
            id="member-type"
            value={values.type}
            onChange={(event) =>
              updateField("type", event.target.value as MemberType)
            }
            style={textInputStyle}
            disabled={isSubmitting}
          >
            <option value="ADULT">Erwachsene</option>
            <option value="YOUTH">Jugendliche</option>
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

      <p style={hintStyle}>
        Die optionale User-ID verknüpft dieses Mitglied mit einem vorhandenen
        Benutzerkonto.
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
              }}
            >
              {isSubmitting ? "Speichern..." : "Änderungen speichern"}
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
              }}
            >
              Mitglied löschen
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
              }}
            >
              {isSubmitting ? "Speichern..." : "Mitglied anlegen"}
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

const selectedAvatarStyle: CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "999px",
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
  minHeight: "40px",
  padding: "0.62rem 0.95rem",
  borderRadius: "10px",
  border: "1px solid #fecaca",
  backgroundColor: colors.dangerSoft,
  color: colors.danger,
  fontWeight: 700,
};

export default MemberForm;