import type { ComponentProps } from "react";

const VARIANTS = {
  primary: "bg-teal text-white hover:bg-teal-dark hover:text-white",
  outline: "bg-white text-teal border border-teal hover:bg-teal-soft hover:text-teal",
  dark: "bg-ink text-white hover:bg-black hover:text-white",
  flame: "bg-flame text-white hover:bg-flame-dark hover:text-white",
};

type Variant = keyof typeof VARIANTS;

const classes = (variant: Variant, className = "") =>
  `inline-flex items-center justify-center gap-2 min-h-11 px-4.5 rounded-[10px] font-semibold no-underline transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${VARIANTS[variant]} ${className}`;

export function Button({ variant = "primary", className, ...props }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button type="button" className={classes(variant, className)} {...props} />;
}

/** External link styled as a button; opens in a new tab. */
export function ButtonLink({ variant = "primary", className, ...props }: ComponentProps<"a"> & { variant?: Variant }) {
  return <a target="_blank" rel="noreferrer" className={classes(variant, className)} {...props} />;
}
