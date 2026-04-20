import { NavLink } from "react-router-dom";
import type { User } from "../types/user";
import { colors } from "../styles/ui";

type HeaderProps = {
  user: User;
  onLogout: () => void;
};

function Header({ user, onLogout }: HeaderProps) {
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.email;

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    textDecoration: "none",
    color: isActive ? colors.text : colors.textMuted,
    fontWeight: isActive ? 700 : 600,
    padding: "9px 14px",
    borderRadius: "10px",
    backgroundColor: isActive ? colors.primarySoft : "transparent",
    transition:
      "background-color 0.15s ease, color 0.15s ease, transform 0.15s ease",
    boxShadow: isActive ? "inset 0 0 0 1px rgba(37, 99, 235, 0.08)" : "none",
  });

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        padding: "14px 16px 0",
        background: "transparent",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "16px 22px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
          border: `1px solid ${colors.border}`,
          borderRadius: "18px",
          backgroundColor: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 14px 34px rgba(15, 23, 42, 0.08)",
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "13px",
                letterSpacing: "0.04em",
                boxShadow: "0 10px 24px rgba(37, 99, 235, 0.24)",
              }}
            >
              TTC
            </div>

            <div>
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: colors.text,
                  lineHeight: 1.1,
                }}
              >
                TTC Manager
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: colors.textMuted,
                  lineHeight: 1.1,
                }}
              >
                Mannschaften verwalten
              </div>
            </div>
          </div>

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
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
          <div
            style={{
              padding: "8px 12px",
              borderRadius: "999px",
              backgroundColor: colors.surfaceSoft,
              border: `1px solid ${colors.border}`,
              fontSize: "0.92rem",
              color: colors.textMuted,
            }}
          >
            Eingeloggt als <strong style={{ color: colors.text }}>{displayName}</strong>
          </div>

          <button
            type="button"
            onClick={onLogout}
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: `1px solid ${colors.borderStrong}`,
              backgroundColor: colors.surface,
              color: colors.text,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
              transition:
                "background-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(15, 23, 42, 0.08)";
              e.currentTarget.style.backgroundColor = "#fcfcfd";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(15, 23, 42, 0.04)";
              e.currentTarget.style.backgroundColor = colors.surface;
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;