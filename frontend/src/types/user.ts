export type GlobalRole = "ADMIN" | "BOARD";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  active: boolean;
  roles: GlobalRole[];
  memberId: number | null;
};
