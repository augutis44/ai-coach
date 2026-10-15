import type { Workout } from "@/lib/agent/workouts";
import type { Send } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ToolLabel } from "./tool-label";

type Asked = { focus?: string; intensity?: string };

/** `asked` is the search input: intensity and focus only show as tags when the user asked for them. */
export function WorkoutCard({ workout, asked, send, busy }: { workout: Workout; asked: Asked; send: Send; busy: boolean }) {
  const { name, minutes, equipment, intensity, focus, description } = workout;
  const meta = [`${minutes} min`, equipment === "none" ? "No equipment" : equipment];
  if (asked.intensity) meta.push(`${intensity} intensity`);
  if (asked.focus) meta.push(focus);
  return (
    <article className="p-4.5 bg-card border border-line rounded-2xl shadow-xs flex flex-col gap-3.5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="size-10 shrink-0 rounded-xl bg-lime text-zinc-900 inline-flex items-center justify-center">
            <Icon size={20}><path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12" /></Icon>
          </span>
          <span className="flex flex-col">
            <span className="text-xs leading-4 text-muted font-medium">Recommended for you</span>
            <h3 className="text-[17px] leading-5.5 font-semibold tracking-tight text-ink">{name}</h3>
          </span>
        </div>
        <ToolLabel name="search_workouts" />
      </header>
      <ul className="flex items-center gap-2 flex-wrap text-[13px] leading-4.5 text-muted">
        {meta.map((m, i) => (
          <li key={m} className="flex items-center gap-2 capitalize">
            {i > 0 && <span aria-hidden="true" className="size-0.75 rounded-full bg-faint" />}
            {m}
          </li>
        ))}
      </ul>
      <p className="text-sm leading-5">{description}</p>
      <div className="flex gap-2 flex-wrap pt-1">
        <Button disabled={busy} onClick={() => send(`Starting ${name} now!`)}>
          Start workout
        </Button>
        <Button variant="outline" disabled={busy} onClick={() => send("Show me another workout")}>
          Swap
        </Button>
      </div>
    </article>
  );
}
