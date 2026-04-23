import AvatarBase from "./AvatarBase";

function getTeamInitials(teamName: string): string {
  const trimmedName = teamName.trim();

  if (!trimmedName) return "?";

  const words = trimmedName.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return trimmedName.slice(0, 2).toUpperCase();
}

type TeamAvatarProps = {
  teamName: string;
  size?: number;
  borderRadius?: string;
  borderColor?: string;
  fontSize?: string;
  fontWeight?: number;
  boxShadow?: string;
};

function TeamAvatar({
  teamName,
  size = 44,
  borderRadius = "12px",
  borderColor,
  fontSize = "0.9rem",
  fontWeight = 700,
  boxShadow = "0 6px 16px rgba(15, 23, 42, 0.05)",
}: TeamAvatarProps) {
  const shape =
    borderRadius === "999px" || borderRadius === "50%"
      ? "round"
      : "rounded";

  return (
    <AvatarBase
      initials={getTeamInitials(teamName)}
      size={size}
      shape={shape}
      tone="team"
      fontSize={fontSize}
      fontWeight={fontWeight}
      borderColor={borderColor}
      boxShadow={boxShadow}
    />
  );
}

export default TeamAvatar;