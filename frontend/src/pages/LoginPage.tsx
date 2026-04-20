import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password });
      navigate("/");
    } catch {
      setError("Login fehlgeschlagen. Bitte überprüfe E-Mail und Passwort.");
    }
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "18px",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
          padding: "32px 28px 24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 16px",
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "24px",
              fontWeight: 800,
              letterSpacing: "0.04em",
            }}
          >
            TTC
          </div>

          <h1
            style={{
              margin: "0 0 8px 0",
              fontSize: "28px",
              lineHeight: 1.2,
            }}
          >
            Willkommen zurück
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "15px",
              lineHeight: 1.5,
            }}
          >
            Melde dich an, um deine Teams und Spieler zu verwalten.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "18px",
          }}
        >
          <div style={{ display: "grid", gap: "8px" }}>
            <label
              htmlFor="email"
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#374151",
              }}
            >
              E-Mail
            </label>

            <input
              id="email"
              type="email"
              placeholder="name@verein.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                fontSize: "15px",
                outline: "none",
                backgroundColor: "#fff",
              }}
            />
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            <label
              htmlFor="password"
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#374151",
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
                boxSizing: "border-box",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                fontSize: "15px",
                outline: "none",
                backgroundColor: "#fff",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                backgroundColor: "#fef2f2",
                color: "#b91c1c",
                border: "1px solid #fecaca",
                fontSize: "14px",
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
              borderRadius: "10px",
              padding: "12px 14px",
              background:
                "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Einloggen
          </button>
        </form>

        <div
          style={{
            marginTop: "28px",
            paddingTop: "20px",
            borderTop: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: "999px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e5e7eb",
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
                  border: "2px solid #2563eb",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "13px",
                  left: "-4px",
                  width: "38px",
                  height: "2px",
                  backgroundColor: "#7c3aed",
                  transform: "rotate(-18deg)",
                }}
              />
            </div>

            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#111827",
                  lineHeight: 1.1,
                }}
              >
                TTC Manager
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
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
  );
}