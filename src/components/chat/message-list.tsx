import { useEffect, useRef } from "react";
import type { CoachMessage, Send } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./empty-state";
import { Message } from "./message";
import { TypingIndicator } from "./typing-indicator";

type Props = {
  messages: CoachMessage[];
  send: Send;
  busy: boolean;
  thinking: boolean;
  error?: Error;
  onRetry: () => void;
};

/** Scrollable conversation area; keeps the newest message in view. */
export function MessageList({
  messages,
  send,
  busy,
  thinking,
  error,
  onRetry,
}: Props) {
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking, error]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto" aria-live="polite">
      <div className="mx-auto max-w-3xl min-h-full px-4 sm:px-6 py-6 flex flex-col gap-5">
        {messages.length === 0 ? (
          <EmptyState send={send} />
        ) : (
          <>
            <div className="self-center text-xs leading-4 text-muted uppercase tracking-[0.08em]">
              Today
            </div>
            {messages.map((m) => (
              <Message key={m.id} message={m} send={send} busy={busy} />
            ))}
          </>
        )}
        {thinking && <TypingIndicator />}
        {error && (
          <div
            role="alert"
            className="ml-10.5 flex items-center justify-between gap-3 px-4 py-3 bg-danger-soft border border-danger-line rounded-xl text-danger"
          >
            <span>Something went wrong. Max didn&apos;t get that.</span>
            <Button
              variant="outline"
              onClick={onRetry}
              className="min-h-9 px-3 text-sm"
            >
              Try again
            </Button>
          </div>
        )}
        <div ref={end} />
      </div>
    </div>
  );
}
