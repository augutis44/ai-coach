import { describe, it, expect } from "vitest";
import { COOLDOWN_MESSAGES, decideOffer, getUpsellPolicy } from "./upsell-policy";

const user = (text: string) => ({ role: "user", parts: [{ type: "text", text }] });
const reply = () => ({ role: "assistant", parts: [{ type: "text", text: "ok" }] });
const offer = (id: string, available = true) => ({
  role: "assistant",
  parts: [{ type: "tool-generate_upsell_link", output: { id, available } }],
});
const filler = (n: number) => Array.from({ length: n }, (_, i) => (i % 2 ? reply() : user("hi")));

describe("getUpsellPolicy", () => {
  it("is proactive in a fresh chat", () => {
    expect(getUpsellPolicy([user("hi")]).mode).toBe("proactive");
  });

  it("cools down after an unbought offer, then reopens after the cooldown", () => {
    const recent = getUpsellPolicy([user("plateau"), offer("shred_pdf"), ...filler(4)]);
    expect(recent.mode).toBe("on_request");
    expect(recent.lastOffer).toEqual({ product: "shred_pdf", messagesAgo: 4 });
    expect(getUpsellPolicy([offer("shred_pdf"), ...filler(COOLDOWN_MESSAGES)]).mode).toBe("proactive");
  });

  it("ignores offers the tool refused", () => {
    expect(getUpsellPolicy([offer("shred_pdf", false), user("hi")]).mode).toBe("proactive");
  });

  it("tracks purchases and stays on request forever after one", () => {
    const p = getUpsellPolicy([user("Payment confirmed · TestDiet Recipe Book · $14.99"), ...filler(40)]);
    expect(p).toMatchObject({ mode: "on_request", owned: ["recipe_book"] });
  });
});

describe("decideOffer", () => {
  const fresh = getUpsellPolicy([]);
  const cooling = getUpsellPolicy([offer("recipe_book"), user("hmm")]);

  it("shows a text mention for signals and asks, the card only for buy intent", () => {
    expect(decideOffer(fresh, "shred_pdf", "buying_signal")).toEqual({ available: true, display: "mention" });
    expect(decideOffer(fresh, "shred_pdf", "asked_what_we_offer")).toEqual({ available: true, display: "mention" });
    expect(decideOffer(fresh, "shred_pdf", "wants_to_buy")).toEqual({ available: true, display: "card" });
  });

  it("blocks unprompted pitches during cooldown but lets the user ask", () => {
    expect(decideOffer(cooling, "shred_pdf", "buying_signal").available).toBe(false);
    expect(decideOffer(cooling, "recipe_book", "wants_to_buy")).toEqual({ available: true, display: "card" });
  });

  it("never offers an owned product, even when asked", () => {
    const owner = getUpsellPolicy([user("Payment confirmed · 12-Week Get Shredded · $9.99")]);
    expect(decideOffer(owner, "shred_pdf", "wants_to_buy").available).toBe(false);
    expect(decideOffer(owner, "progress_tracker", "asked_what_we_offer").available).toBe(true);
  });
});
