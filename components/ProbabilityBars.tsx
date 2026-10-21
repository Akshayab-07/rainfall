type ProbabilityBarsProps = { heavy: number; veryHeavy: number; compact?: boolean };

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  const percent = Math.max(0, Math.min(100, value * 100));
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold tabular-nums text-slate-900">{percent.toFixed(1)}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={label} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default function ProbabilityBars({ heavy, veryHeavy, compact = false }: ProbabilityBarsProps) {
  return (
    <div className={compact ? "space-y-3" : "space-y-5"}>
      <Bar label="Heavy rain · ≥64.5 mm" value={heavy} color="bg-blue-500" />
      <Bar label="Very heavy rain · ≥115.6 mm" value={veryHeavy} color="bg-indigo-600" />
      <p className="text-xs leading-5 text-slate-500">Probabilities are taken from the supplied forecast sample; they are not live alerts.</p>
    </div>
  );
}
