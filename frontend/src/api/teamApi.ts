import { apiGet } from "./api";
import type { Team } from "../types/team";

export async function fetchTeams(): Promise<Team[]> {
  return apiGet<Team[]>("/api/teams");
}

export async function fetchTeamById(id: number): Promise<Team> {
  return apiGet<Team>(`/api/teams/${id}`);
}
