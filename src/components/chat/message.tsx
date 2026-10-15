import type { CoachMessage, Send } from "@/lib/types";
import { Icon } from "@/components/ui/icon";
import { GuardrailNotice } from "@/components/tools/guardrail-notice";
import { ToolResult } from "@/components/tools/tool-result";
import { RichText } from "./rich-text";

const time = (at: number) => new Date(at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex justify-end animate-rise">
      <div className="max-w-120 px-3.5 py-2.5 bg-bubble text-bubble-fg rounded-[18px_18px_4px_18px] whitespace-pre-wrap">{text}</div>
    </div>
  );
}

/** Automated checkout receipt, shown as a status pill instead of a bubble. */
function PurchasePill({ text, at }: { text: string; at?: number }) {
  return (
    <div className="self-center inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ok-soft text-ok text-[13px] leading-4 animate-rise">
      <Icon size={14} strokeWidth={2.4}><path d="M5 12l5 5L20 7" /></Icon>
      <span>{text}{at && ` · ${time(at)}`}</span>
    </div>
  );
}

function CoachMessageView({ message, send, busy }: { message: CoachMessage; send: Send; busy: boolean }) {
  const replyText = message.parts.map((p) => (p.type === "text" ? p.text : "")).join("\n");
  const guard = message.parts.find((p) => p.type === "tool-flag_guardrail" && p.state === "output-available");
  const at = message.metadata?.at;

  return (
    <div className="flex flex-col gap-3 max-w-155 animate-rise">
      <div className="text-xs leading-4 text-muted font-medium">Max{at && ` · ${time(at)}`}</div>
      {message.parts.map((p, i) => {
        if (p.type !== "text") return <ToolResult key={i} part={p} replyText={replyText} send={send} busy={busy} />;
        if (!p.text.trim()) return null;
        return (
          // div, not p: inline checkout links carry a <dialog>/<form>, which can't live inside a <p>.
          <div key={i} className="whitespace-pre-wrap">
            <RichText text={p.text} send={send} busy={busy} />
          </div>
        );
      })}
      {guard?.type === "tool-flag_guardrail" && guard.state === "output-available" && <GuardrailNotice category={guard.output.category} />}
    </div>
  );
}

export function Message({ message, send, busy }: { message: CoachMessage; send: Send; busy: boolean }) {
  if (message.role === "user") {
    const text = message.parts.map((p) => (p.type === "text" ? p.text : "")).join("\n");
    return message.metadata?.event ? <PurchasePill text={text} at={message.metadata.at} /> : <UserMessage text={text} />;
  }
  return <CoachMessageView message={message} send={send} busy={busy} />;
}
