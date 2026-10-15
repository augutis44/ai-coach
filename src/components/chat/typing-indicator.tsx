import { CoachRow, CoachBubble } from "./message";

export function TypingIndicator() {
  return (
    <CoachRow>
      <CoachBubble>
        <span role="status" aria-label="Max is typing" className="flex gap-1 py-1.5">
          {[0, 150, 300].map((delay) => (
            <span key={delay} className="size-2 rounded-full bg-muted animate-dot" style={{ animationDelay: `${delay}ms` }} />
          ))}
        </span>
      </CoachBubble>
    </CoachRow>
  );
}
