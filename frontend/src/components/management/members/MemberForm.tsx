import { useState } from "react";
import type { FormEvent } from "react";
import FormField from "../../ui/FormField";
import StatusMessage from "../../ui/StatusMessage";
import MemberAvatar from "../../MemberAvatar";
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
  createUserAccount: boolean;
};

function createFormValues(member?: Member | null): FormValues {
  if (!member) {
    return {
      firstName: "",
      lastName: "",
      type: "ADULT",
      userIdInput: "",
      createUserAccount: true,
    };
  }

  return {
    firstName: member.firstName,
    lastName: member.lastName,
    type: member.type,
    userIdInput: member.userId != null ? String(member.userId) : "",
    createUserAccount: false,
  };
}

function getMemberTypeLabel(type: MemberType): string {
  return type === "ADULT" ? "Erwachsene" : "Jugend";
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
  const [values, setValues] = useState<FormValues>(() =>
    createFormValues(member)
  );
  const [errorMessage, setErrorMessage] = useState("");

  const isEditMode = Boolean(member);
  const title = isEditMode ? "Mitglied bearbeiten" : "Mitglied anlegen";
  const canPrepareUserAccount = !isEditMode && values.userIdInput.trim() === "";

  function updateField<K extends keyof FormValues>(
    key: K,
    value: FormValues[K]
  ) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleUserIdInputChange(value: string) {
    setValues((current) => ({
      ...current,
      userIdInput: value,
      createUserAccount:
        value.trim() === "" ? current.createUserAccount : false,
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

    if (userId != null && values.createUserAccount) {
      setErrorMessage(
        "Bitte wähle entweder eine bestehende User-ID oder bereite ein neues Benutzerkonto vor."
      );
      return null;
    }

    setErrorMessage("");

    return {
      firstName,
      lastName,
      type: values.type,
      userId,
      createUserAccount: canPrepareUserAccount
        ? values.createUserAccount
        : false,
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
                : "Erfasse hier ein neues Vereinsmitglied und bereite standardmäßig direkt ein Benutzerkonto vor."}
            </p>
          </div>
        </div>
      ) : null}

      {isEditMode && member && showSelectedInfo ? (
        <div style={managementSelectedInfoStyle}>
          <MemberAvatar
            member={member}
            size={42}
            fontSize="0.95rem"
            boxShadow="none"
          />

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
            onChange={(event) => handleUserIdInputChange(event.target.value)}
            style={textInputStyle}
            placeholder="Optional"
            disabled={isSubmitting}
          />
        </FormField>
      </div>

      {!isEditMode ? (
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.6rem",
            fontSize: "0.92rem",
            lineHeight: 1.45,
            cursor: isSubmitting || values.userIdInput.trim() !== "" ? "default" : "pointer",
            opacity: values.userIdInput.trim() !== "" ? 0.65 : 1,
          }}
        >
          <input
            type="checkbox"
            checked={values.createUserAccount}
            onChange={(event) =>
              updateField("createUserAccount", event.target.checked)
            }
            disabled={isSubmitting || values.userIdInput.trim() !== ""}
            style={{ marginTop: "0.2rem" }}
          />
          <span>
            <strong>Benutzerkonto vorbereiten</strong>
            <br />
            Standardmäßig wird direkt ein Login-Konto ohne E-Mail und Passwort
            angelegt. Der Zugriff wird später über einen Aktivierungscode
            eingerichtet.
          </span>
        </label>
      ) : null}

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
              <span>
                {isSubmitting ? "Speichern..." : "Änderungen speichern"}
              </span>
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
                gap: "0.45rem",
              }}
            >
              <TrashIcon />
              <span>Mitglied löschen</span>
            </button>
          </div>
        </div>
      ) : (
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
        </div>
      )}
    </form>
  );
}

export default MemberForm;