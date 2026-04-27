import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";
import { colors, textInputStyle, primaryButtonStyle } from "../styles/ui";
import FormField from "../components/ui/FormField";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!identifier.trim() || !password.trim()) {
      showToast("Bitte E-Mail oder Benutzername und Passwort eingeben.", "error");
      return;
    }

    try {
      setIsSubmitting(true);

      await login({
        identifier: identifier.trim(),
        password,
      });

      showToast("Erfolgreich eingeloggt.", "success");
      navigate("/");
    } catch (error) {
      console.error(error);
      showToast(
        error instanceof Error
          ? error.message
          : "Anmeldung fehlgeschlagen. Bitte überprüfe E-Mail oder Benutzername und Passwort.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 160px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: "22px",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.10)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "34px 28px 22px",
            background:
              "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%)",
            borderBottom: `1px solid ${colors.border}`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "62px",
              height: "62px",
              margin: "0 auto 18px",
              borderRadius: "18px",
              background:
                "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "20px",
              fontWeight: 800,
              letterSpacing: "0.04em",
              boxShadow: "0 14px 30px rgba(37, 99, 235, 0.22)",
            }}
          >
            TTC
          </div>

          <h1
            style={{
              margin: "0 0 8px 0",
              fontSize: "1.8rem",
              fontWeight: 800,
              color: colors.text,
              lineHeight: 1.15,
            }}
          >
            Willkommen zurück
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "0.98rem",
              color: colors.textMuted,
              lineHeight: 1.6,
              maxWidth: "300px",
              marginInline: "auto",
            }}
          >
            Melde dich an, um deine Mannschaften, Spieler und Vereinsdaten zu
            verwalten.
          </p>
        </div>

        <div style={{ padding: "28px" }}>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            <FormField label="E-Mail oder Benutzername" htmlFor="identifier">
              <input
                id="identifier"
                type="text"
                placeholder="name@verein.de oder maxmus"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                disabled={isSubmitting}
                style={textInputStyle}
              />
            </FormField>

            <FormField label="Passwort" htmlFor="password">
              <input
                id="password"
                type="password"
                placeholder="Passwort eingeben"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isSubmitting}
                style={textInputStyle}
              />
            </FormField>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...primaryButtonStyle,
                marginTop: "4px",
                cursor: isSubmitting ? "default" : "pointer",
                opacity: isSubmitting ? 0.8 : 1,
              }}
            >
              {isSubmitting ? "Anmeldung..." : "Anmelden"}
            </button>
          </form>

          <div
            style={{
              marginTop: "22px",
              paddingTop: "18px",
              borderTop: `1px solid ${colors.border}`,
              textAlign: "center",
              color: colors.textMuted,
              fontSize: "0.92rem",
              lineHeight: 1.5,
            }}
          >
            Du hast einen Aktivierungscode?{" "}
            <Link
              to="/activate"
              style={{
                color: colors.primary,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Account aktivieren
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}