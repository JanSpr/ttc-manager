const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8081";

async function parseJsonSafe<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) return null;
  return JSON.parse(text) as T;
}

async function buildErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  const text = await response.text();

  if (!text) {
    return fallback;
  }

  try {
    const json = JSON.parse(text) as { message?: string; error?: string };
    return json.message || json.error || text || fallback;
  } catch {
    return text;
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await buildErrorMessage(response, `GET ${path} fehlgeschlagen: ${response.status}`));
  }

  return response.json();
}

export async function apiPost<TResponse, TBody = unknown>(
  path: string,
  body?: TBody
): Promise<TResponse> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(await buildErrorMessage(response, `POST ${path} fehlgeschlagen: ${response.status}`));
  }

  const data = await parseJsonSafe<TResponse>(response);
  return data as TResponse;
}

export async function apiPut<TResponse, TBody = unknown>(
  path: string,
  body?: TBody
): Promise<TResponse> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(await buildErrorMessage(response, `PUT ${path} fehlgeschlagen: ${response.status}`));
  }

  const data = await parseJsonSafe<TResponse>(response);
  return data as TResponse;
}

export async function apiDelete(path: string): Promise<void> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await buildErrorMessage(response, `DELETE ${path} fehlgeschlagen`));
  }
}

export async function fetchTestMessage(): Promise<string> {
  const response = await fetch(`${API_URL}/api/test`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await buildErrorMessage(response, "Fehler beim Laden der Testnachricht."));
  }

  return response.text();
}