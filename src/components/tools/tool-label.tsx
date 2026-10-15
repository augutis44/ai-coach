import type { ToolName } from "@/lib/types";

/** Small "tool · name" kicker shown on every tool result (prototype debug aid). */
export function ToolLabel({ name, className }: { name: ToolName; className: string }) {
  return (
    <span className={`text-xs leading-4 font-semibold uppercase tracking-[0.06em] ${className}`}>
      tool · {name}
    </span>
  );
}
