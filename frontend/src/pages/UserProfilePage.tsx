import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";
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
        "error"
      );
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

          <div
            style={{
              padding: "1rem 1.1rem",
              border: `1px solid ${colors.border}`,
              borderRadius: "14px",
              backgroundColor: colors.surface,
              minWidth: 0,
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "0.75rem",
                marginBottom: "0.35rem",
              }}
            >
              <div style={subtleLabelStyle}>E-Mail</div>

              {!isEditingEmail ? (
                <button
                  type="button"
                  onClick={handleStartEmailEdit}
                  aria-label="E-Mail bearbeiten"
                  title="E-Mail bearbeiten"
                  style={{
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.surfaceSoft,
                    color: colors.textMuted,
                    borderRadius: "8px",
                    width: "32px",
                    height: "32px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                    fontSize: "0.95rem",
                    lineHeight: 1,
                  }}
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
                  disabled={isSavingEmail}
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "0.8rem 0.95rem",
                    borderRadius: "10px",
                    border: `1px solid ${colors.border}`,
                    backgroundColor: "#ffffff",
                    color: colors.text,
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    gap: "0.65rem",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleSaveEmail}
                    disabled={isSavingEmail}
                    style={{
                      padding: "0.7rem 0.95rem",
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
                      padding: "0.7rem 0.95rem",
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
            )}
          </div>

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
    </div>
  );
}

export default UserProfilePage;