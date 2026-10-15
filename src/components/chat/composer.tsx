import { useState } from "react";

export function Composer({ onSend, disabled }: { onSend: (text: string) => void; disabled: boolean }) {
  const [input, setInput] = useState("");
  const canSend = !disabled && input.trim().length > 0;

  return (
    <div className="border-t border-line bg-cream/90 backdrop-blur">
      <form
        className="mx-auto max-w-3xl px-4 sm:px-6 pt-3 pb-4 flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSend) return;
          onSend(input.trim());
          setInput("");
        }}
      >
        <div className="flex items-center gap-2 p-1.5 pl-4 bg-white border border-line-strong rounded-2xl shadow-sm transition focus-within:border-teal focus-within:ring-3 focus-within:ring-teal/15">
          <label htmlFor="chat-input" className="sr-only">
            Message your coach
          </label>
          <input
            id="chat-input"
            autoComplete="off"
            className="flex-1 min-w-0 min-h-10 bg-transparent text-ink placeholder:text-muted outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={disabled}
            placeholder="Ask Max anything about training…"
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send message"
            className="size-10 shrink-0 rounded-xl bg-ink text-white flex items-center justify-center cursor-pointer transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs leading-4 text-muted">Max is an AI coach, not a doctor. For medical or diet concerns, talk to a professional.</p>
      </form>
    </div>
  );
}
