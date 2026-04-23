import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import FormField from "../../ui/FormField";
import StatusMessage from "../../ui/StatusMessage";
import type { Member } from "../../../types/member";
import type {
  Team,
  TeamMembership,
  TeamType,
  TeamUpsertRequest,
} from "../../../types/team";
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
  allMembers: Member[];
  memberships: TeamMembership[];
  isSubmitting: boolean;
  isMembershipSubmitting: boolean;
  onSubmit: (request: TeamUpsertRequest) => Promise<void>;
  onAssignCaptain: (memberId: number) => Promise<void>;
  onCancel?: () => void;
  onDelete?: () => Promise<void>;
  onSubmitSuccess?: () => void;
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
  allMembers,
  memberships,
  isSubmitting,
  isMembershipSubmitting,
  onSubmit,
  onAssignCaptain,
  onCancel,
  onDelete,
  onSubmitSuccess,
  showHeader = true,
  showSelectedInfo = true,
}: TeamFormProps) {
  const [values, setValues] = useState<FormValues>(() => createFormValues(team));
  const [errorMessage, setErrorMessage] = useState("");
  const [captainSearchValue, setCaptainSearchValue] = useState("");
  const [pendingCaptainMemberId, setPendingCaptainMemberId] = useState<
    number | null
  >(null);

  const isEditMode = Boolean(team);
  const title = isEditMode ? "Mannschaft bearbeiten" : "Mannschaft anlegen";

  const currentCaptain =
    memberships.find((membership) => membership.captain) ?? null;

  const effectiveCaptainMemberId =
    pendingCaptainMemberId ?? currentCaptain?.memberId ?? null;

  const selectedCaptain =
    allMembers.find((member) => member.id === effectiveCaptainMemberId) ?? null;

  const hasPendingCaptainChange =
    isEditMode &&
    pendingCaptainMemberId != null &&
    pendingCaptainMemberId !== (currentCaptain?.memberId ?? null);

  const filteredCaptainCandidates = useMemo(() => {
    const normalizedSearch = captainSearchValue.trim().toLocaleLowerCase("de");

    if (!normalizedSearch) {
      return [];
    }

    return [...allMembers]
      .filter((member) =>
        member.fullName.toLocaleLowerCase("de").includes(normalizedSearch)
      )
      .sort((left, right) =>
        left.fullName.localeCompare(right.fullName, "de", {
          sensitivity: "base",
        })
      );
  }, [allMembers, captainSearchValue]);

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

    try {
      await onSubmit(request);

      if (isEditMode && hasPendingCaptainChange && pendingCaptainMemberId != null) {
        await onAssignCaptain(pendingCaptainMemberId);
      }

      if (!isEditMode) {
        setValues(createFormValues(null));
        setCaptainSearchValue("");
        setPendingCaptainMemberId(null);
      }

      onSubmitSuccess?.();
    } catch (error) {
      console.error("Mannschaftsdaten konnten nicht gespeichert werden.", error);
    }
  }

  function handleCaptainSelect(memberId: number) {
    setPendingCaptainMemberId(memberId);
    setCaptainSearchValue("");
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

      {isEditMode ? (
        <div style={captainSectionStyle}>
          <FormField
            label="Mannschaftsführer"
            htmlFor="team-captain-member-search"
          >
            <div style={captainFieldWrapperStyle}>
              <div style={captainCurrentInfoStyle}>
                <span style={captainCurrentLabelStyle}>Ausgewählt:</span>
                <span style={captainCurrentValueStyle}>
                  {selectedCaptain?.fullName ??
                    currentCaptain?.memberFullName ??
                    "Nicht gesetzt"}
                </span>
                {hasPendingCaptainChange ? (
                  <span style={captainPendingBadgeStyle}>Noch nicht gespeichert</span>
                ) : null}
              </div>

              <div style={captainSearchInputWrapperStyle}>
                <input
                  id="team-captain-member-search"
                  type="text"
                  value={captainSearchValue}
                  onChange={(event) => setCaptainSearchValue(event.target.value)}
                  style={textInputStyle}
                  placeholder="Mitglied suchen und als Mannschaftsführer auswählen..."
                  disabled={isSubmitting || isMembershipSubmitting}
                />

                {captainSearchValue ? (
                  <button
                    type="button"
                    onClick={() => setCaptainSearchValue("")}
                    style={captainClearButtonStyle}
                    aria-label="Suche löschen"
                    disabled={isSubmitting || isMembershipSubmitting}
                  >
                    ✕
                  </button>
                ) : null}
              </div>

              {captainSearchValue.trim() ? (
                filteredCaptainCandidates.length > 0 ? (
                  <div style={captainResultsStyle}>
                    {filteredCaptainCandidates.slice(0, 8).map((member) => {
                      const isSelected = effectiveCaptainMemberId === member.id;
                      const isCurrentCaptain = currentCaptain?.memberId === member.id;

                      return (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => handleCaptainSelect(member.id)}
                          disabled={isSubmitting || isMembershipSubmitting}
                          style={{
                            ...captainResultButtonStyle,
                            backgroundColor: isSelected
                              ? colors.surfaceSoft
                              : "#ffffff",
                            fontWeight: isSelected ? 700 : 500,
                          }}
                        >
                          <span>{member.fullName}</span>

                          <span style={captainResultMetaStyle}>
                            {isSelected ? (
                              <span style={captainSelectedBadgeStyle}>Ausgewählt</span>
                            ) : null}
                            {!isSelected && isCurrentCaptain ? (
                              <span style={captainCurrentBadgeStyle}>Aktuell</span>
                            ) : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div style={captainEmptyStateStyle}>
                    Keine passenden Mitglieder gefunden.
                  </div>
                )
              ) : null}
            </div>
          </FormField>

          <p style={managementFormHintStyle}>
            Die Auswahl wird erst beim Speichern übernommen. Der
            Mannschaftsführer kann auch gesetzt werden, wenn die Person nicht als
            Spieler in der Mannschaft geführt wird.
          </p>
        </div>
      ) : null}

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
              disabled={isSubmitting || isMembershipSubmitting}
              style={{
                ...primaryButtonStyle,
                ...managementFormCompactPrimaryButtonStyle,
                opacity: isSubmitting || isMembershipSubmitting ? 0.7 : 1,
                cursor:
                  isSubmitting || isMembershipSubmitting ? "default" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.55rem",
              }}
            >
              <SaveIcon />
              <span>
                {isSubmitting || isMembershipSubmitting
                  ? "Speichern..."
                  : "Änderungen speichern"}
              </span>
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting || isMembershipSubmitting}
              style={{
                ...secondaryButtonStyle,
                ...managementFormCompactSecondaryButtonStyle,
                opacity: isSubmitting || isMembershipSubmitting ? 0.7 : 1,
                cursor:
                  isSubmitting || isMembershipSubmitting ? "default" : "pointer",
              }}
            >
              Abbrechen
            </button>
          </div>

          <div style={managementFormDangerRowStyle}>
            <button
              type="button"
              onClick={() => void onDelete?.()}
              disabled={isSubmitting || isMembershipSubmitting}
              style={{
                ...managementFormDangerButtonStyle,
                opacity: isSubmitting || isMembershipSubmitting ? 0.7 : 1,
                cursor:
                  isSubmitting || isMembershipSubmitting ? "default" : "pointer",
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
        </div>
      )}
    </form>
  );
}

const captainSectionStyle = {
  display: "grid",
  gap: "0.45rem",
};

const captainFieldWrapperStyle = {
  display: "grid",
  gap: "0.65rem",
};

const captainCurrentInfoStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  alignItems: "center",
  gap: "0.45rem",
  padding: "0.8rem 0.95rem",
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surfaceSoft,
};

const captainCurrentLabelStyle = {
  color: colors.textMuted,
  fontSize: "0.9rem",
  fontWeight: 600,
};

const captainCurrentValueStyle = {
  color: colors.text,
  fontWeight: 700,
};

const captainPendingBadgeStyle = {
  flexShrink: 0,
  padding: "0.18rem 0.5rem",
  borderRadius: "999px",
  backgroundColor: "#fef3c7",
  color: "#92400e",
  fontSize: "0.78rem",
  fontWeight: 700,
};

const captainSearchInputWrapperStyle = {
  position: "relative" as const,
};

const captainClearButtonStyle = {
  position: "absolute" as const,
  top: "50%",
  right: "0.85rem",
  transform: "translateY(-50%)",
  border: "none",
  background: "transparent",
  color: colors.textMuted,
  cursor: "pointer",
  fontSize: "0.95rem",
  lineHeight: 1,
  padding: 0,
};

const captainResultsStyle = {
  display: "grid",
  gap: "0.35rem",
  padding: "0.45rem",
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
  backgroundColor: "#ffffff",
};

const captainResultButtonStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.75rem",
  width: "100%",
  padding: "0.7rem 0.85rem",
  borderRadius: "10px",
  border: `1px solid ${colors.border}`,
  color: colors.text,
  textAlign: "left" as const,
  cursor: "pointer",
};

const captainResultMetaStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  flexShrink: 0,
};

const captainSelectedBadgeStyle = {
  padding: "0.18rem 0.5rem",
  borderRadius: "999px",
  backgroundColor: colors.surfaceSoft,
  color: colors.primary,
  fontSize: "0.78rem",
  fontWeight: 700,
};

const captainCurrentBadgeStyle = {
  padding: "0.18rem 0.5rem",
  borderRadius: "999px",
  backgroundColor: "#eef2ff",
  color: "#4338ca",
  fontSize: "0.78rem",
  fontWeight: 700,
};

const captainEmptyStateStyle = {
  padding: "0.8rem 0.95rem",
  borderRadius: "12px",
  border: `1px dashed ${colors.border}`,
  color: colors.textMuted,
  fontSize: "0.92rem",
  backgroundColor: colors.surfaceSoft,
};

export default TeamForm;