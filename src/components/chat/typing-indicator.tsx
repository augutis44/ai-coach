export function TypingIndicator() {
  return (
    <div className="flex flex-col gap-3 animate-rise">
      <div className="text-xs leading-4 text-muted font-medium">Max</div>
      <span role="status" aria-label="Max is typing" className="flex gap-1 py-1.5">
        {[0, 150, 300].map((delay) => (
          <span key={delay} className="size-2 rounded-full bg-muted animate-dot" style={{ animationDelay: `${delay}ms` }} />
        ))}
      </span>
    </div>
  );
}
