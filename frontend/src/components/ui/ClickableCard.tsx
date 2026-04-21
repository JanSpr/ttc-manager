import type { CSSProperties, ReactNode } from "react";
import {
  clickableCardStyle,
  applyClickableCardHover,
  resetClickableCardHover,
} from "../../styles/ui";

type ClickableCardProps = {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
};

export default function ClickableCard({
  children,
  style,
  className,
}: ClickableCardProps) {
  return (
    <div
      className={className}
      style={{ ...clickableCardStyle, ...style }}
      onMouseEnter={(event) => applyClickableCardHover(event.currentTarget)}
      onMouseLeave={(event) => resetClickableCardHover(event.currentTarget)}
    >
      {children}
    </div>
  );
}