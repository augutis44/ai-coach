export function ChatHeader() {
  return (
    <header className="h-16 shrink-0 px-4 sm:px-6 flex items-center justify-between gap-4 bg-white border-b border-line">
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="size-9 rounded-[10px] bg-linear-to-br from-flame to-flame-dark text-white flex items-center justify-center font-display font-bold text-base shadow-sm"
        >
          F
        </div>
        <div className="flex flex-col">
          <span className="font-display font-semibold text-base leading-5">FitPulse Coach</span>
          <span className="flex items-center gap-1.5 text-[13px] leading-4 text-muted">
            <span className="size-2 rounded-full bg-success" aria-hidden="true" />
            Coach Max · replies in a few seconds
          </span>
        </div>
      </div>
      <span className="hidden sm:block text-[13px] leading-4 text-muted px-2.5 py-1.5 border border-line rounded-full">
        Prototype v0.1 · mock tools
      </span>
    </header>
  );
}
