export type UserRole = "PLAYER" | "CAPTAIN" | "ADMIN";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: UserRole;
  active: boolean;
  teamIds: number[];
};