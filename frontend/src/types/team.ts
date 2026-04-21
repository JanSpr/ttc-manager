export type TeamType = "ADULT" | "YOUTH";

export interface Team {
  id: number;
  name: string;
  description?: string;
  type: TeamType;
  memberCount: number;
  memberships: TeamMembershipSummary[];
}

export interface TeamMembershipSummary {
  id: number;
  memberId: number;
  memberName: string;
  userId?: number;
  lineupPosition?: number;
  player: boolean;
  captain: boolean;
  viceCaptain: boolean;
}

export type TeamUpsertRequest = {
  name: string;
  description: string;
  type: TeamType;
};