import type { GuardCategory } from "@/lib/agent/tools";

export const GUARD_LABEL: Record<GuardCategory, string> = {
  starvation_diet: "extreme starvation diet",
  medical: "medical diagnosis",
  off_topic: "off-topic or explicit content",
};

export function GuardrailNotice({ category }: { category: GuardCategory }) {
  return (
    <div
      role="note"
      className="flex items-center gap-2 px-3 py-2 bg-danger-soft border border-danger-line rounded-lg text-[13px] leading-4 text-danger"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0"
      >
        <path d="M8 2 L14 13 H2 Z" />
        <path d="M8 6.5 V9.5" />
        <path d="M8 11.5 V11.6" />
      </svg>
      <span>Guardrail: {GUARD_LABEL[category]} · refused and redirected</span>
    </div>
  );
}
