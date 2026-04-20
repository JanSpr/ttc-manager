import { useContext } from "react";
import { AuthContext } from "./AuthContext";

/**
 * Hook zum Zugriff auf den AuthContext.
 *
 * Stellt sicher, dass der Context vorhanden ist.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth muss innerhalb eines AuthProvider verwendet werden.");
  }

  return context;
}