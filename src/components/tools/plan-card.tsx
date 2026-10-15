import type { InferUITool } from "ai";
import type { tools } from "@/lib/agent/tools";
import type { Send } from "@/lib/types";
import { Button, ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ToolLabel } from "./tool-label";

type Plan = InferUITool<typeof tools.deliver_purchase>["output"];

/** What Max hands over right after checkout: the PDF and week 1. */
export function PlanCard({ plan, send, busy }: { plan: Plan; send: Send; busy: boolean }) {
  const { product, track, pdf, week1 } = plan;
  return (
    <article className="p-4.5 bg-card border border-line rounded-2xl shadow-xs flex flex-col gap-3.5">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="w-11 h-13.5 shrink-0 rounded-lg bg-zinc-700 text-lime inline-flex items-center justify-center text-[11px] leading-[13px] font-bold text-center">
            12<br />WK
          </span>
          <span className="flex flex-col">
            <span className="text-xs leading-4 text-muted font-medium">Your plan</span>
            <h3 className="text-[17px] leading-5.5 font-semibold tracking-tight text-ink">
              {product} · {track} track
            </h3>
          </span>
        </div>
        <ToolLabel name="deliver_purchase" />
      </header>

      <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-raised flex-wrap">
        <span className="inline-flex items-center gap-2.5 min-w-0">
          <Icon size={20}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></Icon>
          <span className="flex flex-col">
            <span className="text-sm leading-4.5 font-semibold text-ink">{pdf.name}</span>
            <span className="text-xs leading-4 text-muted">{pdf.pages} pages · also in your email</span>
          </span>
        </span>
        <ButtonLink variant="outline" href={pdf.url} className="min-h-9 px-3.5">
          <Icon size={14}><path d="M12 3v12M7 10l5 5 5-5M4 21h16" /></Icon>
          Download
        </ButtonLink>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center gap-2">
          <span className="text-sm leading-5 font-semibold text-ink">Week 1 · starts Monday</span>
          <span className="text-xs leading-4 text-muted">{week1.length} sessions</span>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {week1.map((s, i) => (
            <li key={s.day} className={`p-2.5 rounded-[10px] flex flex-col gap-0.5 ${i === 0 ? "bg-lime-soft border border-lime-line" : "bg-raised"}`}>
              <span className={`text-[11px] leading-3.5 ${i === 0 ? "text-lime-text font-semibold" : "text-muted"}`}>
                {s.day}
                {i === 0 && " · next"}
              </span>
              <span className="text-[13px] leading-4.5 font-semibold text-ink">{s.name}</span>
              <span className="text-xs leading-4 text-muted">{s.minutes} min</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2 flex-wrap pt-1">
        <Button disabled={busy} onClick={() => send(`Starting Monday's ${week1[0].name} workout now!`)}>
          Start Monday&apos;s workout
        </Button>
      </div>
    </article>
  );
}
