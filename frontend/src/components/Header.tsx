import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";
import type { User } from "../types/user";
import { colors } from "../styles/ui";
import UserAvatar from "./UserAvatar";

type HeaderProps = {
  user: User;
  onLogout: () => void;
};

function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isUserButtonHovered, setIsUserButtonHovered] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.email;

  const isManagementVisible = user.roles.some(
    (role) => role === "ADMIN" || role === "BOARD"
  );

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  function handleNavigateToProfile() {
    setMenuOpen(false);
    navigate("/profile");
  }

  function handleNavigateToManagement() {
    setMenuOpen(false);
    navigate("/management");
  }

  async function handleLogoutClick() {
    setMenuOpen(false);
    await onLogout();
  }

  const userMenuButtonStyle: CSSProperties = {
    padding: "8px 12px",
    borderRadius: "999px",
    backgroundColor:
      menuOpen || isUserButtonHovered ? colors.surface : colors.surfaceSoft,
    border: `1px solid ${colors.border}`,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minHeight: "52px",
    transition:
      "background-color 0.15s ease, border-color 0.15s ease, transform 0.15s ease",
  };

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
                background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
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
                }}
              >
                TTC Manager
              </div>

              <div
                style={{
                  fontSize: "0.8rem",
                  color: colors.textMuted,
                }}
              >
                Mannschaften verwalten
              </div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <HeaderNavLink to="/" label="Start" end />
            <HeaderNavLink to="/teams" label="Mannschaften" />
          </nav>
        </div>

        <div
          ref={menuRef}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={toggleMenu}
            onMouseEnter={() => setIsUserButtonHovered(true)}
            onMouseLeave={() => setIsUserButtonHovered(false)}
            style={userMenuButtonStyle}
          >
            <UserAvatar user={user} size={34} fontSize="0.9rem" />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                lineHeight: 1.1,
                minWidth: 0,
              }}
            >
              <span
                style={{
                  color: colors.textMuted,
                  fontSize: "0.72rem",
                  fontWeight: 500,
                }}
              >
                Angemeldet als
              </span>

              <span
                style={{
                  color: colors.text,
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  whiteSpace: "nowrap",
                }}
              >
                {displayName}
              </span>
            </div>

            <span
              style={{
                color: colors.textMuted,
                fontSize: "0.8rem",
                lineHeight: 1,
                alignSelf: "center",
                transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.15s ease",
                marginLeft: "2px",
              }}
            >
              ▾
            </span>
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                paddingTop: "8px",
                minWidth: "260px",
                zIndex: 30,
              }}
            >
              <div
                style={{
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "14px",
                  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.12)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    padding: "14px",
                    borderBottom: `1px solid ${colors.border}`,
                    backgroundColor: colors.surfaceSoft,
                  }}
                >
                  <UserAvatar user={user} size={42} fontSize="0.95rem" />

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        color: colors.text,
                        fontWeight: 700,
                      }}
                    >
                      {displayName}
                    </div>

                    <div
                      style={{
                        color: colors.textMuted,
                        fontSize: "0.9rem",
                        marginTop: "2px",
                      }}
                    >
                      @{user.username}
                    </div>
                  </div>
                </div>

                <DropdownActionItem
                  label="Mein Profil"
                  onClick={handleNavigateToProfile}
                />

                {isManagementVisible ? (
                  <DropdownActionItem
                    label="Administration"
                    onClick={handleNavigateToManagement}
                  />
                ) : null}

                <DropdownActionItem
                  label="Abmelden"
                  onClick={handleLogoutClick}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function HeaderNavLink({
  to,
  label,
  end = false,
}: {
  to: string;
  label: string;
  end?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <NavLink to={to} end={end}>
      {({ isActive }) => (
        <span
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={navLinkStyle(isActive, isHovered)}
        >
          {label}
        </span>
      )}
    </NavLink>
  );
}

function DropdownActionItem({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void | Promise<void>;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={() => void onClick()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={menuItemStyle(isHovered)}
    >
      {label}
    </button>
  );
}

function navLinkStyle(isActive: boolean, isHovered: boolean): CSSProperties {
  return {
    textDecoration: "none",
    color: isActive ? colors.text : colors.textMuted,
    fontWeight: isActive ? 700 : 600,
    padding: "9px 14px",
    borderRadius: "10px",
    backgroundColor: isActive
      ? colors.primarySoft
      : isHovered
        ? colors.surfaceSoft
        : "transparent",
    transition:
      "background-color 0.15s ease, color 0.15s ease, transform 0.15s ease",
    boxShadow: isActive ? "inset 0 0 0 1px rgba(37, 99, 235, 0.08)" : "none",
    display: "inline-flex",
    alignItems: "center",
  };
}

function menuItemStyle(isHovered: boolean): CSSProperties {
  return {
    width: "100%",
    padding: "12px 14px",
    border: "none",
    backgroundColor: isHovered ? colors.surfaceSoft : "transparent",
    color: colors.text,
    textAlign: "left",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.15s ease, color 0.15s ease",
  };
}

export default Header;