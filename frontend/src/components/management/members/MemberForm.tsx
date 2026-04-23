import { useState } from "react";
import type { FormEvent } from "react";
import FormField from "../../ui/FormField";
import StatusMessage from "../../ui/StatusMessage";
import type {
  Member,
  MemberType,
  MemberUpsertRequest,
} from "../../../types/member";
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

type MemberFormProps = {
  member?: Member | null;
  isSubmitting: boolean;
  onSubmit: (request: MemberUpsertRequest) => Promise<void>;
  onCancelEdit?: () => void;
  onDelete?: () => Promise<void>;
  showHeader?: boolean;
  showSelectedInfo?: boolean;
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

function getMemberTypeLabel(type: MemberType): string {
  return type === "ADULT" ? "Erwachsene" : "Jugend";
}

function getMemberInitials(member: Pick<Member, "firstName" | "lastName">): string {
  return `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`
    .toUpperCase()
    .trim() || "?";
}

function MemberForm({
  member,
  isSubmitting,
  onSubmit,
  onCancelEdit,
  onDelete,
  showHeader = true,
  showSelectedInfo = true,
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
    <form onSubmit={handleSubmit} style={managementFormStyle}>
      {showHeader ? (
        <div style={managementFormHeaderStyle}>
          <div>
            <h2 style={managementFormTitleStyle}>{title}</h2>
            <p style={managementFormDescriptionStyle}>
              {isEditMode
                ? "Passe hier Stammdaten und die optionale User-Verknüpfung des Mitglieds an."
                : "Erfasse hier ein neues Vereinsmitglied und ordne es bei Bedarf direkt einem User zu."}
            </p>
          </div>
        </div>
      ) : null}

      {isEditMode && member && showSelectedInfo ? (
        <div style={managementSelectedInfoStyle}>
          <div style={managementSelectedBadgeStyle}>
            {getMemberInitials(member)}
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={managementSelectedNameStyle}>{member.fullName}</div>
            <div style={managementSelectedMetaStyle}>
              ID: {member.id}
              {member.userId != null ? ` · User-ID: ${member.userId}` : ""}
              {" · "}
              {getMemberTypeLabel(member.type)}
            </div>
          </div>
        </div>
      ) : null}

      <div style={managementFormGridStyle}>
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
            <option value="YOUTH">Jugend</option>
          </select>
        </FormField>

        <FormField label="User-ID" htmlFor="member-user-id">
          <input
            id="member-user-id"
            type="text"
            value={values.userIdInput}
            onChange={(event) => updateField("userIdInput", event.target.value)}
            style={textInputStyle}
            placeholder="Optional"
            disabled={isSubmitting}
          />
        </FormField>
      </div>

      <p style={managementFormHintStyle}>
        Über die User-ID kannst du ein Mitglied mit einem bestehenden Login
        verknüpfen. Das Feld kann leer bleiben.
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
              <span>Mitglied löschen</span>
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
              <span>{isSubmitting ? "Speichern..." : "Mitglied anlegen"}</span>
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

export default MemberForm;