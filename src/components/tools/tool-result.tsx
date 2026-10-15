import type { CoachPart, Send } from "@/lib/types";
import { ReviewCard } from "./review-card";
import { UpsellCard } from "./upsell-card";
import { WorkoutCard } from "./workout-card";

/** Renders the card for a finished tool call. Guardrail flags render separately, after the reply. */
export function ToolResult({ part, replyText, send, busy }: { part: CoachPart; replyText: string; send: Send; busy: boolean }) {
  if (!("state" in part) || part.state !== "output-available") return null;
  switch (part.type) {
    case "tool-search_workouts": {
      // ponytail: shows the first library workout the reply names; switch to a pick_workout tool if the model starts paraphrasing names.
      const workout = part.output.find((w) => replyText.includes(w.name));
      return workout ? <WorkoutCard workout={workout} send={send} busy={busy} /> : null;
    }
    case "tool-send_review_request":
      return <ReviewCard url={part.output.url} />;
    case "tool-generate_upsell_link":
      return <UpsellCard offer={part.output} />;
    default:
      return null;
  }
}
