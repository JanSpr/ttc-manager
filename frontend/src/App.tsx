import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ToastProvider from "./context/ToastProvider";
import { useToast } from "./context/useToast";
import { useAuth } from "./context/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";

import HomePage from "./pages/HomePage";
import TeamsPage from "./pages/TeamsPage";
import TeamDetailPage from "./pages/TeamDetailPage";
import MemberDetailPage from "./pages/MemberDetailPage";
import LoginPage from "./pages/LoginPage";
import ActivateAccountPage from "./pages/ActivateAccountPage";
import UserProfilePage from "./pages/UserProfilePage";
import ManagementMembersPage from "./pages/ManagementMembersPage";
import ManagementTeamsPage from "./pages/ManagementTeamsPage";
import ManagementUsersPage from "./pages/ManagementUsersPage";

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handleLogout() {
    try {
      await logout();
      showToast("Erfolgreich abgemeldet.", "success");
      navigate("/login");
    } catch (error) {
      console.error("Abmeldung fehlgeschlagen", error);
      showToast("Abmeldung fehlgeschlagen.", "error");
    }
  }

  return (
    <div
      className="app-shell"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
      }}
    >
      {isAuthenticated && user ? (
        <Header user={user} onLogout={handleLogout} />
      ) : null}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "16px 24px 32px",
        }}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/activate" element={<ActivateAccountPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teams"
            element={
              <ProtectedRoute>
                <TeamsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teams/:id"
            element={
              <ProtectedRoute>
                <TeamDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/members/:id"
            element={
              <ProtectedRoute>
                <MemberDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/management"
            element={<Navigate to="/management/members" replace />}
          />

          <Route
            path="/management/members"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "BOARD"]}>
                <ManagementMembersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/management/teams"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "BOARD"]}>
                <ManagementTeamsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/management/users"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "BOARD"]}>
                <ManagementUsersPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;