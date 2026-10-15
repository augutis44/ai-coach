import { getSession, getTurns } from "@/lib/trace";
import type { CoachMessage } from "@/lib/types";
import { TraceRow, TraceSection } from "./trace-row";

/** Debug side panel: what the agent decided on each turn. Desktop only. */
export function AgentTrace({ messages, purchased }: { messages: CoachMessage[]; purchased: boolean }) {
  const turns = getTurns(messages);
  const last = turns.at(-1);
  const session = getSession(turns);

  return (
    <aside aria-label="Agent trace" className="hidden lg:flex w-75 shrink-0 overflow-y-auto p-5 bg-surface border-l border-line flex-col gap-5 text-[13px] leading-4.5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-ink">Trace</h2>
        <span className="text-[11px] leading-4 font-semibold uppercase tracking-[0.06em] px-2 py-0.5 rounded-full bg-soft text-muted">dev only</span>
      </div>

      {last && (
        <TraceSection title={`Last turn · ${last.n}`}>
          <dl className="flex flex-col gap-2">
            {last.tool === "deliver_purchase" && <TraceRow label="event" value="purchase_completed" tone="box" />}
            <TraceRow label="guardrail" value={last.guard ? "block" : "pass"} tone={last.guard ? "alert" : "box"} />
            {last.guard && <TraceRow label="category" value={last.guard} tone="box" />}
            <TraceRow label="intent" value={last.guard ? "skipped" : last.intent} tone="box" />
            <TraceRow label="tool" value={(!last.guard && last.tool) || "—"} tone="box" />
          </dl>
        </TraceSection>
      )}

      <TraceSection title="Session">
        <dl className="flex flex-col gap-2">
          <TraceRow label="Plan" value={purchased ? "Get Shredded · wk 1" : "free"} />
          <TraceRow label="Upsell" value={purchased ? "converted" : session.upsellTurn ? `shown · turn ${session.upsellTurn}` : "not shown"} />
          <TraceRow label="Review asked" value={session.reviewTurn ? `turn ${session.reviewTurn}` : "no"} />
          <TraceRow label="Slots" value={session.slots || "—"} />
        </dl>
      </TraceSection>

      <TraceSection title="Turns">
        {turns.length === 0 ? (
          <p className="text-muted">No turns yet.</p>
        ) : (
          <ol className="flex flex-col gap-2 font-mono text-xs">
            {turns.map((t) => (
              <li key={t.n} className="flex gap-2.5">
                <span className="w-4 shrink-0 text-faint">{t.n}</span>
                <span className={t.guard ? "text-danger" : t.tool === "deliver_purchase" ? "text-ok" : "text-ink"}>
                  {t.guard ? "guardrail → refuse" : `${t.intent} → ${t.tool ?? "reply"}`}
                </span>
              </li>
            ))}
          </ol>
        )}
      </TraceSection>
    </aside>
  );
}
