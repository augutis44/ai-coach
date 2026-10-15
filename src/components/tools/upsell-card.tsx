import type { Offer } from "@/lib/agent/offers";
import type { Send } from "@/lib/types";
import { CheckoutButton } from "@/components/checkout/checkout-button";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ToolLabel } from "./tool-label";

const CTA =
  "inline-flex items-center gap-2 min-h-10 px-4.5 rounded-[10px] bg-lime text-zinc-700 dark:bg-zinc-900 dark:text-lime text-sm font-bold no-underline cursor-pointer transition hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed";

/** Hero offer card: inverted against the page so it stands out in both themes. */
export function UpsellCard({ offer, send, busy }: { offer: Offer; send: Send; busy: boolean }) {
  const { product, blurb, features, price, url } = offer;
  const arrow = <Icon size={14} strokeWidth={2.2}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>;
  return (
    <article className="p-5 rounded-2xl bg-zinc-700 text-white dark:bg-white dark:text-zinc-900 flex flex-col gap-3.5">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-[11px] leading-4 font-bold uppercase tracking-[0.08em] text-lime dark:text-lime-700">Recommended</span>
        <ToolLabel name="generate_upsell_link" className="text-neutral-400 dark:text-neutral-500" />
      </header>
      <div className="flex flex-col gap-1">
        <h3 className="text-xl leading-6.5 font-bold tracking-tight">{product}</h3>
        <p className="text-sm leading-5 text-neutral-400 dark:text-neutral-600">{blurb}</p>
      </div>
      <ul className="flex gap-2 flex-wrap">
        {features.map((f) => (
          <li key={f} className="text-xs leading-4 px-2.5 py-1.25 rounded-full border border-neutral-700 text-neutral-200 dark:border-stone-200 dark:text-neutral-600">
            {f}
          </li>
        ))}
      </ul>
      <footer className="flex items-center justify-between gap-3 flex-wrap pt-1">
        {price ? (
          <>
            <span className="flex items-baseline gap-1.5">
              <span className="text-2xl leading-7 font-bold tracking-tight">{price}</span>
              <span className="text-[13px] text-neutral-400 dark:text-neutral-500">one-time</span>
            </span>
            <CheckoutButton offer={offer} send={send} disabled={busy} className={CTA}>
              Get the plan {arrow}
            </CheckoutButton>
          </>
        ) : (
          <ButtonLink href={url} className={`${CTA} ml-auto`}>
            Get the book {arrow}
          </ButtonLink>
        )}
      </footer>
    </article>
  );
}
