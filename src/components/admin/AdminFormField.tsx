export function AdminFormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 w-full">
      <label className="mb-1.5 block text-xs font-medium text-white/60">{label}</label>
      {children}
    </div>
  );
}

export const adminInputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/40";

export const adminTextareaClass =
  "w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/40";
