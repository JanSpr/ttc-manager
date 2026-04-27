import type { CSSProperties, ReactNode } from "react";
import { badgeStyle, colors } from "../../styles/ui";

type BadgeVariant = "primary" | "neutral";
type BadgeSize = "sm" | "md";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: CSSProperties;
};

function getVariantStyle(variant: BadgeVariant): CSSProperties {
  if (variant === "neutral") {
    return {
      backgroundColor: colors.surfaceSoft,
      color: colors.textMuted,
    };
  }

  return {
    backgroundColor: colors.primarySoft,
    color: colors.primary,
  };
}

function getSizeStyle(size: BadgeSize): CSSProperties {
  if (size === "sm") {
    return {
      fontSize: "0.75rem",
      padding: "0.2rem 0.5rem",
      fontWeight: 600,
    };
  }

  return {};
}

function Badge({
  children,
  variant = "primary",
  size = "md",
  style,
}: BadgeProps) {
  return (
    <span
      style={{
        ...badgeStyle,
        ...getVariantStyle(variant),
        ...getSizeStyle(size),
        opacity: 1,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export default Badge;