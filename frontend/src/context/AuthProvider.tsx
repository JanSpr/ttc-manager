import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../types/user";
import {
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from "../api/authApi";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCurrentUser = useCallback(async () => {
    try {
      const response = await fetchCurrentUser();
      setUser(response.authenticated ? response.user : null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    async function init() {
      await refreshCurrentUser();
      setIsLoading(false);
    }

    void init();
  }, [refreshCurrentUser]);

  const login = useCallback(
    async ({
      identifier,
      password,
    }: {
      identifier: string;
      password: string;
    }) => {
      const response = await loginRequest({ identifier, password });

      if (!response.authenticated || !response.user) {
        throw new Error("Login fehlgeschlagen");
      }

      setUser(response.user);
    },
    []
  );

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  const updateAuthenticatedUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
      refreshCurrentUser,
      updateAuthenticatedUser,
    }),
    [user, isLoading, login, logout, refreshCurrentUser, updateAuthenticatedUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}