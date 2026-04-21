import type { CSSProperties, ReactNode } from "react";
import { contentCardStyle } from "../../styles/ui";

type CardProps = {
  children: ReactNode;
  style?: CSSProperties;
};

export default function Card({ children, style }: CardProps) {
  return <section style={{ ...contentCardStyle, ...style }}>{children}</section>;
}