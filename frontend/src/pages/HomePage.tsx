import { useEffect, useState } from "react";
import { fetchTestMessage } from "../api/api";
import { pageContainerStyle, contentCardStyle } from "../styles/ui";

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
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: "0 0 0.5rem 0" }}>Willkommen im TTC Manager</h1>
        <p style={{ margin: 0, color: "#555", lineHeight: 1.6 }}>
          Hier entsteht die Oberfläche für Mannschaftsführer und Spieler.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        <div style={contentCardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1.1rem" }}>
            Schnellstart
          </h2>
          <p style={{ margin: 0, color: "#555", lineHeight: 1.6 }}>
            Über die Navigation oben erreichst du die Teamübersicht und kannst
            von dort in die einzelnen Mannschaften und Spieler springen.
          </p>
        </div>

        <div style={contentCardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1.1rem" }}>
            Nächste Ausbaustufe
          </h2>
          <p style={{ margin: 0, color: "#555", lineHeight: 1.6 }}>
            Als Nächstes können wir die Startseite mit echten Vereinsdaten,
            Kennzahlen oder den nächsten Spielen füllen.
          </p>
        </div>
      </div>

      <div style={{ ...contentCardStyle, marginTop: "1.5rem" }}>
        <h2 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1.1rem" }}>
          Backend-Test
        </h2>

        {error ? (
          <p style={{ margin: 0, color: "#b91c1c" }}>{error}</p>
        ) : (
          <p style={{ margin: 0, color: "#374151" }}>{message}</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;