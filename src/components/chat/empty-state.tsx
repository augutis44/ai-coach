import type { Send } from "@/lib/types";
import { CoachAvatar } from "@/components/ui/avatar";

const SUGGESTIONS = [
  { title: "Find a workout", prompt: "I have 20 minutes and no equipment, what should I do right now?" },
  { title: "Training basics", prompt: "How many times a week should a beginner train?" },
  { title: "Recovery", prompt: "My legs are really sore after leg day, what should I do today?" },
  { title: "Plans & programs", prompt: "I want a structured plan to get results faster. What else do you offer?" },
];

export function EmptyState({ send }: { send: Send }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 py-10 text-center animate-rise">
      <CoachAvatar size="lg" />
      <div className="flex flex-col gap-2">
        <h1 className="font-display font-semibold text-2xl leading-8">Hey, I&apos;m Max. Ready to train?</h1>
        <p className="text-muted max-w-md">
          Ask me which workout to do today, how to recover, or anything else about training. Pick a starter or type your own.
        </p>
      </div>
      <ul className="grid gap-2.5 sm:grid-cols-2 w-full max-w-2xl">
        {SUGGESTIONS.map((s) => (
          <li key={s.title}>
            <button
              type="button"
              onClick={() => send(s.prompt)}
              className="w-full h-full text-left p-4 bg-white border border-line rounded-xl cursor-pointer transition hover:border-teal hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
            >
              <span className="block text-xs leading-4 font-semibold uppercase tracking-[0.06em] text-teal">{s.title}</span>
              <span className="block mt-1 text-body">{s.prompt}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
