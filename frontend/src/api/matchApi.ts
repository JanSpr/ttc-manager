import { apiGet } from "./api";
import type { Match } from "../types/match";

export async function fetchUpcomingMatches(): Promise<Match[]> {
  return apiGet("/api/matches/upcoming");
}

export async function fetchUpcomingMatchesByTeam(
  teamId: number
): Promise<Match[]> {
  return apiGet(`/api/matches/upcoming/team/${teamId}`);
}