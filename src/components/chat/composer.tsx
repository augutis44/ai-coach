import { useState } from "react";
import { Icon } from "@/components/ui/icon";

const CHIPS = {
  free: ["Pick a workout for me", "What else do you offer?", "Post-workout meal"],
  owned: ["Mon / Wed / Fri works", "Tue / Thu / Sat instead", "Yes, remind me"],
};

export function Composer({ onSend, disabled, purchased }: { onSend: (text: string) => void; disabled: boolean; purchased: boolean }) {
  const [input, setInput] = useState("");
  const canSend = !disabled && input.trim().length > 0;

  return (
    <form
      className="mx-auto w-full max-w-190 px-4 sm:px-7 pt-3 pb-6 flex flex-col gap-2.5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSend) return;
        onSend(input.trim());
        setInput("");
      }}
    >
      <div className="flex gap-2 flex-wrap">
        {CHIPS[purchased ? "owned" : "free"].map((chip) => (
          <button
            key={chip}
            type="button"
            disabled={disabled}
            onClick={() => onSend(chip)}
            className="min-h-8 px-3 rounded-full bg-surface border border-line text-[13px] font-medium text-ink cursor-pointer transition hover:bg-raised disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chip}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5 p-1.5 pl-3 bg-surface dark:bg-card border border-line rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition focus-within:border-faint">
        <label htmlFor="chat-input" className="sr-only">
          Message Max
        </label>
        <input
          id="chat-input"
          autoComplete="off"
          className="flex-1 min-w-0 min-h-9 bg-transparent text-base sm:text-[15px] text-ink placeholder:text-muted outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder="Message Max…"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className="size-9 shrink-0 rounded-full bg-primary text-primary-fg dark:bg-lime dark:text-zinc-900 flex items-center justify-center cursor-pointer transition disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-text"
        >
          <Icon strokeWidth={2.4}><path d="M12 19V5M5 12l7-7 7 7" /></Icon>
        </button>
      </div>
    </form>
  );
}
