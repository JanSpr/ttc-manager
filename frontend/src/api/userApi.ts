import type { User } from "../types/user";

const API_BASE_URL = "http://localhost:8081";

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/api/users`);

  if (!response.ok) {
    throw new Error(`Fehler beim Laden der Benutzer: ${response.status}`);
  }

  return response.json();
}

export async function fetchUserById(id: number): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`);

  if (!response.ok) {
    throw new Error(`Fehler beim Laden des Benutzers: ${response.status}`);
  }

  return response.json();
}