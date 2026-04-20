import type { User } from "./user";

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  authenticated: boolean;
  user: User | null;
};