import type { GuardCategory } from "@/lib/agent/tools";
import { Icon } from "@/components/ui/icon";

export const GUARD_LABEL: Record<GuardCategory, string> = {
  starvation_diet: "extreme diet",
  medical: "medical advice",
  off_topic: "off-topic",
};

export function GuardrailNotice({ category }: { category: GuardCategory }) {
  return (
    <div role="note" className="inline-flex self-start items-center gap-2 px-2.5 py-1.5 rounded-lg bg-soft text-xs leading-4 text-muted">
      <Icon size={14}><path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5z" /></Icon>
      <span>Safety guardrail · {GUARD_LABEL[category]}, redirected</span>
    </div>
  );
}
