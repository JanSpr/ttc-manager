import type { CSSProperties, ReactNode } from "react";
import { colors } from "../../styles/ui";

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  style?: CSSProperties;
};

export default function FormField({
  label,
  htmlFor,
  children,
  style,
}: FormFieldProps) {
  return (
    <div
      style={{
        display: "grid",
        gap: "8px",
        ...style,
      }}
    >
      <label
        htmlFor={htmlFor}
        style={{
          fontSize: "0.92rem",
          fontWeight: 700,
          color: colors.text,
        }}
      >
        {label}
      </label>

      {children}
    </div>
  );
}