import { describe, it, expect } from "vitest";
import { getSession, getTurns } from "./trace";
import type { CoachMessage } from "./types";

const user = (id: string): CoachMessage => ({ id, role: "user", parts: [{ type: "text", text: "hi" }] });
const assistant = (id: string, parts: unknown[]): CoachMessage =>
  ({ id, role: "assistant", parts: [...parts, { type: "text", text: "ok" }] }) as CoachMessage;
const call = (name: string, input: object) => ({ type: `tool-${name}`, toolCallId: name, state: "output-available", input, output: {} });

describe("getTurns / getSession", () => {
  it("derives intent, tool, guardrail and slots per assistant turn", () => {
    const turns = getTurns([
      user("u1"),
      assistant("a1", [call("search_workouts", { maxMinutes: 20, equipment: "none" })]),
      user("u2"),
      assistant("a2", [call("send_review_request", {})]),
      user("u3"),
      assistant("a3", []),
      user("u4"),
      assistant("a4", [call("flag_guardrail", { category: "medical" })]),
      user("u5"),
      assistant("a5", [call("deliver_purchase", { track: "dumbbell" })]),
    ]);
    expect(turns.map((t) => [t.n, t.intent, t.tool, t.guard])).toEqual([
      [1, "workout_advice", "search_workouts", undefined],
      [2, "gratitude", "send_review_request", undefined],
      [3, "informational", undefined, undefined],
      [4, "guardrail_block", undefined, "medical"],
      [5, "post_purchase", "deliver_purchase", undefined],
    ]);
    expect(getSession(turns)).toEqual({ reviewTurn: 2, upsellTurn: undefined, slots: "20 min · none" });
  });
});
