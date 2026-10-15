import type { ComponentProps } from "react";

const VARIANTS = {
  primary: "bg-primary text-primary-fg hover:opacity-90 hover:text-primary-fg",
  outline: "bg-surface text-ink border border-line hover:bg-raised hover:text-ink",
  lime: "bg-lime text-zinc-900 hover:brightness-95 hover:text-zinc-900",
};

type Variant = keyof typeof VARIANTS;

const classes = (variant: Variant, className = "") =>
  `inline-flex items-center justify-center gap-2 min-h-10 px-4 rounded-[10px] text-sm font-semibold no-underline transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-text ${VARIANTS[variant]} ${className}`;

export function Button({ variant = "primary", className, ...props }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button type="button" className={classes(variant, className)} {...props} />;
}

/** External link styled as a button; opens in a new tab. */
export function ButtonLink({ variant = "primary", className, ...props }: ComponentProps<"a"> & { variant?: Variant }) {
  return <a target="_blank" rel="noreferrer" className={classes(variant, className)} {...props} />;
}
