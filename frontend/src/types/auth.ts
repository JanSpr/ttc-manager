import type { User } from "./user";

export type LoginRequest = {
  identifier: string;
  password: string;
};

export type AuthResponse = {
  authenticated: boolean;
  user: User | null;
};