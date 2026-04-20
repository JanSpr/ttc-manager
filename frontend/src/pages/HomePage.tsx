import { useEffect, useState } from "react";
import { fetchTestMessage } from "../api/api";
import {
  pageContainerStyle,
  contentCardStyle,
  sectionTitleStyle,
  sectionDescriptionStyle,
  colors,
} from "../styles/ui";

function HomePage() {
  const [message, setMessage] = useState("Lade Backend-Nachricht...");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMessage() {
      try {
        const result = await fetchTestMessage();
        setMessage(result);
      } catch (err) {
        console.error(err);
        setError("Backend konnte nicht erreicht werden.");
      }
    }

    loadMessage();
  }, []);

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
          TTC Manager
        </div>

        <h1 style={sectionTitleStyle}>Willkommen im TTC Manager</h1>
        <p style={sectionDescriptionStyle}>
          Hier entsteht die Oberfläche für Mannschaftsführer und Spieler.
        </p>
      </section>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          marginTop: "1.5rem",
        }}
      >
        <div style={{ ...contentCardStyle, marginTop: 0 }}>
          <h2 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1.1rem" }}>
            Schnellstart
          </h2>
          <p style={{ margin: 0, color: colors.textMuted, lineHeight: 1.6 }}>
            Über die Navigation oben erreichst du die Teamübersicht und kannst
            von dort in die einzelnen Mannschaften und Spieler springen.
          </p>
        </div>

        <div style={{ ...contentCardStyle, marginTop: 0 }}>
          <h2 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1.1rem" }}>
            Nächste Ausbaustufe
          </h2>
          <p style={{ margin: 0, color: colors.textMuted, lineHeight: 1.6 }}>
            Als Nächstes Startseite mit echten Vereinsdaten,
            Kennzahlen oder den nächsten Spielen befüllen.
          </p>
        </div>
      </div>

      <div style={contentCardStyle}>
        <h2 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1.1rem" }}>
          Backend-Test
        </h2>

        {error ? (
          <p style={{ margin: 0, color: colors.danger }}>{error}</p>
        ) : (
          <p style={{ margin: 0, color: colors.text }}>{message}</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;