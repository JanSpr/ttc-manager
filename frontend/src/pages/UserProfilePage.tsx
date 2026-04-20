import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  pageContainerStyle,
  contentCardStyle,
  sectionTitleStyle,
  sectionDescriptionStyle,
  badgeStyle,
  subtleLabelStyle,
  colors,
} from "../styles/ui";

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
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
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
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ margin: 0, color: colors.text }}>
            {user.firstName} {user.lastName}
          </h2>

          <div
            style={{
              ...badgeStyle,
              backgroundColor: user.active
                ? colors.primarySoft
                : colors.dangerSoft,
              color: user.active ? colors.primary : colors.danger,
            }}
          >
            {user.active ? "Aktiv" : "Inaktiv"}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          <ProfileField label="Vorname" value={user.firstName || "-"} />
          <ProfileField label="Nachname" value={user.lastName || "-"} />
          <ProfileField label="Username" value={user.username || "-"} />
          <ProfileField
            label="E-Mail"
            value={user.email || "-"}
            preserveFullValue
          />
          <ProfileField
            label="Member-Verknüpfung"
            value={
              user.memberId !== null
                ? String(user.memberId)
                : "Keine Verknüpfung"
            }
          />
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <div style={{ ...subtleLabelStyle, marginBottom: "0.5rem" }}>
            Rollen
          </div>

          {user.roles.length > 0 ? (
            <div
              style={{
                display: "flex",
                gap: "0.6rem",
                flexWrap: "wrap",
              }}
            >
              {user.roles.map((role) => (
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