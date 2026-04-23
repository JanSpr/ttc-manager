import AvatarBase from "./ui/AvatarBase";
import type { Member } from "../types/member";

function getMemberInitials(member: Member): string {
  const first = member.firstName?.[0] ?? "";
  const last = member.lastName?.[0] ?? "";

  if (first || last) {
    return `${first}${last}`.toUpperCase();
  }

  return "?";
}

type MemberAvatarProps = {
  member: Member;
  size?: number;
};

function MemberAvatar({ member, size = 40 }: MemberAvatarProps) {
  const isRegistered = member.userId != null;

  return (
    <AvatarBase
      initials={getMemberInitials(member)}
      size={size}
      shape="round"
      tone={isRegistered ? "default" : "muted"}
    />
  );
}

export default MemberAvatar;