import { colors } from "../../styles/ui";

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
  borderColor = colors.border,
  fontSize = "0.9rem",
  fontWeight = 700,
  boxShadow = "0 6px 16px rgba(15, 23, 42, 0.05)",
}: TeamAvatarProps) {
  const initials = getTeamInitials(teamName);

  return (
    <div
      aria-hidden="true"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius,
        border: `1px solid ${borderColor}`,
        background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
        color: colors.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight,
        fontSize,
        flexShrink: 0,
        boxShadow,
      }}
    >
      {initials}
    </div>
  );
}

export default TeamAvatar;