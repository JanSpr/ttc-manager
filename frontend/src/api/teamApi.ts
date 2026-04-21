import { apiDelete, apiGet, apiPost, apiPut } from "./api";
import type { Team, TeamUpsertRequest } from "../types/team";

export async function fetchTeams(): Promise<Team[]> {
  return apiGet<Team[]>("/api/teams");
}

export async function fetchTeamById(id: number): Promise<Team> {
  return apiGet<Team>(`/api/teams/${id}`);
}

export async function createTeam(request: TeamUpsertRequest): Promise<Team> {
  return apiPost<Team, TeamUpsertRequest>("/api/teams", request);
}

export async function updateTeam(
  id: number,
  request: TeamUpsertRequest
): Promise<Team> {
  return apiPut<Team, TeamUpsertRequest>(`/api/teams/${id}`, request);
}

export async function deleteTeam(id: number): Promise<void> {
  return apiDelete(`/api/teams/${id}`);
}