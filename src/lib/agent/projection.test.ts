import { describe, it, expect } from "vitest";
import { projectTwelveWeeks } from "./projection";

describe("projectTwelveWeeks", () => {
  it("scales fat loss to bodyweight and judges the target", () => {
    const p = projectTwelveWeeks("lose_fat", 80, 5);
    expect(p.headline).toBe("−4 to −7.5 kg");
    expect(p.summary).toContain("5 kg is a stretch but doable");
  });

  it("says when a target needs longer than 12 weeks", () => {
    expect(projectTwelveWeeks("lose_fat", 80, 15).summary).toContain("roughly 32 weeks");
  });

  it("ignores implausible inputs from the model", () => {
    expect(projectTwelveWeeks("lose_fat", 9999, -3)).toEqual(projectTwelveWeeks("lose_fat"));
    expect(projectTwelveWeeks("lose_fat").headline).toBe("−3 to −6 kg");
  });

  it("uses percentage ranges for strength and endurance", () => {
    expect(projectTwelveWeeks("get_stronger").headline).toBe("+20–40%");
    expect(projectTwelveWeeks("build_muscle", 70, 2).summary).toContain("1–2.5 kg of lean muscle");
  });
});
