import { OFFERS, type OfferId } from "./offers.ts";

/** Messages (both sides) to wait after an offer that wasn't bought before pitching again unprompted. */
export const COOLDOWN_MESSAGES = 30;

/** Why the model wants to show an offer. Only `buying_signal` is unprompted; the others are the user asking. */
export type UpsellTrigger = "buying_signal" | "asked_what_we_offer" | "wants_to_buy";

export type UpsellPolicy = {
  /** proactive: may pitch on buying signals. on_request: only when the user asks about products or buying. */
  mode: "proactive" | "on_request";
  owned: OfferId[];
  lastOffer?: { product: OfferId; messagesAgo: number };
  reason: string;
};

type Part = { type: string; output?: unknown };
type Msg = { role: string; parts: Part[] };

const textOf = (m: Msg) => m.parts.map((p) => ("text" in p ? String(p.text) : "")).join("");

/** Derives the upsell rules from the full (untrimmed) conversation. */
export function getUpsellPolicy(messages: Msg[]): UpsellPolicy {
  const owned = new Set<OfferId>();
  let lastOffer: UpsellPolicy["lastOffer"];

  messages.forEach((m, i) => {
    const text = textOf(m);
    if (m.role === "user" && text.startsWith("Payment confirmed ·")) {
      for (const o of Object.values(OFFERS)) if (text.includes(o.product)) owned.add(o.id);
    }
    for (const p of m.parts) {
      const out = p.output as { available?: boolean; id?: OfferId } | undefined;
      if (p.type === "tool-generate_upsell_link" && out?.available && out.id) {
        lastOffer = { product: out.id, messagesAgo: messages.length - 1 - i };
      }
    }
  });

  const base = { owned: [...owned], lastOffer };
  if (owned.size) return { ...base, mode: "on_request", reason: "already bought something: other products only if they ask" };
  if (lastOffer && lastOffer.messagesAgo < COOLDOWN_MESSAGES) {
    const left = COOLDOWN_MESSAGES - lastOffer.messagesAgo;
    return { ...base, mode: "on_request", reason: `offered ${lastOffer.product} ${lastOffer.messagesAgo} messages ago, not bought (cooldown: ${left} more)` };
  }
  return { ...base, mode: "proactive", reason: "no recent offer" };
}

/** Whether an offer may be shown, and as a text mention or the full card. */
export function decideOffer(policy: UpsellPolicy, product: OfferId, trigger: UpsellTrigger) {
  if (policy.owned.includes(product)) return { available: false, reason: "user already owns this product" } as const;
  if (trigger === "buying_signal" && policy.mode === "on_request") return { available: false, reason: policy.reason } as const;
  return { available: true, display: trigger === "wants_to_buy" ? "card" : "mention" } as const;
}

/** One line appended to the system prompt so the model knows the rules before it writes anything. */
export function upsellStatus(policy: UpsellPolicy) {
  const owned = policy.owned.length ? policy.owned.map((id) => OFFERS[id].product).join(", ") : "nothing";
  const rule =
    policy.mode === "proactive"
      ? "you may mention one fitting product on a clear buying signal"
      : "do NOT mention or hint at any paid product unless the user asks about products, prices or buying";
  return `Upsell status: ${policy.mode} (${policy.reason}); ${rule}. Owned: ${owned}; never offer owned products.`;
}
