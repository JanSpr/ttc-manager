import type { Member } from "../types/member";
import AvatarBase from "./ui/AvatarBase";

type MemberAvatarProps = {
  member?: Pick<
    Member,
    "firstName" | "lastName" | "fullName" | "userId" | "accountActivated"
  >;
  fullName?: string;
  isRegistered?: boolean;
  size?: number;
  fontSize?: string;
  boxShadow?: string;
};

function getInitialsFromName(fullName: string): string {
  const trimmedName = fullName.trim();

  if (!trimmedName) {
    return "?";
  }

  const words = trimmedName.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return trimmedName.slice(0, 2).toUpperCase();
}

function getMemberDisplayName(
  member?: Pick<
    Member,
    "firstName" | "lastName" | "fullName" | "userId" | "accountActivated"
  >,
  fullName?: string
): string {
  if (member?.fullName?.trim()) {
    return member.fullName.trim();
  }

  if (fullName?.trim()) {
    return fullName.trim();
  }

  const firstName = member?.firstName?.trim() ?? "";
  const lastName = member?.lastName?.trim() ?? "";
  const combinedName = `${firstName} ${lastName}`.trim();

  return combinedName || "?";
}

function MemberAvatar({
  member,
  fullName,
  isRegistered,
  size = 40,
  fontSize = "1rem",
  boxShadow = "0 10px 24px rgba(15, 23, 42, 0.06)",
}: MemberAvatarProps) {
  const displayName = getMemberDisplayName(member, fullName);

  // ✅ NEUE, korrekte Logik
  const resolvedIsRegistered =
    isRegistered ??
    (member?.accountActivated === true);

  return (
    <AvatarBase
      initials={getInitialsFromName(displayName)}
      size={size}
      shape="round"
      tone={resolvedIsRegistered ? "default" : "muted"}
      fontSize={fontSize}
      fontWeight={800}
      borderColor={resolvedIsRegistered ? "#d1d5db" : "#cbd5e1"}
      boxShadow={boxShadow}
    />
  );
}

export default MemberAvatar;