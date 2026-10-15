/**
 * Paid products the coach can offer, each matched to the user's main problem.
 * Shared by the upsell tool, checkout, delivery and the nav's Upgrade button.
 */
export const OFFERS = {
  recipe_book: {
    id: "recipe_book" as const,
    product: "TestDiet Recipe Book",
    problem: "eating: snacking, cravings, not knowing what to cook, diet keeps falling apart",
    blurb: "A personalized recipe book built around your goal and taste, printed just for you and shipped to your door.",
    features: ["60 recipes for your goal", "Printed & shipped", "Shopping lists"],
    badge: ["TD", "BOOK"],
    checkoutNote: "Printed book · ships in 3–5 days",
    price: "$14.99",
    url: "https://checkout.fitpulse.example/testdiet-recipe-book?ref=coach",
  },
  shred_pdf: {
    id: "shred_pdf" as const,
    product: "12-Week Get Shredded",
    problem: "workouts: wants a structured plan, faster results, plateau, deadline goal",
    blurb: "Progressive PDF program with weekly check-ins from Max, printable and synced to your plan tab.",
    features: ["84 workouts", "Weekly check-ins", "Dumbbell & gym versions"],
    badge: ["12", "WK"],
    checkoutNote: "PDF · dumbbell track · Sunday check-ins",
    price: "$9.99",
    url: "https://checkout.fitpulse.example/get-shredded-12w?ref=coach",
  },
  progress_tracker: {
    id: "progress_tracker" as const,
    product: "Progress Tracker",
    problem: "tracking & consistency: forgets to log, can't tell if progressing, loses motivation, skips sessions",
    blurb: "Log workouts, weight and measurements in seconds, keep a streak, and get a weekly progress report from Max.",
    features: ["Weekly progress report", "Streaks & reminders", "Weight & measurements"],
    badge: ["PRO", "TRK"],
    checkoutNote: "Unlocks in the app · lifetime access",
    price: "$4.99",
    url: "https://checkout.fitpulse.example/progress-tracker?ref=coach",
  },
};

export type OfferId = keyof typeof OFFERS;
export type Offer = (typeof OFFERS)[OfferId];
export const OFFER_IDS = Object.keys(OFFERS) as OfferId[];

/** Product list for the system prompt, so prices and problems live in one place. */
export const offerCatalog = () =>
  Object.values(OFFERS)
    .map((o) => `- ${o.id}: ${o.product} (${o.price}) → for ${o.problem}`)
    .join("\n");

/** Finds the offer a checkout URL belongs to, so in-text links can open the in-app checkout. */
export const offerByUrl = (href: string) => Object.values(OFFERS).find((o) => o.url === href);
