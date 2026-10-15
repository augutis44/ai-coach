const TONES = {
  plain: "",
  box: "px-3 py-2.5 rounded-lg bg-cream",
  alert: "px-3 py-2.5 rounded-lg bg-danger-soft [&>dd]:text-danger",
};

export function TraceRow({ label, value, tone = "plain" }: { label: string; value: string; tone?: keyof typeof TONES }) {
  return (
    <div className={`flex justify-between gap-3 text-sm leading-5 ${TONES[tone]}`}>
      <dt className="text-muted">{label}</dt>
      <dd className="font-semibold text-right">{value}</dd>
    </div>
  );
}

export function TraceSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5">
      <h3 className="text-xs leading-4 text-muted uppercase tracking-[0.08em]">{title}</h3>
      {children}
    </section>
  );
}
