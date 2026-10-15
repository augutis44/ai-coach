import type { ToolName } from "@/lib/types";

/** Small monospace tool name shown on every tool result (prototype debug aid). */
export function ToolLabel({ name, className = "text-muted" }: { name: ToolName; className?: string }) {
  return <span className={`font-mono text-xs leading-4 ${className}`}>{name}</span>;
}
