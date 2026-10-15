import { clearName } from "@/app/actions";
import { OFFERS } from "@/lib/agent/offers";
import type { Send } from "@/lib/types";
import { CheckoutButton } from "@/components/checkout/checkout-button";
import { CoachAvatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { initials } from "./side-nav";
import { ThemeToggle } from "./theme-toggle";

type Props = { name: string; purchased: boolean; send: Send; busy: boolean; trace: boolean; onToggleTrace: () => void };

const MENU_ITEM = "w-full min-h-10 px-2.5 rounded-lg text-left text-sm font-medium text-ink hover:bg-raised cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

export function ChatHeader({ name, purchased, send, busy, trace, onToggleTrace }: Props) {
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
        {/* Phones: the sidebar is hidden, so its account actions live in a native popover (light-dismiss, no state). */}
        <button
          type="button"
          popoverTarget="user-menu"
          aria-label="Account menu"
          className="lg:hidden size-8 rounded-full bg-line text-ink inline-flex items-center justify-center text-xs font-semibold cursor-pointer"
        >
          {initials(name)}
        </button>
        <div
          id="user-menu"
          popover="auto"
          className="hidden open:flex m-0 inset-auto top-16 right-4 w-56 p-2 flex-col gap-0.5 bg-surface text-body border border-line rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.18)]"
        >
          <span className="px-2.5 py-1.5 text-sm font-semibold text-ink truncate">{name}</span>
          {purchased ? (
            <span className="px-2.5 py-1.5 text-[13px] leading-4.5 text-muted">Get Shredded · Week 1 of 12</span>
          ) : (
            <CheckoutButton offer={OFFERS.shred_pdf} send={send} disabled={busy} className={MENU_ITEM}>
              Upgrade to the 12-week plan
            </CheckoutButton>
          )}
          <form action={clearName}>
            <button type="submit" className={MENU_ITEM}>
              Switch user
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
