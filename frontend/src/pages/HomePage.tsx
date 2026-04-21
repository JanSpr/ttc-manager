import { useEffect, useState } from "react";
import { fetchTestMessage } from "../api/api";
import { useToast } from "../context/useToast";
import { cardTitleStyle, colors, pageContainerStyle } from "../styles/ui";
import PageIntro from "../components/layout/PageIntro";
import Card from "../components/ui/Card";

function HomePage() {
  const { showToast } = useToast();
  const [message, setMessage] = useState("Lade Backend-Nachricht...");

  useEffect(() => {
    async function loadMessage() {
      try {
        const result = await fetchTestMessage();
        setMessage(result);
      } catch (err) {
        console.error(err);
        setMessage("Backend-Test aktuell nicht verfügbar.");
        showToast("Backend konnte nicht erreicht werden.", "error");
      }
    }

    void loadMessage();
  }, [showToast]);

  return (
    <div style={pageContainerStyle}>
      <PageIntro
        title="Willkommen im TTC Manager"
        description="Hier entsteht die Oberfläche für Mannschaftsführer und Spieler."
        accent
      />

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          marginTop: "1.5rem",
        }}
      >
        <Card style={{ marginTop: 0 }}>
          <h2 style={cardTitleStyle}>Schnellstart</h2>
          <p style={{ margin: 0, color: colors.textMuted, lineHeight: 1.6 }}>
            Über die Navigation oben erreichst du die Teamübersicht und kannst
            von dort in die einzelnen Mannschaften und Spieler springen.
          </p>
        </Card>

        <Card style={{ marginTop: 0 }}>
          <h2 style={cardTitleStyle}>Nächste Ausbaustufe</h2>
          <p style={{ margin: 0, color: colors.textMuted, lineHeight: 1.6 }}>
            Als Nächstes kann die Startseite mit echten Vereinsdaten,
            Kennzahlen oder den nächsten Spielen befüllt werden.
          </p>
        </Card>
      </div>

      <Card>
        <h2 style={cardTitleStyle}>Backend-Test</h2>
        <p style={{ margin: 0, color: colors.text }}>{message}</p>
      </Card>
    </div>
  );
}

export default HomePage;