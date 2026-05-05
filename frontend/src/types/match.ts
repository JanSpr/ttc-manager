export type MatchStatus = "PLANNED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export type Match = {
  id: number;
  teamId: number;
  teamName: string;
  opponentName: string;
  competition: string | null;
  matchDateTime: string;
  location: string | null;
  homeMatch: boolean;
  status: MatchStatus;
  notes: string | null;
};