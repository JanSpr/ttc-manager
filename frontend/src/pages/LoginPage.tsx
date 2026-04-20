import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { colors } from "../styles/ui";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await login({ identifier, password });
      navigate("/");
    } catch {
      setError("Login fehlgeschlagen. Bitte überprüfe E-Mail/Username und Passwort.");
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
            Melde dich an, um deine Teams, Spieler und Vereinsdaten zu verwalten.
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
            <div style={{ display: "grid", gap: "8px" }}>
              <label
                htmlFor="identifier"
                style={{
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  color: colors.text,
                }}
              >
                E-Mail oder Username
              </label>

              <input
                id="identifier"
                type="text"
                placeholder="name@verein.de oder maxmus"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: `1px solid ${colors.borderStrong}`,
                  backgroundColor: "#ffffff",
                }}
              />
            </div>

            <div style={{ display: "grid", gap: "8px" }}>
              <label
                htmlFor="password"
                style={{
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  color: colors.text,
                }}
              >
                Passwort
              </label>

              <input
                id="password"
                type="password"
                placeholder="Passwort eingeben"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: `1px solid ${colors.borderStrong}`,
                  backgroundColor: "#ffffff",
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  backgroundColor: colors.dangerSoft,
                  color: colors.danger,
                  border: "1px solid #fecaca",
                  fontSize: "0.92rem",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                marginTop: "4px",
                border: "none",
                borderRadius: "12px",
                padding: "13px 16px",
                background:
                  "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                color: "#ffffff",
                fontSize: "0.98rem",
                fontWeight: 800,
                boxShadow: "0 12px 24px rgba(37, 99, 235, 0.18)",
              }}
            >
              Einloggen
            </button>
          </form>

          <div
            style={{
              marginTop: "26px",
              paddingTop: "20px",
              borderTop: `1px solid ${colors.border}`,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "999px",
                backgroundColor: colors.surfaceSoft,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "30px",
                  height: "30px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: `2px solid ${colors.primary}`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "13px",
                    left: "-4px",
                    width: "38px",
                    height: "2px",
                    backgroundColor: colors.accent,
                    transform: "rotate(-18deg)",
                  }}
                />
              </div>

              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    color: colors.text,
                    lineHeight: 1.1,
                  }}
                >
                  TTC Manager
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: colors.textMuted,
                    lineHeight: 1.1,
                  }}
                >
                  erster Logo-Entwurf
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}