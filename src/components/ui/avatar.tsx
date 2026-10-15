export function CoachAvatar({ size = "sm", online = false }: { size?: "sm" | "lg"; online?: boolean }) {
  const dims = size === "lg" ? "size-14 text-xl" : "size-9 text-sm";
  return (
    <span
      aria-hidden="true"
      className={`relative ${dims} shrink-0 rounded-full bg-zinc-700 text-lime dark:bg-lime dark:text-zinc-900 inline-flex items-center justify-center font-bold`}
    >
      M
      {online && <span className="absolute -right-px -bottom-px size-2.75 rounded-full bg-green-500 border-2 border-surface" />}
    </span>
  );
}
