import { getSession, getTurns } from "@/lib/trace";
import type { CoachMessage } from "@/lib/types";
import { TraceRow, TraceSection } from "./trace-row";

/** Debug side panel: what the agent decided on each turn. Desktop only. */
export function AgentTrace({ messages }: { messages: CoachMessage[] }) {
  const turns = getTurns(messages);
  const last = turns.at(-1);
  const session = getSession(turns);

  return (
    <aside className="hidden lg:flex w-90 shrink-0 overflow-y-auto p-6 border-l border-line bg-white flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display font-semibold text-base leading-5">Agent trace</h2>
        <p className="text-[13px] leading-4 text-muted">Debug panel for the prototype. Hidden in production.</p>
      </div>

      {last && (
        <TraceSection title={`Turn ${last.n} · last message`}>
          <dl className="flex flex-col gap-2">
            <TraceRow
              label="Guardrail"
              value={last.guard ? `BLOCK · ${last.guard}` : "pass"}
              tone={last.guard ? "alert" : "box"}
            />
            <TraceRow label="Intent" value={last.guard ? "skipped" : last.intent} tone="box" />
            <TraceRow label="Tool" value={(!last.guard && last.tool) || "none"} tone="box" />
          </dl>
        </TraceSection>
      )}

      <TraceSection title="Session state">
        <dl className="flex flex-col gap-2.5">
          <TraceRow label="Review asked" value={session.reviewTurn ? `yes · turn ${session.reviewTurn}` : "no"} />
          <TraceRow label="Upsell shown" value={session.upsellTurn ? `yes · turn ${session.upsellTurn}` : "no"} />
          <TraceRow label="Slots" value={session.slots || "—"} />
        </dl>
      </TraceSection>

      <TraceSection title="Turn log">
        {turns.length === 0 ? (
          <p className="text-[13px] text-muted">No turns yet.</p>
        ) : (
          <ol className="flex flex-col gap-2.5">
            {turns.map((t) => (
              <li key={t.n} className="flex gap-2.5 text-[13px] leading-4.5">
                <span className="w-4 shrink-0 text-muted">{t.n}</span>
                <span className={t.guard ? "text-danger" : ""}>
                  {t.guard ? "guardrail_block → refuse + redirect" : `${t.intent} → ${t.tool ?? "reply"}`}
                </span>
              </li>
            ))}
          </ol>
        )}
      </TraceSection>
    </aside>
  );
}
