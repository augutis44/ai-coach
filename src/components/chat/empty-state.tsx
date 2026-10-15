import { CoachAvatar } from "@/components/ui/avatar";

export function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 py-10 text-center animate-rise">
      <CoachAvatar size="lg" />
      <div className="flex flex-col gap-1.5">
        <h1 className="font-semibold text-2xl leading-8 tracking-tight text-ink">Hey, I&apos;m Max. Ready to train?</h1>
        <p className="text-muted max-w-md">Tell me how much time and what gear you have, ask about recovery, or pick a starter below.</p>
      </div>
    </div>
  );
}
