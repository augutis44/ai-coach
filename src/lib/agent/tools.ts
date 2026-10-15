import { jsonSchema, tool } from "ai";
import { OFFERS } from "./offers.ts";
import { WORKOUTS, type Workout } from "./workouts.ts";

export type GuardCategory = "starvation_diet" | "medical" | "off_topic";

export const tools = {
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
  generate_upsell_link: tool({
    description:
      "Create a checkout link for a paid upsell. Use when the user wants a structured plan, accelerated results, or asks what else we offer.",
    inputSchema: jsonSchema<{ product: "shred_pdf" | "recipe_book" }>({
      type: "object",
      properties: {
        product: { type: "string", enum: ["shred_pdf", "recipe_book"] },
      },
      required: ["product"],
    }),
    execute: async ({ product }) => OFFERS[product],
  }),
  deliver_purchase: tool({
    description:
      "Deliver the 12-Week Get Shredded plan after checkout confirms payment. Call once, right after a 'Payment confirmed' message.",
    inputSchema: jsonSchema<{ track?: "dumbbell" | "gym" }>({
      type: "object",
      properties: {
        track: {
          type: "string",
          enum: ["dumbbell", "gym"],
          description: "Equipment track; gym only if the user trains at a gym, otherwise dumbbell",
        },
      },
    }),
    execute: async ({ track = "dumbbell" }) => ({
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
    }),
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
