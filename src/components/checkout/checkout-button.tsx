import { useRef, useState, type FormEvent, type ReactNode } from "react";
import type { Offer } from "@/lib/agent/offers";
import type { Send } from "@/lib/types";
import { Icon } from "@/components/ui/icon";

const FIELD =
  "min-h-11 px-3 bg-surface text-ink placeholder:text-faint text-[15px] outline-none border border-line rounded-[10px] focus:border-faint";

/** Trigger button plus the checkout modal. Paying is simulated and ends with a receipt message to Max. */
export function CheckoutButton({
  offer,
  send,
  disabled,
  className,
  children,
}: {
  offer: Pick<Offer, "id" | "product" | "price" | "badge" | "checkoutNote">;
  send: Send;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [paying, setPaying] = useState(false);

  const pay = (e: FormEvent) => {
    e.preventDefault();
    setPaying(true);
    // ponytail: fake checkout; swap the timeout for a real payment session when payments land.
    setTimeout(() => {
      setPaying(false);
      dialog.current?.close();
      send(`Payment confirmed · ${offer.product} · ${offer.price}`, { event: "purchase_completed", product: offer.id, at: Date.now() });
    }, 900);
  };

  return (
    <>
      <button type="button" disabled={disabled} onClick={() => dialog.current?.showModal()} className={className}>
        {children}
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="checkout-title"
        className="m-auto w-120 max-w-[calc(100%-32px)] p-6 bg-surface text-body rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,0.25)] backdrop:bg-zinc-900/55 open:flex flex-col gap-4.5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h2 id="checkout-title" className="text-lg leading-6 font-bold tracking-tight text-ink">Complete your order</h2>
            <span className="inline-flex items-center gap-1.5 text-[13px] leading-4.5 text-muted">
              <Icon size={13}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></Icon>
              Secure · one-time payment
            </span>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => dialog.current?.close()}
            className="size-9 rounded-[10px] bg-raised text-body inline-flex items-center justify-center cursor-pointer"
          >
            <Icon><path d="M6 6l12 12M18 6L6 18" /></Icon>
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 border border-line rounded-[14px]">
          <span aria-hidden="true" className="w-11 h-13.5 shrink-0 rounded-lg bg-zinc-700 text-lime inline-flex items-center justify-center text-[11px] leading-[13px] font-bold text-center">
            {offer.badge[0]}
            <br />
            {offer.badge[1]}
          </span>
          <span className="flex-1 min-w-0 flex flex-col gap-0.5">
            <span className="text-[15px] leading-5 font-semibold text-ink">{offer.product}</span>
            <span className="text-[13px] leading-4.5 text-muted">{offer.checkoutNote}</span>
          </span>
          <span className="flex flex-col items-end">
            <span className="text-base leading-5 font-bold text-ink">{offer.price}</span>
            <span className="text-xs leading-4 text-muted">one-time</span>
          </span>
        </div>

        <form onSubmit={pay} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5 text-[13px] leading-4.5 font-medium text-ink">
            Email
            <input type="email" autoComplete="email" placeholder="you@example.com" className={FIELD} />
          </label>
          <div className="flex flex-col gap-1.5 text-[13px] leading-4.5 font-medium text-ink">
            <label htmlFor="checkout-card">Card</label>
            <div className="flex border border-line rounded-[10px] overflow-hidden focus-within:border-faint">
              <input id="checkout-card" inputMode="numeric" placeholder="•••• •••• •••• ••••" className={`${FIELD} flex-1 min-w-0 border-0 rounded-none`} />
              <input aria-label="Expiry" inputMode="numeric" placeholder="MM / YY" className={`${FIELD} w-23 px-2.5 border-0 border-l rounded-none`} />
              <input aria-label="CVC" inputMode="numeric" placeholder="CVC" className={`${FIELD} w-16 px-2.5 border-0 border-l rounded-none`} />
            </div>
          </div>
          <button
            type="submit"
            disabled={paying}
            className="min-h-12 mt-1 px-4.5 rounded-xl bg-lime text-zinc-900 text-[15px] font-bold cursor-pointer transition hover:brightness-95 disabled:cursor-wait disabled:opacity-70"
          >
            {paying ? "Processing…" : `Pay ${offer.price}`}
          </button>
          <p className="text-center text-xs leading-4 text-muted">14-day money-back · you&apos;ll return to the chat with Max right after</p>
        </form>
      </dialog>
    </>
  );
}
