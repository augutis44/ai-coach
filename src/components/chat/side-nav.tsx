import { clearName } from "@/app/actions";
import { OFFERS } from "@/lib/agent/offers";
import type { Send } from "@/lib/types";
import { CheckoutButton } from "@/components/checkout/checkout-button";
import { Icon } from "@/components/ui/icon";

const NAV = [
  { label: "Coach", icon: <path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.5-4.5A8 8 0 1 1 21 12z" /> },
  { label: "Workouts", icon: <path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12" /> },
  { label: "My plan", icon: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></> },
  { label: "Progress", icon: <path d="M4 19V11M10 19V5M16 19v-8M22 19H2" /> },
];

/** Desktop sidebar. Only "Coach" is live; the rest are placeholders from the design. */
const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export function SideNav({ name, purchased, send, busy }: { name: string; purchased: boolean; send: Send; busy: boolean }) {
  return (
    <nav aria-label="Main" className="hidden lg:flex w-58 shrink-0 py-5 px-3.5 bg-surface border-r border-line flex-col gap-7">
      <a href="#" className="flex items-center gap-2.5 px-2 py-1 no-underline text-ink hover:text-ink">
        <span className="size-7 rounded-lg bg-lime text-zinc-700 inline-flex items-center justify-center">
          <Icon strokeWidth={2.4}><path d="M13 2 4 14h8l-1 8 9-12h-8z" /></Icon>
        </span>
        <span className="font-bold text-[17px] tracking-tight">fitpulse</span>
      </a>

      <ul className="flex flex-col gap-0.5">
        {NAV.map((item, i) => (
          <li key={item.label}>
            <a
              href="#"
              aria-current={i === 0 ? "page" : undefined}
              className={`flex items-center justify-between gap-2.5 min-h-10 px-2.5 rounded-[10px] no-underline ${
                i === 0 ? "bg-raised font-semibold text-ink hover:text-ink" : "font-medium text-muted hover:text-ink"
              }`}
            >
              <span className="inline-flex items-center gap-2.5">
                <Icon size={18}>{item.icon}</Icon>
                {item.label}
              </span>
              {purchased && item.label === "My plan" && (
                <span className="text-[11px] leading-4 font-bold px-1.75 py-px rounded-full bg-lime text-zinc-900">NEW</span>
              )}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex-1" />

      {purchased ? (
        <div className="p-3.5 border border-line rounded-[14px] flex flex-col gap-2.5">
          <div className="flex justify-between items-center gap-2">
            <span className="text-[13px] leading-4.5 font-semibold text-ink">Get Shredded</span>
            <span className="text-xs leading-4 text-muted">Week 1 of 12</span>
          </div>
          <div className="h-1.5 rounded-full bg-line overflow-hidden" role="progressbar" aria-valuenow={0} aria-valuemax={84} aria-label="Workouts done">
            <div className="w-[2%] h-full bg-lime" />
          </div>
          <span className="text-xs leading-4 text-muted">0 of 84 workouts done</span>
        </div>
      ) : (
        <div className="p-3.5 border border-line rounded-[14px] flex flex-col gap-2">
          <span className="text-[13px] leading-4.5 font-semibold text-ink">Free plan</span>
          <span className="text-[13px] leading-4.5 text-muted">Unlock the 12-week program and weekly check-ins.</span>
          <CheckoutButton
            offer={OFFERS.shred_pdf}
            send={send}
            disabled={busy}
            className="min-h-9 px-3 rounded-lg bg-primary text-primary-fg dark:bg-lime dark:text-zinc-900 text-[13px] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upgrade
          </CheckoutButton>
        </div>
      )}

      <div className="flex items-center gap-2.5 px-2 py-1">
        <span aria-hidden="true" className="size-8 shrink-0 rounded-full bg-line text-ink inline-flex items-center justify-center text-xs font-semibold">{initials(name)}</span>
        <span className="flex flex-col min-w-0">
          <span className="text-sm leading-4.5 font-semibold text-ink truncate">{name}</span>
          <form action={clearName}>
            <button type="submit" className="text-xs leading-4 text-muted hover:text-ink cursor-pointer">Switch user</button>
          </form>
        </span>
      </div>
    </nav>
  );
}
