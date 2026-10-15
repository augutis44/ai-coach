export function CoachAvatar({ size = "sm" }: { size?: "sm" | "lg" }) {
  const dims = size === "lg" ? "size-14 text-xl" : "size-8 text-[13px]";
  return (
    <div
      aria-hidden="true"
      className={`${dims} shrink-0 rounded-full bg-teal text-white flex items-center justify-center font-display font-semibold`}
    >
      M
    </div>
  );
}
