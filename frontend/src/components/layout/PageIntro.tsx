import type { CSSProperties, ReactNode } from "react";
import {
  colors,
  contentCardStyle,
  sectionTitleStyle,
  sectionDescriptionStyle,
} from "../../styles/ui";

type PageIntroProps = {
  title: string;
  description?: string;
  eyebrow?: ReactNode;
  accent?: boolean;
  style?: CSSProperties;
};

export default function PageIntro({
  title,
  description,
  eyebrow,
  accent = false,
  style,
}: PageIntroProps) {
  return (
    <section
      style={{
        ...contentCardStyle,
        marginTop: 0,
        padding: "1.75rem",
        background: accent
          ? "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%), #ffffff"
          : colors.surface,
        ...style,
      }}
    >
      {eyebrow ? (
        <div
          style={{
            marginBottom: "0.45rem",
            fontSize: "0.82rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: colors.primary,
          }}
        >
          {eyebrow}
        </div>
      ) : null}

      <h1 style={sectionTitleStyle}>{title}</h1>

      {description ? (
        <p style={sectionDescriptionStyle}>{description}</p>
      ) : null}
    </section>
  );
}