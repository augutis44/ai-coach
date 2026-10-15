import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export function ReviewCard({ url }: { url: string }) {
  return (
    <article className="p-4.5 bg-card border border-line rounded-2xl shadow-xs flex items-center gap-4 flex-wrap">
      <div className="flex-[1_1_260px] min-w-0 flex flex-col gap-1.5">
        <div className="flex gap-0.5 text-trustpilot" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((n) => (
            <svg key={n} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5L5.5 21l2-7.5L2 9h7z" />
            </svg>
          ))}
        </div>
        <h3 className="text-base leading-5.5 font-semibold tracking-tight text-ink">Loving the coaching?</h3>
        <p className="text-sm leading-5 text-muted">A one-minute review helps other people find a coach that actually sticks.</p>
      </div>
      <ButtonLink variant="outline" href={url}>
        Review on Trustpilot
        <Icon size={14}><path d="M7 17 17 7M9 7h8v8" /></Icon>
      </ButtonLink>
    </article>
  );
}
