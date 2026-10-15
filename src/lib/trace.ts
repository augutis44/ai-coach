import type { GuardCategory } from "./agent/tools";
import type { CoachMessage, ToolName } from "./types";

const INTENT: Record<string, string> = {
  ask_workout_quiz: "workout_advice",
  search_workouts: "workout_advice",
  generate_upsell_link: "upsell_trigger",
  deliver_purchase: "post_purchase",
  send_review_request: "gratitude",
};

export type Turn = {
  n: number;
  guard?: GuardCategory;
  tool?: ToolName;
  intent: string;
  slots?: { maxMinutes?: number; equipment?: string };
};

/** One entry per assistant reply, derived from the tool calls it made. */
export function getTurns(messages: CoachMessage[]): Turn[] {
  return messages
    .filter((m) => m.role === "assistant")
    .map((m, i) => {
      let guard: GuardCategory | undefined;
      let tool: ToolName | undefined;
      let slots: Turn["slots"];
      for (const p of m.parts) {
        if (p.type === "tool-flag_guardrail") guard ??= p.input?.category;
        else if (p.type.startsWith("tool-")) tool ??= p.type.slice(5) as ToolName;
        if (p.type === "tool-search_workouts") slots ??= p.input;
      }
      const intent = guard ? "guardrail_block" : tool ? INTENT[tool] : "informational";
      return { n: i + 1, guard, tool, intent, slots };
    });
}

export function getSession(turns: Turn[]) {
  const turnOf = (tool: ToolName) => turns.find((t) => t.tool === tool)?.n;
  const slots = turns.findLast((t) => t.slots)?.slots;
  return {
    reviewTurn: turnOf("send_review_request"),
    upsellTurn: turnOf("generate_upsell_link"),
    slots: slots && [slots.maxMinutes && `${slots.maxMinutes} min`, slots.equipment].filter(Boolean).join(" · "),
  };
}
