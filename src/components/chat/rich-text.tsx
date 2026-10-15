import { offerByUrl } from "@/lib/agent/offers";
import { parseRichText } from "@/lib/rich-text";
import type { Send } from "@/lib/types";
import { CheckoutButton } from "@/components/checkout/checkout-button";

/** Model text with bold and links; links to one of our checkout URLs open the in-app checkout instead. */
export function RichText({ text, send, busy }: { text: string; send?: Send; busy?: boolean }) {
  return parseRichText(text).map((s, i) => {
    if (s.type === "bold") return <strong key={i} className="font-semibold text-ink">{s.text}</strong>;
    const offer = s.type === "link" && send ? offerByUrl(s.href) : undefined;
    if (offer && send)
      return (
        <CheckoutButton key={i} offer={offer} send={send} disabled={busy} className="inline font-medium underline text-ink cursor-pointer disabled:cursor-not-allowed">
          {s.text}
        </CheckoutButton>
      );
    if (s.type === "link")
      return (
        <a key={i} href={s.href} target="_blank" rel="noreferrer" className="font-medium underline">
          {s.text}
        </a>
      );
    return s.text;
  });
}
