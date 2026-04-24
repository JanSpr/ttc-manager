import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [managementMenuOpen, setManagementMenuOpen] = useState(false);
  const [isManagementButtonHovered, setIsManagementButtonHovered] =
    useState(false);
  const [isUserButtonHovered, setIsUserButtonHovered] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const managementMenuRef = useRef<HTMLDivElement | null>(null);

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.email;

  const isManagementVisible = user.roles.some(
    (role) => role === "ADMIN" || role === "BOARD"
  );

  const isManagementActive = location.pathname.startsWith("/management");
  const isMembersActive = location.pathname.startsWith("/management/members");
  const isTeamsActive = location.pathname.startsWith("/management/teams");
  const isUsersActive = location.pathname.startsWith("/management/users");

  useEffect(() => {
    if (!menuOpen && !managementMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }

      if (
        managementMenuRef.current &&
        !managementMenuRef.current.contains(target)
      ) {
        setManagementMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setManagementMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen, managementMenuOpen]);

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
    setManagementMenuOpen(false);
  }

  function toggleManagementMenu() {
    setManagementMenuOpen((prev) => !prev);
    setMenuOpen(false);
  }

  function handleNavigateToProfile() {
    setMenuOpen(false);
    navigate("/profile");
  }

  function handleNavigateToManagementMembers() {
    setManagementMenuOpen(false);
    navigate("/management/members");
  }

  function handleNavigateToManagementTeams() {
    setManagementMenuOpen(false);
    navigate("/management/teams");
  }

  function handleNavigateToManagementUsers() {
    setManagementMenuOpen(false);
    navigate("/management/users");
  }

  async function handleLogoutClick() {
    setMenuOpen(false);
    await onLogout();
  }

  const managementButtonStyle: CSSProperties = {
    border: "none",
    color: isManagementActive ? colors.text : colors.textMuted,
    fontWeight: isManagementActive ? 700 : 600,
    padding: "9px 14px",
    borderRadius: "10px",
    backgroundColor: isManagementActive
      ? colors.primarySoft
      : isManagementButtonHovered
        ? colors.surfaceSoft
        : "transparent",
    transition:
      "background-color 0.15s ease, color 0.15s ease, transform 0.15s ease",
    boxShadow: isManagementActive
      ? "inset 0 0 0 1px rgba(37, 99, 235, 0.08)"
      : "none",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "1rem",
  };

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

            {isManagementVisible ? (
              <div
                ref={managementMenuRef}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  onClick={toggleManagementMenu}
                  onMouseEnter={() => setIsManagementButtonHovered(true)}
                  onMouseLeave={() => setIsManagementButtonHovered(false)}
                  aria-expanded={managementMenuOpen}
                  style={managementButtonStyle}
                >
                  Verwaltung
                  <span
                    style={{
                      color: colors.textMuted,
                      fontSize: "0.8rem",
                      lineHeight: 1,
                      alignSelf: "center",
                      transform: managementMenuOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.15s ease",
                      marginLeft: "2px",
                    }}
                  >
                    ▾
                  </span>
                </button>

                {managementMenuOpen ? (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      paddingTop: "8px",
                      minWidth: "220px",
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
                        padding: "6px",
                      }}
                    >
                      <ManagementMenuItem
                        label="Mitglieder"
                        isActive={isMembersActive}
                        onClick={handleNavigateToManagementMembers}
                      />

                      <ManagementMenuItem
                        label="Mannschaften"
                        isActive={isTeamsActive}
                        onClick={handleNavigateToManagementTeams}
                      />

                      <ManagementMenuItem
                        label="Benutzer"
                        isActive={isUsersActive}
                        onClick={handleNavigateToManagementUsers}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
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

function ManagementMenuItem({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={managementMenuItemStyle(isActive, isHovered)}
    >
      <ManagementItemIcon />
      <span>{label}</span>
    </button>
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

function managementMenuItemStyle(
  isActive: boolean,
  isHovered: boolean
): CSSProperties {
  return {
    width: "100%",
    padding: "10px 12px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: isActive
      ? colors.primarySoft
      : isHovered
        ? colors.surfaceSoft
        : "transparent",
    color: colors.text,
    textAlign: "left",
    fontWeight: isActive ? 700 : 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "background-color 0.15s ease, color 0.15s ease",
  };
}

const managementIconStyle: CSSProperties = {
  width: "18px",
  height: "18px",
  flexShrink: 0,
  opacity: 0.8,
};

function ManagementItemIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={managementIconStyle}
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

export default Header;