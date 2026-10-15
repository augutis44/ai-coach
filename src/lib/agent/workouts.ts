export const WORKOUTS = [
  {
    name: "Dumbbell Full-Body Blast",
    focus: "strength",
    minutes: 25,
    equipment: "dumbbells",
    intensity: "moderate",
    description:
      "4 rounds of squat, row, push press and RDL. Efficient strength when time is short.",
  },
  {
    name: "Bodyweight HIIT 20",
    focus: "fat loss",
    minutes: 20,
    equipment: "none",
    intensity: "high",
    description:
      "40 s on / 20 s off: burpees, mountain climbers, jump squats, plank jacks. Sweaty, no gear.",
  },
  {
    name: "Morning Mobility Flow",
    focus: "mobility",
    minutes: 15,
    equipment: "mat",
    intensity: "low",
    description:
      "Hip openers, thoracic rotations, cat-cow, deep squat holds. Stiff morning or desk day.",
  },
  {
    name: "Core Crusher",
    focus: "core",
    minutes: 15,
    equipment: "none",
    intensity: "moderate",
    description:
      "Dead bugs, side planks, hollow holds, bird dogs. Add-on after any session or a quick standalone.",
  },
  {
    name: "Lower Body Strength",
    focus: "strength",
    minutes: 40,
    equipment: "gym",
    intensity: "high",
    description:
      "Back squat 5×5, hip thrust 3×10, walking lunges, calf raises. Leg day with barbell access.",
  },
  {
    name: "Upper Body Push / Pull",
    focus: "strength",
    minutes: 35,
    equipment: "dumbbells + band",
    intensity: "moderate",
    description:
      "Floor press, bent-over row, band pull-aparts, curls and overhead extensions. Balanced upper day.",
  },
  {
    name: "Steady-State Walk",
    focus: "recovery",
    minutes: 30,
    equipment: "none",
    intensity: "low",
    description:
      "Brisk walk at a pace you can still talk at. Rest days, beginners, sore legs, low energy.",
  },
  {
    name: "Stair & Sprint Intervals",
    focus: "fat loss",
    minutes: 20,
    equipment: "outdoor",
    intensity: "high",
    description:
      "8 × 30 s sprint or stair climb, walk back down. Short, intense, outdoors.",
  },
  {
    name: "Yoga Wind-Down",
    focus: "recovery",
    minutes: 20,
    equipment: "mat",
    intensity: "low",
    description:
      "Slow flow, long holds, breathing. Evenings, stressful days, before sleep.",
  },
  {
    name: "Kettlebell Conditioning",
    focus: "conditioning",
    minutes: 30,
    equipment: "kettlebell",
    intensity: "high",
    description:
      "EMOM 20: swings, goblet squats, clean and press. Strength and cardio in one.",
  },
];

export type Workout = (typeof WORKOUTS)[number];

/** Asked when the user wants a workout but hasn't said their time or equipment. */
export const WORKOUT_QUIZ = [
  { id: "time", label: "How much time do you have?", options: ["10 min", "15 min", "20 min", "30 min", "45+ min"] },
  { id: "equipment", label: "What do you have to train with?", options: ["No equipment", "Dumbbells", "Kettlebell", "Mat", "Gym", "Outdoors"] },
  { id: "energy", label: "How's your energy today?", options: ["Low", "Moderate", "High"] },
];
