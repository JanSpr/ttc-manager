import { useState, type CSSProperties, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { updateOwnUser } from "../api/userApi";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";
import UserAvatar from "../components/UserAvatar";
import PageIntro from "../components/layout/PageIntro";
import Card from "../components/ui/Card";
import DataField from "../components/ui/DataField";
import {
  badgeStyle,
  colors,
  primaryButtonStyle,
  secondaryButtonStyle,
  textInputStyle,
} from "../styles/ui";

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

function EditIcon({ size = 16 }: { size?: number }) {
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
        <path d="M4 20h4l10-10-4-4L4 16v4z" />
        <path d="M12 6l4 4" />
      </svg>
    </IconWrapper>
  );
}

function SaveIcon({ size = 16 }: { size?: number }) {
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

function UserProfilePage() {
  const { user, isAuthenticated, updateAuthenticatedUser } = useAuth();
  const { showToast } = useToast();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const currentUser = user;

  const displayName =
    [currentUser.firstName, currentUser.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || currentUser.username;

  function handleStartProfileEdit() {
    setEmailInput(currentUser.email ?? "");
    setPasswordInput("");
    setIsEditingProfile(true);
  }

  function handleCancelProfileEdit() {
    setEmailInput(currentUser.email ?? "");
    setPasswordInput("");
    setIsEditingProfile(false);
  }

  async function handleSaveProfile() {
    const normalizedEmail = emailInput.trim();
    const normalizedPassword = passwordInput.trim();

    if (!normalizedEmail) {
      showToast("Bitte gib eine E-Mail-Adresse ein.", "error");
      return;
    }

    const emailChanged = normalizedEmail !== (currentUser.email ?? "");
    const passwordChanged = normalizedPassword.length > 0;

    if (!emailChanged && !passwordChanged) {
      setIsEditingProfile(false);
      return;
    }

    try {
      setIsSavingProfile(true);

      const updatedUser = await updateOwnUser({
        email: normalizedEmail,
        ...(passwordChanged ? { password: normalizedPassword } : {}),
      });

      updateAuthenticatedUser(updatedUser);
      setEmailInput(updatedUser.email ?? "");
      setPasswordInput("");
      setIsEditingProfile(false);

      if (emailChanged && passwordChanged) {
        showToast("E-Mail-Adresse und Passwort erfolgreich aktualisiert.", "success");
      } else if (emailChanged) {
        showToast("E-Mail-Adresse erfolgreich aktualisiert.", "success");
      } else {
        showToast("Passwort erfolgreich aktualisiert.", "success");
      }
    } catch (error) {
      console.error(error);
      showToast(
        error instanceof Error
          ? error.message
          : "Die Profiländerungen konnten nicht gespeichert werden.",
        "error",
      );
    } finally {
      setIsSavingProfile(false);
    }
  }

  return (
    <div>
      <PageIntro
        title="Benutzerprofil"
        description="Übersicht deiner Benutzerdaten."
        eyebrow="Mein Bereich"
        accent
      />

      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "1.75rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <UserAvatar user={currentUser} size={84} fontSize="1.55rem" />

            <div>
              <h2
                style={{
                  margin: 0,
                  color: colors.text,
                  fontSize: "1.35rem",
                }}
              >
                {displayName}
              </h2>

              <p
                style={{
                  margin: "0.35rem 0 0 0",
                  color: colors.textMuted,
                  fontSize: "0.98rem",
                }}
              >
                @{currentUser.username}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                ...badgeStyle,
                backgroundColor: currentUser.active
                  ? colors.primarySoft
                  : colors.dangerSoft,
                color: currentUser.active ? colors.primary : colors.danger,
              }}
            >
              {currentUser.active ? "Aktiv" : "Inaktiv"}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          <DataField label="Vorname" value={currentUser.firstName || "-"} />
          <DataField label="Nachname" value={currentUser.lastName || "-"} />
          <DataField label="Benutzername" value={currentUser.username || "-"} />

          <div
            style={{
              padding: "1rem 1.1rem",
              border: `1px solid ${colors.border}`,
              borderRadius: "14px",
              backgroundColor: colors.surface,
              minWidth: 0,
              gridColumn: "1 / -1",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "0.75rem",
                marginBottom: "0.35rem",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontSize: "0.9rem",
                  color: colors.textMuted,
                  marginBottom: "0.2rem",
                }}
              >
                Kontodaten
              </div>

              {!isEditingProfile ? (
                <button
                  type="button"
                  onClick={handleStartProfileEdit}
                  style={{
                    ...secondaryButtonStyle,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    minHeight: "36px",
                    padding: "0.45rem 0.8rem",
                  }}
                  aria-label="Kontodaten bearbeiten"
                  title="Kontodaten bearbeiten"
                >
                  <EditIcon size={15} />
                  <span>Bearbeiten</span>
                </button>
              ) : null}
            </div>

            {!isEditingProfile ? (
              <div
                style={{
                  display: "grid",
                  gap: "1rem",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                }}
              >
                <DataField label="E-Mail" value={currentUser.email || "-"} />
                <DataField
                  label="Passwort"
                  value="••••••••"
                  helpText="Aus Sicherheitsgründen wird das Passwort nicht angezeigt."
                />
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "1rem",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                }}
              >
                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    htmlFor="profile-email"
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      color: colors.textMuted,
                      marginBottom: "0.45rem",
                    }}
                  >
                    E-Mail
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    value={emailInput}
                    onChange={(event) => setEmailInput(event.target.value)}
                    disabled={isSavingProfile}
                    style={textInputStyle}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    htmlFor="profile-password"
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      color: colors.textMuted,
                      marginBottom: "0.45rem",
                    }}
                  >
                    Neues Passwort (optional)
                  </label>
                  <input
                    id="profile-password"
                    type="password"
                    value={passwordInput}
                    onChange={(event) => setPasswordInput(event.target.value)}
                    placeholder="Nur ausfüllen, wenn du dein Passwort ändern möchtest"
                    disabled={isSavingProfile}
                    style={textInputStyle}
                  />
                </div>

                <div style={actionsWrapperStyle}>
                  <div style={centeredActionsStyle}>
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      style={{
                        ...primaryButtonStyle,
                        ...compactPrimaryButtonStyle,
                        opacity: isSavingProfile ? 0.7 : 1,
                        cursor: isSavingProfile ? "default" : "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.55rem",
                      }}
                    >
                      <SaveIcon />
                      <span>{isSavingProfile ? "Speichern..." : "Änderungen speichern"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelProfileEdit}
                      disabled={isSavingProfile}
                      style={{
                        ...secondaryButtonStyle,
                        ...compactSecondaryButtonStyle,
                        opacity: isSavingProfile ? 0.7 : 1,
                        cursor: isSavingProfile ? "default" : "pointer",
                      }}
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

const actionsWrapperStyle: CSSProperties = {
  gridColumn: "1 / -1",
  display: "grid",
  gap: "0.9rem",
};

const centeredActionsStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "0.65rem",
  flexWrap: "wrap",
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

export default UserProfilePage;