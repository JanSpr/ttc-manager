const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8081";

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`API-Fehler bei GET ${path}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchTestMessage(): Promise<string> {
  const response = await fetch(`${API_URL}/api/test`);

  if (!response.ok) {
    throw new Error("Fehler beim Laden der Testnachricht.");
  }

  return response.text();
}
