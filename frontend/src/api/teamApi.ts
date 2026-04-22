import { apiDelete, apiGet, apiPost, apiPut } from "./api";
import type {
  Team,
  TeamMembership,
  TeamMembershipUpsertRequest,
  TeamUpsertRequest,
} from "../types/team";

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

export async function fetchTeamMemberships(
  teamId: number
): Promise<TeamMembership[]> {
  return apiGet<TeamMembership[]>(`/api/teams/${teamId}/memberships`);
}

export async function createTeamMembership(
  teamId: number,
  request: TeamMembershipUpsertRequest
): Promise<TeamMembership> {
  return apiPost<TeamMembership, TeamMembershipUpsertRequest>(
    `/api/teams/${teamId}/memberships`,
    request
  );
}

export async function updateTeamMembership(
  teamId: number,
  membershipId: number,
  request: TeamMembershipUpsertRequest
): Promise<TeamMembership> {
  return apiPut<TeamMembership, TeamMembershipUpsertRequest>(
    `/api/teams/${teamId}/memberships/${membershipId}`,
    request
  );
}

export async function deleteTeamMembership(
  teamId: number,
  membershipId: number
): Promise<void> {
  return apiDelete(`/api/teams/${teamId}/memberships/${membershipId}`);
}