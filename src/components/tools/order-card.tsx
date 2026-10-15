import type { InferUITool } from "ai";
import type { tools } from "@/lib/agent/tools";
import type { Send } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ToolLabel } from "./tool-label";

type Order = Extract<InferUITool<typeof tools.deliver_purchase>["output"], { kind: "order" }>;

/** Delivery confirmation for the recipe book and the tracker (the 12-week plan uses PlanCard). */
export function OrderCard({ order, send, busy }: { order: Order; send: Send; busy: boolean }) {
  const { product, status, highlights, next } = order;
  return (
    <article className="p-4.5 bg-card border border-line rounded-2xl shadow-xs flex flex-col gap-3.5">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <span className="flex flex-col">
          <span className="text-xs leading-4 text-muted font-medium">Yours now</span>
          <h3 className="text-[17px] leading-5.5 font-semibold tracking-tight text-ink">{product}</h3>
        </span>
        <ToolLabel name="deliver_purchase" />
      </header>
      <span className="self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ok-soft text-ok text-[13px] leading-4 font-medium">
        <Icon size={13} strokeWidth={2.4}><path d="M5 12l5 5L20 7" /></Icon>
        {status}
      </span>
      <ul className="flex flex-col gap-1.5 text-sm leading-5">
        {highlights.map((h) => (
          <li key={h} className="flex gap-2">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-lime" />
            {h}
          </li>
        ))}
      </ul>
      <Button className="self-start" disabled={busy} onClick={() => send(`${next}!`)}>
        {next}
      </Button>
    </article>
  );
}
