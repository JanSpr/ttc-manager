import type { Team } from "../types/team";

const API_BASE_URL = "http://localhost:8081";

export async function fetchTeams(): Promise<Team[]> {
  const response = await fetch(`${API_BASE_URL}/api/teams`);

  if (!response.ok) {
    throw new Error(`Fehler beim Laden der Teams: ${response.status}`);
  }

  return response.json();
}

export async function fetchTeamById(id: number): Promise<Team> {
  const response = await fetch(`${API_BASE_URL}/api/teams/${id}`);

  if (!response.ok) {
    throw new Error(`Fehler beim Laden des Teams: ${response.status}`);
  }

  return response.json();
}