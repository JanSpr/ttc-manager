import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/useAuth";
import type { GlobalRole } from "../types/user";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: GlobalRole[];
};

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <p>Lade...</p>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = user.roles.some((role) =>
      allowedRoles.includes(role)
    );

    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}