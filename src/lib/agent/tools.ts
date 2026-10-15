import { jsonSchema, tool } from "ai";
import { OFFER_IDS, OFFERS, type OfferId } from "./offers.ts";
import { projectTwelveWeeks, type Goal } from "./projection.ts";
import { decideOffer, getUpsellPolicy, type UpsellPolicy, type UpsellTrigger } from "./upsell-policy.ts";
import { WORKOUT_QUIZ, WORKOUTS, type Workout } from "./workouts.ts";

export type GuardCategory = "starvation_diet" | "medical" | "off_topic";

/** What the user gets right after paying for a non-plan product (the 12-week plan has its own richer delivery). */
const DELIVERIES = {
  recipe_book: {
    status: "Printing now · ships in 3–5 days",
    highlights: ["Digital preview PDF in your email", "Shopping lists for week 1", "Recipes tuned after a 2-minute taste quiz"],
    next: "Take the taste quiz",
  },
  progress_tracker: {
    status: "Unlocked · lifetime access",
    highlights: ["Daily log for workouts, weight & measurements", "Streaks with evening reminders", "Weekly progress report from Max every Sunday"],
    next: "Log today's weight",
  },
};

/** The upsell tool, bound to this conversation's frequency rules (see upsell-policy.ts). */
export function upsellTool(policy: UpsellPolicy) {
  return tool({
    description:
      "Offer the ONE paid product that fits the user's main problem. Returns available:false when the frequency rules don't allow it; then don't mention any product. display:'mention' = weave the link into your text; display:'card' = the full offer card is shown.",
    inputSchema: jsonSchema<{ product: OfferId; trigger: UpsellTrigger; goal?: Goal; weightKg?: number; targetKg?: number }>({
      type: "object",
      properties: {
        product: { type: "string", enum: OFFER_IDS },
        trigger: {
          type: "string",
          enum: ["buying_signal", "asked_what_we_offer", "wants_to_buy"],
          description:
            "buying_signal: you noticed a signal (price, plateau, deadline, faster results, structured plan) but they didn't ask for a product. asked_what_we_offer: they asked what else you offer. wants_to_buy: they want to buy, ask the price of a product, ask to see it, or said yes to a product you mentioned.",
        },
        goal: { type: "string", enum: ["lose_fat", "build_muscle", "get_stronger", "endurance"], description: "The user's goal, only if they said it" },
        weightKg: { type: "number", description: "Current bodyweight in kg, only if they said it (convert lb to kg)" },
        targetKg: { type: "number", description: "How many kg they want to lose or gain, only if they said it" },
      },
      required: ["product", "trigger"],
    }),
    execute: async ({ product, trigger, goal, weightKg, targetKg }) => {
      const decision = decideOffer(policy, product, trigger);
      if (!decision.available) return { available: false as const, id: product, reason: decision.reason };
      return {
        available: true as const,
        display: decision.display,
        ...OFFERS[product],
        projection: goal ? projectTwelveWeeks(goal, weightKg, targetKg) : undefined,
      };
    },
  });
}

export const tools = {
  ask_workout_quiz: tool({
    description:
      "Show a quick quiz (time, equipment, energy) when the user wants a workout but hasn't said how much time or what equipment they have.",
    inputSchema: jsonSchema<Record<string, never>>({ type: "object", properties: {} }),
    execute: async () => ({ questions: WORKOUT_QUIZ }),
  }),
  search_workouts: tool({
    description:
      "Search the workout library by available time and equipment. Use when the user asks which workout to do.",
    inputSchema: jsonSchema<{ maxMinutes?: number; equipment?: string }>({
      type: "object",
      properties: {
        maxMinutes: {
          type: "number",
          description: "Max minutes the user has, if they said",
        },
        equipment: {
          type: "string",
          enum: [
            "none",
            "dumbbells",
            "kettlebell",
            "band",
            "mat",
            "gym",
            "outdoor",
          ],
          description: "Equipment the user has, if they said",
        },
      },
    }),
    execute: async ({ maxMinutes, equipment }): Promise<Workout[]> => {
      const fits = WORKOUTS.filter(
        (w) =>
          (!maxMinutes || w.minutes <= maxMinutes) &&
          (!equipment ||
            w.equipment === "none" ||
            (equipment !== "none" && w.equipment.includes(equipment))),
      );
      return fits.length ? fits : WORKOUTS;
    },
  }),
  generate_upsell_link: upsellTool(getUpsellPolicy([])),
  deliver_purchase: tool({
    description:
      "Deliver a product after checkout confirms payment. Call once, right after a 'Payment confirmed · <product>' message.",
    inputSchema: jsonSchema<{ product: OfferId; track?: "dumbbell" | "gym" }>({
      type: "object",
      properties: {
        product: { type: "string", enum: OFFER_IDS, description: "The product named in the payment confirmation" },
        track: {
          type: "string",
          enum: ["dumbbell", "gym"],
          description: "12-Week Get Shredded only: gym if the user trains at a gym, otherwise dumbbell",
        },
      },
      required: ["product"],
    }),
    execute: async ({ product, track = "dumbbell" }) => {
      if (product === "shred_pdf")
        return {
          kind: "plan" as const,
          product: OFFERS.shred_pdf.product,
          track,
          pdf: {
            name: `get-shredded-12w-${track}.pdf`,
            pages: 96,
            url: `https://files.fitpulse.example/get-shredded-12w-${track}.pdf`,
          },
          week1: [
            { day: "Mon", name: "Full body", minutes: 25 },
            { day: "Wed", name: "Upper", minutes: 25 },
            { day: "Fri", name: "Lower", minutes: 25 },
            { day: "Sun", name: "Mobility", minutes: 15 },
          ],
        };
      return { kind: "order" as const, product: OFFERS[product].product, ...DELIVERIES[product] };
    },
  }),
  send_review_request: tool({
    description:
      "Show the user a Trustpilot review request. Use when the user is happy or grateful.",
    inputSchema: jsonSchema<Record<string, never>>({
      type: "object",
      properties: {},
    }),
    execute: async () => ({
      url: "https://www.trustpilot.com/evaluate/fitpulse.example",
    }),
  }),
  flag_guardrail: tool({
    description:
      "Flag an unsafe message before refusing it. Call for starvation/extreme diets, medical diagnoses, or off-topic/explicit content.",
    inputSchema: jsonSchema<{ category: GuardCategory }>({
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["starvation_diet", "medical", "off_topic"],
        },
      },
      required: ["category"],
    }),
    execute: async ({ category }) => ({ blocked: true, category }),
  }),
};
