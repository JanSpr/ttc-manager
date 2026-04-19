export type TeamMembershipSummary = {
  membershipId: number;
  memberId: number;
  memberFullName: string;
  userId: number | null;
  lineupPosition: number | null;
  player: boolean;
  captain: boolean;
  viceCaptain: boolean;
};

export type Team = {
  id: number;
  name: string;
  description: string | null;
  memberCount: number;
  memberships: TeamMembershipSummary[];
};