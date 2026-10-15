import { ButtonLink } from "@/components/ui/button";
import { ToolLabel } from "./tool-label";

export function ReviewCard({ url }: { url: string }) {
  return (
    <article className="p-4 bg-gold-soft border border-gold-line rounded-xl flex flex-col gap-2">
      <header className="flex justify-between items-center gap-3 flex-wrap">
        <h3 className="font-display font-semibold text-[15px] leading-5">Enjoying the coaching?</h3>
        <ToolLabel name="send_review_request" className="text-gold" />
      </header>
      <div aria-hidden="true" className="text-lg leading-5 tracking-[0.15em] text-star">
        ★★★★★
      </div>
      <p className="text-body">A quick review helps other people find a coach that actually sticks. It takes about a minute.</p>
      <ButtonLink variant="dark" href={url} className="self-start">
        Leave a review on Trustpilot
      </ButtonLink>
    </article>
  );
}
