import { NavLink } from "react-router-dom";
import type { User } from "../types/user";

type HeaderProps = {
  user: User;
  onLogout: () => void;
};

function Header({ user, onLogout }: HeaderProps) {
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.email;

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    textDecoration: "none",
    color: isActive ? "#111827" : "#4b5563",
    fontWeight: isActive ? 700 : 500,
    padding: "8px 12px",
    borderRadius: "8px",
    backgroundColor: isActive ? "#e5e7eb" : "transparent",
  });

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        padding: "16px 24px",
        marginBottom: "24px",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "#ffffff",
        position: "sticky",
        top: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: "20px", fontWeight: 700 }}>TTC Manager</div>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <NavLink to="/" style={navLinkStyle} end>
            Home
          </NavLink>

          <NavLink to="/teams" style={navLinkStyle}>
            Teams
          </NavLink>
        </nav>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        <span
          style={{
            color: "#374151",
            fontSize: "14px",
          }}
        >
          Eingeloggt als <strong>{displayName}</strong>
        </span>

        <button
          type="button"
          onClick={onLogout}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            backgroundColor: "#f9fafb",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;