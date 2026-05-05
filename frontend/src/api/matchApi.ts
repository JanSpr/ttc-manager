import { apiDelete, apiGet, apiPost, apiPut } from "./api";
import type { Match, MatchUpsertRequest } from "../types/match";

export async function fetchMatches(): Promise<Match[]> {
  return apiGet("/api/matches");
}

export async function fetchMatchById(id: number): Promise<Match> {
  return apiGet(`/api/matches/${id}`);
}

export async function fetchUpcomingMatches(): Promise<Match[]> {
  return apiGet("/api/matches/upcoming");
}

export async function fetchUpcomingMatchesByTeam(
  teamId: number
): Promise<Match[]> {
  return apiGet(`/api/matches/upcoming/team/${teamId}`);
}

export async function createMatch(
  request: MatchUpsertRequest
): Promise<Match> {
  return apiPost("/api/matches", request);
}

export async function updateMatch(
  id: number,
  request: MatchUpsertRequest
): Promise<Match> {
  return apiPut(`/api/matches/${id}`, request);
}

export async function deleteMatch(id: number): Promise<void> {
  return apiDelete(`/api/matches/${id}`);
}