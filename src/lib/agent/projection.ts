export type Goal = "lose_fat" | "build_muscle" | "get_stronger" | "endurance";

export type Projection = {
  /** Short range for the offer card, e.g. "−4 to −7.5 kg". */
  headline: string;
  /** One honest sentence the coach quotes verbatim. */
  summary: string;
};

const WEEKS = 12;
const half = (n: number) => Math.round(n * 2) / 2;

// ponytail: rule-of-thumb rates for a consistent beginner, not a personal prediction. Fat loss 0.4–0.8% bodyweight/week
// (0.25–0.5 kg/week if weight unknown); lean muscle 1–2.5 kg per 12 weeks. Swap for a proper model if we ever collect more data.
const KG_RATES = {
  lose_fat: (weightKg?: number) => (weightKg ? [weightKg * 0.004, weightKg * 0.008] : [0.25, 0.5]),
  build_muscle: () => [1 / WEEKS, 2.5 / WEEKS],
};

const PERCENT = {
  get_stronger: { range: [20, 40], what: "stronger on your main lifts" },
  endurance: { range: [15, 30], what: "more distance or pace at the same effort" },
};

/** Realistic 12-week outcome for a goal; inputs come from the model, so anything implausible is ignored. */
export function projectTwelveWeeks(goal: Goal, weightKg?: number, targetKg?: number): Projection {
  if (goal === "get_stronger" || goal === "endurance") {
    const { range, what } = PERCENT[goal];
    return {
      headline: `+${range[0]}–${range[1]}%`,
      summary: `With 12 weeks of consistent training, most people end up about ${range[0]}–${range[1]}% ${what}.`,
    };
  }

  const weight = weightKg && weightKg >= 35 && weightKg <= 250 ? weightKg : undefined;
  const target = targetKg && targetKg > 0 && targetKg <= 60 ? targetKg : undefined;
  const [perWeekLo, perWeekHi] = KG_RATES[goal](weight);
  const lo = half(perWeekLo * WEEKS);
  const hi = half(perWeekHi * WEEKS);
  const sign = goal === "lose_fat" ? "−" : "+";
  const verb = goal === "lose_fat" ? "lose" : "gain";
  const noun = goal === "lose_fat" ? "fat" : "lean muscle";
  const base = `Following the plan consistently, a realistic 12-week result is ${lo}–${hi} kg of ${noun}`;

  let verdict = ".";
  if (target && target <= lo) verdict = `, so your ${target} kg goal is very achievable within the plan.`;
  else if (target && target <= hi) verdict = `, so ${target} kg is a stretch but doable if you stay consistent.`;
  else if (target) {
    const weeks = Math.ceil(target / ((perWeekLo + perWeekHi) / 2));
    verdict = `. To ${verb} the full ${target} kg, plan on roughly ${weeks} weeks: the 12-week plan gets you a big first chunk of it.`;
  }

  return { headline: `${sign}${lo} to ${sign}${hi} kg`, summary: base + verdict };
}
