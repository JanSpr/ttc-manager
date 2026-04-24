export type TeamType = "ADULT" | "YOUTH";

export interface TeamMembershipSummary {
  membershipId: number;
  memberId: number;
  memberFullName: string;
  userId?: number | null;
  lineupPosition?: number | null;
  player: boolean;
  captain: boolean;
  viceCaptain: boolean;
}

export interface TeamMembership {
  id: number;
  teamId: number;
  teamName: string;
  memberId: number;
  memberFullName: string;
  lineupPosition: number | null;
  player: boolean;
  captain: boolean;
  viceCaptain: boolean;
}

export type TeamMembershipUpsertRequest = {
  memberId: number;
  lineupPosition: number | null;
  player: boolean;
  captain: boolean;
  viceCaptain: boolean;
};

export interface Team {
  id: number;
  name: string;
  description?: string;
  type: TeamType;
  memberCount: number;
  memberships: TeamMembershipSummary[];
}

export type TeamUpsertRequest = {
  name: string;
  description: string;
  type: TeamType;
};