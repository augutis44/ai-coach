export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[13px] leading-4 px-2.5 py-1 bg-teal-soft text-teal rounded-full first-letter:uppercase">
      {children}
    </span>
  );
}
