import type { User } from "../types/user";
import AvatarBase from "./ui/AvatarBase";

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
  return (
    <AvatarBase
      initials={getUserInitials(user)}
      size={size}
      shape="round"
      fontSize={fontSize}
      fontWeight={800}
      borderColor="#d1d5db"
      boxShadow="0 10px 24px rgba(15, 23, 42, 0.06)"
    />
  );
}

export default UserAvatar;