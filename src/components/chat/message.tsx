import type { CoachMessage, Send } from "@/lib/types";
import { CoachAvatar } from "@/components/ui/avatar";
import { GuardrailNotice } from "@/components/tools/guardrail-notice";
import { ToolResult } from "@/components/tools/tool-result";
import { RichText } from "./rich-text";

/** Coach-side row: avatar on the left, a column of bubbles and cards on the right. */
export function CoachRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 items-start animate-rise">
      <CoachAvatar />
      <div className="flex flex-col gap-2.5 max-w-140 min-w-0">{children}</div>
    </div>
  );
}

export function CoachBubble({ children, first = true }: { children: React.ReactNode; first?: boolean }) {
  return (
    <div
      className={`px-4 py-3 bg-white border border-line whitespace-pre-wrap shadow-xs ${first ? "rounded-[4px_16px_16px_16px]" : "rounded-2xl"}`}
    >
      {children}
    </div>
  );
}

function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex justify-end animate-rise">
      <div className="max-w-130 px-4 py-3 bg-ink text-white rounded-[16px_16px_4px_16px] whitespace-pre-wrap shadow-xs">{text}</div>
    </div>
  );
}

function CoachMessageView({ message, send, busy }: { message: CoachMessage; send: Send; busy: boolean }) {
  const replyText = message.parts.map((p) => (p.type === "text" ? p.text : "")).join("\n");
  const firstText = message.parts.findIndex((p) => p.type === "text" && p.text.trim());
  const guard = message.parts.find((p) => p.type === "tool-flag_guardrail" && p.state === "output-available");

  return (
    <CoachRow>
      {message.parts.map((p, i) => {
        if (p.type !== "text") return <ToolResult key={i} part={p} replyText={replyText} send={send} busy={busy} />;
        if (!p.text.trim()) return null;
        return (
          <CoachBubble key={i} first={i === firstText}>
            <RichText text={p.text} />
          </CoachBubble>
        );
      })}
      {guard?.type === "tool-flag_guardrail" && guard.state === "output-available" && (
        <GuardrailNotice category={guard.output.category} />
      )}
    </CoachRow>
  );
}

export function Message({ message, send, busy }: { message: CoachMessage; send: Send; busy: boolean }) {
  if (message.role === "user") {
    const text = message.parts.map((p) => (p.type === "text" ? p.text : "")).join("\n");
    return <UserMessage text={text} />;
  }
  return <CoachMessageView message={message} send={send} busy={busy} />;
}
