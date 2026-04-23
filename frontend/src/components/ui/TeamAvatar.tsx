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
};

function TeamAvatar({ teamName, size = 44 }: TeamAvatarProps) {
  return (
    <AvatarBase
      initials={getTeamInitials(teamName)}
      size={size}
      shape="rounded"
    />
  );
}

export default TeamAvatar;