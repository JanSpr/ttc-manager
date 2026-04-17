const API_URL = import.meta.env.VITE_API_URL;

export async function fetchTestMessage(): Promise<string> {
  const response = await fetch(`${API_URL}/api/test`);

  if (!response.ok) {
    throw new Error("Fehler beim Laden der Testnachricht.");
  }

  return response.text();
}