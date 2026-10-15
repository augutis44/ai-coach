import type { Workout } from "@/lib/agent/workouts";
import type { Send } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { ToolLabel } from "./tool-label";

export function WorkoutCard({ workout, send, busy }: { workout: Workout; send: Send; busy: boolean }) {
  const { name, minutes, equipment, intensity, focus, description } = workout;
  return (
    <article className="p-4 bg-white border-2 border-teal rounded-xl flex flex-col gap-2.5 shadow-sm">
      <header className="flex justify-between items-center gap-3 flex-wrap">
        <h3 className="font-display font-semibold text-[17px] leading-5.5">{name}</h3>
        <ToolLabel name="search_workouts" className="text-teal" />
      </header>
      <div className="flex gap-2 flex-wrap">
        <Chip>{minutes} min</Chip>
        <Chip>{equipment === "none" ? "No equipment" : equipment}</Chip>
        <Chip>{intensity}</Chip>
        <Chip>{focus}</Chip>
      </div>
      <p className="text-body">{description}</p>
      <div className="flex gap-2.5 flex-wrap">
        <Button disabled={busy} onClick={() => send(`Starting ${name} now!`)}>
          Start workout
        </Button>
        <Button variant="outline" disabled={busy} onClick={() => send("Show me another workout")}>
          Show another
        </Button>
      </div>
    </article>
  );
}
