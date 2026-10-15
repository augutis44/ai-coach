import { describe, expect, it } from "vitest";
import { tools } from "./tools";
import type { Workout } from "./workouts";

const names = async (input: Parameters<NonNullable<typeof tools.search_workouts.execute>>[0]) =>
  ((await tools.search_workouts.execute!(input, { toolCallId: "t", messages: [], context: {} })) as Workout[]).map((w) => w.name);

describe("search_workouts", () => {
  it("narrows by focus and intensity when something matches, else keeps the time/equipment fits", async () => {
    expect(await names({ maxMinutes: 20, equipment: "none", focus: "legs", intensity: "high" })).toEqual(["Bodyweight Leg Burner"]);
    // No 20-minute no-equipment strength session: fall back to everything that fits the time and gear.
    expect(await names({ maxMinutes: 20, equipment: "none", focus: "strength" })).toEqual(["Bodyweight HIIT 20", "Bodyweight Leg Burner", "Core Crusher"]);
  });
});
