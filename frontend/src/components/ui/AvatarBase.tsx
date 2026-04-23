import { colors } from "../../styles/ui";

type AvatarBaseProps = {
  initials: string;
  size?: number;
  shape?: "round" | "rounded";
  tone?: "default" | "muted";
  fontSize?: string;
  fontWeight?: number;
  borderColor?: string;
  boxShadow?: string;
};

function AvatarBase({
  initials,
  size = 44,
  shape = "rounded",
  tone = "default",
  fontSize = "0.9rem",
  fontWeight = 700,
  borderColor,
  boxShadow = "0 6px 16px rgba(15, 23, 42, 0.05)",
}: AvatarBaseProps) {
  const isMuted = tone === "muted";

  const background = isMuted
    ? "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)"
    : "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)";

  const textColor = isMuted ? "#64748b" : colors.primary;

  const finalBorderColor = borderColor ?? (isMuted ? "#cbd5f5" : colors.border);

  const borderRadius = shape === "round" ? "50%" : "12px";

  return (
    <div
      aria-hidden="true"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius,
        border: `1px solid ${finalBorderColor}`,
        background,
        color: textColor,
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

export default AvatarBase;