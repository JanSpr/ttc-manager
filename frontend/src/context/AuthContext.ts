import { createContext } from "react";
import type { User } from "../types/user";

export type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: { identifier: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshCurrentUser: () => Promise<void>;
  updateAuthenticatedUser: (user: User) => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);