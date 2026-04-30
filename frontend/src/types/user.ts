export type GlobalRole = "ADMIN" | "BOARD";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  email: string;
  active: boolean;
  roles: GlobalRole[];
  memberId: number | null;
  memberFullName: string | null;

  // ✅ NEU
  activationCode: string | null;
};

export type UserUpsertRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  active: boolean;
  memberId: number;
  roles: GlobalRole[];
};