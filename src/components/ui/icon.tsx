import type { ComponentProps } from "react";

/** 24-viewBox stroke icon; pass the path(s) as children. */
export function Icon({ size = 16, strokeWidth = 2, children, ...props }: ComponentProps<"svg"> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}
