import { useState } from "react";
import type { WORKOUT_QUIZ } from "@/lib/agent/workouts";
import type { Send } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ToolLabel } from "./tool-label";

type Question = (typeof WORKOUT_QUIZ)[number];

/** Three tap-to-answer questions; submitting sends the answers back as one message. */
export function WorkoutQuizCard({ questions, send, busy }: { questions: Question[]; send: Send; busy: boolean }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const done = questions.every((q) => answers[q.id]);

  return (
    <article className="p-4.5 bg-card border border-line rounded-2xl shadow-xs flex flex-col gap-4">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <span className="flex flex-col">
          <span className="text-xs leading-4 text-muted font-medium">Quick quiz · 3 taps</span>
          <h3 className="text-[17px] leading-5.5 font-semibold tracking-tight text-ink">Let&apos;s find your workout</h3>
        </span>
        <ToolLabel name="ask_workout_quiz" />
      </header>

      {questions.map((q) => (
        <fieldset key={q.id} disabled={sent} className="flex flex-col gap-2">
          <legend className="text-sm leading-5 font-medium text-ink mb-2">{q.label}</legend>
          <div className="flex gap-2 flex-wrap">
            {q.options.map((o) => {
              const picked = answers[q.id] === o;
              return (
                <button
                  key={o}
                  type="button"
                  aria-pressed={picked}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: o }))}
                  className={`min-h-8 px-3 rounded-full border text-[13px] font-medium cursor-pointer transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    picked ? "bg-lime border-lime text-zinc-900" : "bg-surface border-line text-ink hover:bg-raised"
                  }`}
                >
                  {o}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <Button
        className="self-start"
        disabled={!done || sent || busy}
        onClick={() => {
          setSent(true);
          send(`Quiz answers: ${questions.map((q) => answers[q.id]).join(" · ")} energy`);
        }}
      >
        {sent ? "Answers sent" : "Find my workout"}
      </Button>
    </article>
  );
}
