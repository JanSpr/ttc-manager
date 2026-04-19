import { useEffect, useState } from "react";
import { fetchTestMessage } from "../services/api";

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
    <main>
      <h2>Willkommen im TTC Manager</h2>
      <p>Hier entsteht die Oberfläche für Mannschaftsführer und Spieler.</p>

      <section style={{ marginTop: "24px" }}>
        <h3>Backend-Test</h3>
        {error ? <p>{error}</p> : <p>{message}</p>}
      </section>
    </main>
  );
}

export default HomePage;
