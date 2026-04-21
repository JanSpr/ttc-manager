import { useState } from "react";
import { Navigate } from "react-router-dom";
import { updateOwnEmail } from "../api/userApi";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";
import UserAvatar from "../components/UserAvatar";
import PageIntro from "../components/layout/PageIntro";
import Card from "../components/ui/Card";
import DataField from "../components/ui/DataField";
import {
  badgeStyle,
  colors,
  secondaryButtonStyle,
  textInputStyle,
} from "../styles/ui";

function UserProfilePage() {
  const { user, isAuthenticated, updateAuthenticatedUser } = useAuth();
  const { showToast } = useToast();

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [isSavingEmail, setIsSavingEmail] = useState(false);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const currentUser = user;

  const displayName =
    [currentUser.firstName, currentUser.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || currentUser.username;

  function handleStartEmailEdit() {
    setEmailInput(currentUser.email ?? "");
    setIsEditingEmail(true);
  }

  function handleCancelEmailEdit() {
    setEmailInput(currentUser.email ?? "");
    setIsEditingEmail(false);
  }

  async function handleSaveEmail() {
    const normalizedEmail = emailInput.trim();

    if (!normalizedEmail) {
      showToast("Bitte gib eine E-Mail-Adresse ein.", "error");
      return;
    }

    if (normalizedEmail === currentUser.email) {
      setIsEditingEmail(false);
      return;
    }

    try {
      setIsSavingEmail(true);

      const updatedUser = await updateOwnEmail({ email: normalizedEmail });

      updateAuthenticatedUser(updatedUser);
      setEmailInput(updatedUser.email);
      setIsEditingEmail(false);
      showToast("E-Mail-Adresse erfolgreich aktualisiert.", "success");
    } catch (error) {
      console.error(error);
      showToast(
        error instanceof Error
          ? error.message
          : "Die E-Mail-Adresse konnte nicht gespeichert werden.",
        "error",
      );
    } finally {
      setIsSavingEmail(false);
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
            alignItems: "center",
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
                E-Mail
              </div>

              {!isEditingEmail ? (
                <button
                  type="button"
                  onClick={handleStartEmailEdit}
                  style={{
                    border: `1px solid ${colors.border}`,
                    backgroundColor: "#ffffff",
                    color: colors.textMuted,
                    borderRadius: "10px",
                    width: "32px",
                    height: "32px",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    lineHeight: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                  aria-label="E-Mail bearbeiten"
                  title="E-Mail bearbeiten"
                >
                  ✎
                </button>
              ) : null}
            </div>

            {!isEditingEmail ? (
              <div
                style={{
                  color: colors.text,
                  fontWeight: 600,
                  lineHeight: 1.4,
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                {currentUser.email || "-"}
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "0.75rem",
                }}
              >
                <input
                  type="email"
                  value={emailInput}
                  onChange={(event) => setEmailInput(event.target.value)}
                  placeholder="E-Mail-Adresse eingeben"
                  disabled={isSavingEmail}
                  style={textInputStyle}
                />

                <div
                  style={{
                    display: "flex",
                    gap: "0.6rem",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleSaveEmail}
                    disabled={isSavingEmail}
                    style={{
                      ...secondaryButtonStyle,
                      backgroundColor: colors.primary,
                      color: "#ffffff",
                      border: `1px solid ${colors.primary}`,
                      opacity: isSavingEmail ? 0.8 : 1,
                    }}
                  >
                    {isSavingEmail ? "Speichert..." : "Speichern"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEmailEdit}
                    disabled={isSavingEmail}
                    style={{
                      ...secondaryButtonStyle,
                      opacity: isSavingEmail ? 0.8 : 1,
                    }}
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default UserProfilePage;