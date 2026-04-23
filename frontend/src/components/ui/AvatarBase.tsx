import { colors } from "../../styles/ui";

type AvatarBaseProps = {
  initials: string;
  size?: number;
  shape?: "round" | "rounded";
  tone?: "default" | "muted" | "team";
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
  let background = "";
  let textColor = "";
  let finalBorderColor = borderColor;

  if (tone === "muted") {
    // 👤 nicht registriert (jetzt im blauen System)
    background = "#ffffff";
    textColor = "#60a5fa"; // helles Blau (tailwind blue-400)
    finalBorderColor = borderColor ?? "#93c5fd"; // blue-300
  } else if (tone === "team") {
    background = "linear-gradient(135deg, #ede9fe 0%, #eef2ff 100%)";
    textColor = colors.primary;
    finalBorderColor = borderColor ?? colors.border;
  } else {
    // 👤 registriert
    background = "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)";
    textColor = colors.primary;
    finalBorderColor = borderColor ?? colors.border;
  }

  const borderRadius = shape === "round" ? "999px" : "12px";

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
        userSelect: "none",
      }}
    >
      {initials}
    </div>
  );
}

export default AvatarBase;