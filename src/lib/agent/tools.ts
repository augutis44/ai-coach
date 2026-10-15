import { jsonSchema, tool } from "ai";
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
    execute: async ({ product }) =>
      product === "recipe_book"
        ? {
            product: "TestDiet Recipe Book",
            blurb: "Personalized recipes, printed just for you.",
            price: "",
            url: "https://checkout.fitpulse.example/testdiet-recipe-book?ref=coach",
          }
        : {
            product: "12-Week Get Shredded PDF",
            blurb:
              "Progressive plan, weekly check-ins, printable. One-time $9.99.",
            price: "$9.99",
            url: "https://checkout.fitpulse.example/get-shredded-12w?ref=coach",
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
