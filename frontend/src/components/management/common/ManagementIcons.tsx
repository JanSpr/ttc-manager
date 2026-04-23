import type { ReactNode } from "react";

function IconWrapper({
  children,
  size = 16,
}: {
  children: ReactNode;
  size?: number;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        color: "currentColor",
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
}

export function EditIcon({ size = 16 }: { size?: number }) {
  return (
    <IconWrapper size={size}>
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 20h4l10-10-4-4L4 16v4z" />
        <path d="M12 6l4 4" />
      </svg>
    </IconWrapper>
  );
}

export function EyeIcon({ size = 16 }: { size?: number }) {
  return (
    <IconWrapper size={size}>
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </IconWrapper>
  );
}

export function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <IconWrapper size={size}>
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    </IconWrapper>
  );
}