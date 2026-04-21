import type { CSSProperties } from "react";
import { colors, subtleLabelStyle } from "../../styles/ui";

type DataFieldProps = {
  label: string;
  value: string;
  preserveFullValue?: boolean;
  style?: CSSProperties;
};

export default function DataField({
  label,
  value,
  preserveFullValue = false,
  style,
}: DataFieldProps) {
  return (
    <div
      style={{
        padding: "1rem 1.1rem",
        border: `1px solid ${colors.border}`,
        borderRadius: "14px",
        backgroundColor: colors.surface,
        minWidth: 0,
        ...style,
      }}
    >
      <div style={subtleLabelStyle}>{label}</div>

      <div
        style={{
          color: colors.text,
          fontWeight: 600,
          lineHeight: 1.4,
          overflowWrap: preserveFullValue ? "anywhere" : "break-word",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}