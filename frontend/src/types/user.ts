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
};