import AvatarBase from "./ui/AvatarBase";
import type { User } from "../types/user";

function getUserInitials(user: User): string {
  const first = user.firstName?.[0] ?? "";
  const last = user.lastName?.[0] ?? "";

  if (first || last) {
    return `${first}${last}`.toUpperCase();
  }

  return user.email?.slice(0, 2).toUpperCase() ?? "?";
}

type UserAvatarProps = {
  user: User;
  size?: number;
};

function UserAvatar({ user, size = 40 }: UserAvatarProps) {
  return (
    <AvatarBase
      initials={getUserInitials(user)}
      size={size}
      shape="round"
    />
  );
}

export default UserAvatar;