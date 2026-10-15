import { ButtonLink } from "@/components/ui/button";
import { ToolLabel } from "./tool-label";

type Offer = { product: string; blurb: string; price: string; url: string };

export function UpsellCard({ offer }: { offer: Offer }) {
  const { product, blurb, price, url } = offer;
  return (
    <article className="p-4 bg-white border-2 border-flame rounded-xl flex gap-4 items-center flex-wrap shadow-sm">
      <div
        aria-hidden="true"
        className="w-16 h-21 shrink-0 rounded-md bg-linear-to-br from-flame to-flame-dark text-white flex items-center justify-center font-display font-bold text-[13px] leading-4 text-center shadow-md"
      >
        {price ? (
          <>
            12
            <br />
            WK
          </>
        ) : (
          <>
            TD
            <br />
            BOOK
          </>
        )}
      </div>
      <div className="flex-[1_1_200px] min-w-0 flex flex-col gap-1">
        <ToolLabel name="generate_upsell_link" className="text-flame-dark" />
        <h3 className="font-display font-semibold text-base leading-5.5">{product}</h3>
        <p className="text-[13px] leading-4.5 text-muted">{blurb}</p>
      </div>
      <ButtonLink variant="flame" href={url}>
        {price ? `Get the plan · ${price}` : "Get the book"}
      </ButtonLink>
    </article>
  );
}
