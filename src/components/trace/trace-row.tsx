const TONES = {
  plain: "",
  box: "px-2.5 py-2 rounded-lg bg-raised font-mono text-xs",
  alert: "px-2.5 py-2 rounded-lg bg-raised font-mono text-xs [&>dd]:text-danger",
};

export function TraceRow({ label, value, tone = "plain" }: { label: string; value: string; tone?: keyof typeof TONES }) {
  return (
    <div className={`flex justify-between gap-2 ${TONES[tone]}`}>
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-ink text-right">{value}</dd>
    </div>
  );
}

export function TraceSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-[11px] leading-4 font-semibold uppercase tracking-[0.06em] text-muted">{title}</h3>
      {children}
    </section>
  );
}
