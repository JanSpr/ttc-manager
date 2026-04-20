import { useContext } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { AuthContext } from "./context/AuthContext";
import ToastProvider from "./context/ToastProvider";
import { useToast } from "./context/useToast";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";

import HomePage from "./pages/HomePage";
import TeamsPage from "./pages/TeamsPage";
import TeamDetailPage from "./pages/TeamDetailPage";
import MemberDetailPage from "./pages/MemberDetailPage";
import LoginPage from "./pages/LoginPage";
import UserProfilePage from "./pages/UserProfilePage";

function AppContent() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { showToast } = useToast();

  if (!auth) {
    throw new Error("AuthContext ist nicht verfügbar.");
  }

  const { user, isAuthenticated, logout } = auth;

  async function handleLogout() {
    try {
      await logout();
      showToast("Erfolgreich ausgeloggt.", "success");
      navigate("/login");
    } catch (error) {
      console.error("Logout fehlgeschlagen", error);
      showToast("Logout fehlgeschlagen.", "error");
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