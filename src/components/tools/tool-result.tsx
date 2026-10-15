import type { CoachPart, Send } from "@/lib/types";
import { OrderCard } from "./order-card";
import { PlanCard } from "./plan-card";
import { ReviewCard } from "./review-card";
import { UpsellCard } from "./upsell-card";
import { WorkoutCard } from "./workout-card";
import { WorkoutQuizCard } from "./workout-quiz-card";

/** Renders the card for a finished tool call. Guardrail flags render separately, after the reply. */
export function ToolResult({ part, replyText, send, busy }: { part: CoachPart; replyText: string; send: Send; busy: boolean }) {
  if (!("state" in part) || part.state !== "output-available") return null;
  switch (part.type) {
    case "tool-search_workouts": {
      // ponytail: shows the first library workout the reply names; switch to a pick_workout tool if the model starts paraphrasing names.
      const workout = part.output.find((w) => replyText.includes(w.name));
      return workout ? <WorkoutCard workout={workout} asked={part.input} send={send} busy={busy} /> : null;
    }
    case "tool-ask_workout_quiz":
      return <WorkoutQuizCard questions={part.output.questions} send={send} busy={busy} />;
    case "tool-send_review_request":
      return <ReviewCard url={part.output.url} />;
    case "tool-generate_upsell_link": {
      // A "mention" lives only in the reply text (its link opens checkout); the full card is reserved for clear buy intent.
      const offer = part.output;
      return offer.available && offer.display === "card" ? <UpsellCard offer={offer} send={send} busy={busy} /> : null;
    }
    case "tool-deliver_purchase":
      return part.output.kind === "plan" ? (
        <PlanCard plan={part.output} send={send} busy={busy} />
      ) : (
        <OrderCard order={part.output} send={send} busy={busy} />
      );
    default:
      return null;
  }
}
