export type MemberType = "ADULT" | "YOUTH";

export type Member = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  active: boolean;
  type: MemberType;
  userId: number | null;
  teamIds: number[];
};

export type MemberUpsertRequest = {
  firstName: string;
  lastName: string;
  active: boolean;
  type: MemberType;
  userId?: number | null;
  createUserAccount?: boolean;
};