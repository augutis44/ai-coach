import { CoachAvatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { ThemeToggle } from "./theme-toggle";

export function ChatHeader({ trace, onToggleTrace }: { trace: boolean; onToggleTrace: () => void }) {
  return (
    <header className="min-h-15 shrink-0 px-4 sm:px-7 py-2.5 flex items-center justify-between gap-4 bg-surface border-b border-line">
      <div className="flex items-center gap-3">
        <CoachAvatar online />
        <div className="flex flex-col">
          <span className="text-[15px] leading-5 font-semibold text-ink">Max</span>
          <span className="text-[13px] leading-4 text-muted">Your coach · online</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline-flex items-center gap-1.5 min-h-8 px-3 rounded-full bg-raised text-[13px] font-semibold text-ink">
          <Icon size={14}><path d="M12 22c4-2 7-5 7-9 0-3-2-5-3-7-1 2-2 3-3 3 0-3-1-5-3-7-1 4-6 6-6 11 0 4 3 7 8 9z" /></Icon>
          12-day streak
        </span>
        <ThemeToggle />
        <button
          type="button"
          aria-pressed={trace}
          onClick={onToggleTrace}
          className="hidden lg:inline-flex items-center min-h-8 px-3 rounded-full bg-surface border border-line text-[13px] font-medium text-muted hover:text-ink cursor-pointer"
        >
          Trace
        </button>
      </div>
    </header>
  );
}
