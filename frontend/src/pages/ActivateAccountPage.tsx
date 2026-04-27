import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { activateUserAccount } from "../api/authApi";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";
import {
  colors,
  primaryButtonStyle,
  secondaryButtonStyle,
  textInputStyle,
} from "../styles/ui";
import FormField from "../components/ui/FormField";

type ActivationStep = "code" | "password" | "details";

function getStepTitle(step: ActivationStep): string {
  if (step === "code") {
    return "Aktivierungscode eingeben";
  }

  if (step === "password") {
    return "Passwort wählen";
  }

  return "Account abschließen";
}

function getStepDescription(step: ActivationStep): string {
  if (step === "code") {
    return "Gib den Aktivierungscode ein, den du von deinem Verein erhalten hast.";
  }

  if (step === "password") {
    return "Wähle ein sicheres Passwort für deinen TTC-Manager Account.";
  }

  return "Dein Benutzername wurde bereits automatisch vorbereitet. Eine E-Mail-Adresse kannst du optional ergänzen.";
}

export default function ActivateAccountPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<ActivationStep>("code");
  const [activationCode, setActivationCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleCodeSubmit(event: FormEvent) {
    event.preventDefault();

    if (!activationCode.trim()) {
      showToast("Bitte gib deinen Aktivierungscode ein.", "error");
      return;
    }

    setStep("password");
  }

  function handlePasswordSubmit(event: FormEvent) {
    event.preventDefault();

    if (!password.trim()) {
      showToast("Bitte gib ein Passwort ein.", "error");
      return;
    }

    if (password.trim().length < 8) {
      showToast("Das Passwort muss mindestens 8 Zeichen lang sein.", "error");
      return;
    }

    if (password !== passwordConfirmation) {
      showToast("Die Passwörter stimmen nicht überein.", "error");
      return;
    }

    setStep("details");
  }

  async function handleDetailsSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      setIsSubmitting(true);

      const activatedUser = await activateUserAccount({
        activationCode: activationCode.trim(),
        password,
        email: email.trim() ? email.trim() : null,
      });

      await login({
        identifier: activatedUser.username,
        password,
      });

      showToast("Account aktiviert und erfolgreich eingeloggt.", "success");
      navigate("/");
    } catch (error) {
      console.error("Aktivierung fehlgeschlagen", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Account konnte nicht aktiviert werden.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBack() {
    if (step === "details") {
      setStep("password");
      return;
    }

    if (step === "password") {
      setStep("code");
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
          maxWidth: "480px",
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

          <div
            style={{
              marginBottom: "10px",
              color: colors.primary,
              fontSize: "0.78rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Account aktivieren
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
            {getStepTitle(step)}
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "0.98rem",
              color: colors.textMuted,
              lineHeight: 1.6,
              maxWidth: "340px",
              marginInline: "auto",
            }}
          >
            {getStepDescription(step)}
          </p>
        </div>

        <div style={{ padding: "28px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
              marginBottom: "22px",
            }}
          >
            {(["code", "password", "details"] as ActivationStep[]).map(
              (item, index) => {
                const isActive = item === step;
                const isDone =
                  (step === "password" && item === "code") ||
                  (step === "details" &&
                    (item === "code" || item === "password"));

                return (
                  <div
                    key={item}
                    style={{
                      height: "6px",
                      borderRadius: "999px",
                      backgroundColor:
                        isActive || isDone ? colors.primary : colors.border,
                      opacity: isActive ? 1 : isDone ? 0.7 : 1,
                    }}
                    aria-label={`Schritt ${index + 1}`}
                  />
                );
              },
            )}
          </div>

          {step === "code" ? (
            <form
              onSubmit={handleCodeSubmit}
              style={{
                display: "grid",
                gap: "18px",
              }}
            >
              <FormField label="Aktivierungscode" htmlFor="activationCode">
                <input
                  id="activationCode"
                  type="text"
                  placeholder="Aktivierungscode eingeben"
                  value={activationCode}
                  onChange={(event) => setActivationCode(event.target.value)}
                  autoComplete="one-time-code"
                  style={textInputStyle}
                />
              </FormField>

              <button type="submit" style={primaryButtonStyle}>
                Weiter
              </button>
            </form>
          ) : null}

          {step === "password" ? (
            <form
              onSubmit={handlePasswordSubmit}
              style={{
                display: "grid",
                gap: "18px",
              }}
            >
              <FormField label="Passwort" htmlFor="password">
                <input
                  id="password"
                  type="password"
                  placeholder="Mindestens 8 Zeichen"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  style={textInputStyle}
                />
              </FormField>

              <FormField
                label="Passwort bestätigen"
                htmlFor="passwordConfirmation"
              >
                <input
                  id="passwordConfirmation"
                  type="password"
                  placeholder="Passwort wiederholen"
                  value={passwordConfirmation}
                  onChange={(event) =>
                    setPasswordConfirmation(event.target.value)
                  }
                  autoComplete="new-password"
                  style={textInputStyle}
                />
              </FormField>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  onClick={handleBack}
                  style={{
                    ...secondaryButtonStyle,
                    flex: 1,
                  }}
                >
                  Zurück
                </button>

                <button
                  type="submit"
                  style={{
                    ...primaryButtonStyle,
                    flex: 1,
                  }}
                >
                  Weiter
                </button>
              </div>
            </form>
          ) : null}

          {step === "details" ? (
            <form
              onSubmit={handleDetailsSubmit}
              style={{
                display: "grid",
                gap: "18px",
              }}
            >
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "16px",
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.primarySoft,
                  color: colors.text,
                  lineHeight: 1.55,
                  fontSize: "0.93rem",
                }}
              >
                Dein Benutzername wurde automatisch aus deinem Namen vorbereitet.
                Nach der Aktivierung wirst du direkt eingeloggt.
              </div>

              <FormField label="E-Mail-Adresse optional" htmlFor="email">
                <input
                  id="email"
                  type="email"
                  placeholder="name@verein.de"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  disabled={isSubmitting}
                  style={textInputStyle}
                />
              </FormField>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  style={{
                    ...secondaryButtonStyle,
                    flex: 1,
                    cursor: isSubmitting ? "default" : "pointer",
                    opacity: isSubmitting ? 0.8 : 1,
                  }}
                >
                  Zurück
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    ...primaryButtonStyle,
                    flex: 1,
                    cursor: isSubmitting ? "default" : "pointer",
                    opacity: isSubmitting ? 0.8 : 1,
                  }}
                >
                  {isSubmitting ? "Aktivierung..." : "Account aktivieren"}
                </button>
              </div>
            </form>
          ) : null}

          <div
            style={{
              marginTop: "22px",
              paddingTop: "18px",
              borderTop: `1px solid ${colors.border}`,
              textAlign: "center",
              color: colors.textMuted,
              fontSize: "0.92rem",
            }}
          >
            Du hast bereits einen Account?{" "}
            <Link
              to="/login"
              style={{
                color: colors.primary,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Zur Anmeldung
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}