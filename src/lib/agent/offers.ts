/** Paid products the coach can offer. Shared by the upsell tool and the nav's Upgrade button. */
export const OFFERS = {
  shred_pdf: {
    product: "12-Week Get Shredded",
    blurb: "Progressive PDF program with weekly check-ins from Max, printable and synced to your plan tab.",
    features: ["84 workouts", "Weekly check-ins", "Dumbbell & gym versions"],
    price: "$9.99",
    url: "https://checkout.fitpulse.example/get-shredded-12w?ref=coach",
  },
  recipe_book: {
    product: "TestDiet Recipe Book",
    blurb: "Personalized recipes, printed just for you.",
    features: ["Personalized recipes", "Printed just for you"],
    price: "",
    url: "https://checkout.fitpulse.example/testdiet-recipe-book?ref=coach",
  },
};

export type Offer = (typeof OFFERS)[keyof typeof OFFERS];
