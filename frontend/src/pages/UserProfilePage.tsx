import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { updateOwnEmail } from "../api/userApi";
import {
  pageContainerStyle,
  contentCardStyle,
  sectionTitleStyle,
  sectionDescriptionStyle,
  badgeStyle,
  subtleLabelStyle,
  colors,
} from "../styles/ui";
import UserAvatar from "../components/UserAvatar";

function ProfileField({
  label,
  value,
  preserveFullValue = false,
}: {
  label: string;
  value: string;
  preserveFullValue?: boolean;
}) {
  return (
    <div
      style={{
        padding: "1rem 1.1rem",
        border: `1px solid ${colors.border}`,
        borderRadius: "14px",
        backgroundColor: colors.surface,
        minWidth: 0,
      }}
    >
      <div style={subtleLabelStyle}>{label}</div>
      <div
        style={{
          color: colors.text,
          fontWeight: 600,
          lineHeight: 1.4,
          overflowWrap: preserveFullValue ? "anywhere" : "break-word",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function UserProfilePage() {
  const { user, isAuthenticated, updateAuthenticatedUser } = useAuth();

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [emailSuccessMessage, setEmailSuccessMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const currentUser = user;

  const displayName =
    [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ").trim() ||
    currentUser.username;

  function handleStartEmailEdit() {
    setEmailInput(currentUser.email ?? "");
    setEmailErrorMessage("");
    setEmailSuccessMessage("");
    setIsEditingEmail(true);
  }

  function handleCancelEmailEdit() {
    setEmailInput(currentUser.email ?? "");
    setEmailErrorMessage("");
    setEmailSuccessMessage("");
    setIsEditingEmail(false);
  }

  async function handleSaveEmail() {
    const normalizedEmail = emailInput.trim();

    if (!normalizedEmail) {
      setEmailErrorMessage("Bitte gib eine E-Mail-Adresse ein.");
      setEmailSuccessMessage("");
      return;
    }

    if (normalizedEmail === currentUser.email) {
      setEmailErrorMessage("");
      setEmailSuccessMessage("");
      setIsEditingEmail(false);
      return;
    }

    try {
      setIsSavingEmail(true);
      setEmailErrorMessage("");
      setEmailSuccessMessage("");

      const updatedUser = await updateOwnEmail({ email: normalizedEmail });

      updateAuthenticatedUser(updatedUser);
      setEmailInput(updatedUser.email);
      setIsEditingEmail(false);
      setEmailSuccessMessage("Deine E-Mail-Adresse wurde erfolgreich aktualisiert.");
    } catch (error) {
      console.error(error);
      setEmailErrorMessage(
        error instanceof Error
          ? error.message
          : "Die E-Mail-Adresse konnte nicht gespeichert werden."
      );
      setEmailSuccessMessage("");
    } finally {
      setIsSavingEmail(false);
    }
  }

  return (
    <div style={pageContainerStyle}>
      <section
        style={{
          ...contentCardStyle,
          marginTop: 0,
          padding: "1.75rem",
          background:
            "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%), #ffffff",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "0.35rem 0.7rem",
            borderRadius: "999px",
            backgroundColor: "#ffffff",
            border: `1px solid ${colors.border}`,
            color: colors.primary,
            fontWeight: 700,
            fontSize: "0.9rem",
            marginBottom: "1rem",
          }}
        >
          Mein Profil
        </div>

        <h1 style={sectionTitleStyle}>Benutzerprofil</h1>
        <p style={sectionDescriptionStyle}>Übersicht deiner Benutzerdaten.</p>
      </section>

      <section style={contentCardStyle}>
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
          <ProfileField label="Vorname" value={currentUser.firstName || "-"} />
          <ProfileField label="Nachname" value={currentUser.lastName || "-"} />
          <ProfileField label="Username" value={currentUser.username || "-"} />
          <ProfileField
            label="E-Mail"
            value={currentUser.email || "-"}
            preserveFullValue
          />
          <ProfileField
            label="Member-Verknüpfung"
            value={
              currentUser.memberId !== null
                ? String(currentUser.memberId)
                : "Keine Verknüpfung"
            }
          />
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <div style={{ ...subtleLabelStyle, marginBottom: "0.5rem" }}>
            Rollen
          </div>

          {currentUser.roles.length > 0 ? (
            <div
              style={{
                display: "flex",
                gap: "0.6rem",
                flexWrap: "wrap",
              }}
            >
              {currentUser.roles.map((role) => (
                <span key={role} style={badgeStyle}>
                  {role}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, color: colors.textMuted }}>
              Keine Rollen vorhanden.
            </p>
          )}
        </div>
      </section>

      <section style={contentCardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "1.15rem",
                color: colors.text,
              }}
            >
              E-Mail-Adresse ändern
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0 0",
                color: colors.textMuted,
                lineHeight: 1.6,
              }}
            >
              Aktuell kann im Profil nur die eigene E-Mail-Adresse bearbeitet werden.
            </p>
          </div>

          {!isEditingEmail ? (
            <button
              type="button"
              onClick={handleStartEmailEdit}
              style={{
                padding: "0.7rem 1rem",
                borderRadius: "10px",
                border: `1px solid ${colors.borderStrong}`,
                backgroundColor: colors.surface,
                color: colors.text,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              E-Mail bearbeiten
            </button>
          ) : null}
        </div>

        {emailSuccessMessage ? (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.85rem 1rem",
              borderRadius: "12px",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.primarySoft,
              color: colors.primary,
              fontWeight: 600,
            }}
          >
            {emailSuccessMessage}
          </div>
        ) : null}

        {emailErrorMessage ? (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.85rem 1rem",
              borderRadius: "12px",
              border: `1px solid #fecaca`,
              backgroundColor: colors.dangerSoft,
              color: colors.danger,
              fontWeight: 600,
            }}
          >
            {emailErrorMessage}
          </div>
        ) : null}

        {isEditingEmail ? (
          <div
            style={{
              display: "grid",
              gap: "0.9rem",
              maxWidth: "520px",
            }}
          >
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  marginBottom: "0.4rem",
                  color: colors.text,
                  fontWeight: 600,
                }}
              >
                Neue E-Mail-Adresse
              </label>

              <input
                id="email"
                type="email"
                value={emailInput}
                onChange={(event) => setEmailInput(event.target.value)}
                disabled={isSavingEmail}
                style={{
                  width: "100%",
                  padding: "0.8rem 0.95rem",
                  borderRadius: "10px",
                  border: `1px solid ${colors.border}`,
                  backgroundColor: "#ffffff",
                  color: colors.text,
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={handleSaveEmail}
                disabled={isSavingEmail}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: colors.primary,
                  color: "#ffffff",
                  fontWeight: 700,
                  cursor: isSavingEmail ? "default" : "pointer",
                  opacity: isSavingEmail ? 0.7 : 1,
                }}
              >
                {isSavingEmail ? "Speichere..." : "Speichern"}
              </button>

              <button
                type="button"
                onClick={handleCancelEmailEdit}
                disabled={isSavingEmail}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: `1px solid ${colors.borderStrong}`,
                  backgroundColor: colors.surface,
                  color: colors.text,
                  fontWeight: 700,
                  cursor: isSavingEmail ? "default" : "pointer",
                  opacity: isSavingEmail ? 0.7 : 1,
                }}
              >
                Abbrechen
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default UserProfilePage;