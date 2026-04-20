import type { CSSProperties } from "react";
import type { User } from "../types/user";
import { colors } from "../styles/ui";

type UserAvatarProps = {
  user: User;
  size?: number;
  fontSize?: string;
};

function getUserInitials(user: User): string {
  const firstInitial = user.firstName?.trim().charAt(0) ?? "";
  const lastInitial = user.lastName?.trim().charAt(0) ?? "";

  const initials = `${firstInitial}${lastInitial}`.toUpperCase().trim();

  if (initials) {
    return initials;
  }

  const usernameInitial = user.username?.trim().charAt(0)?.toUpperCase();
  return usernameInitial || "?";
}

function UserAvatar({
  user,
  size = 40,
  fontSize = "1rem",
}: UserAvatarProps) {
  const initials = getUserInitials(user);

  const avatarStyle: CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "999px",
    border: `1px solid ${colors.borderStrong}`,
    background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
    color: colors.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize,
    flexShrink: 0,
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
    userSelect: "none",
  };

  return <div style={avatarStyle}>{initials}</div>;
}

export default UserAvatar;