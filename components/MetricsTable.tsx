import metricsData from "@/data/metrics.json";

type Score = { rmse: number; [key: string]: unknown };
type Metrics = { test_period: string; train_period: string; n_districts: number; methods: Record<string, string>; overall: Record<string, Score>; notes?: string[] };
const metrics = metricsData as Metrics;
const scoreKeys = Object.keys(metrics.methods);

export default function MetricsTable() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5"><h2 className="text-lg font-semibold text-slate-900">Evaluation metrics</h2><p className="mt-1 text-sm text-slate-500">Test period: {metrics.test_period} · Training period: {metrics.train_period} · {metrics.n_districts} locations</p></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Method</th><th className="px-4 py-3 text-right">RMSE (mm)</th><th className="px-4 py-3 text-right">Heavy rain POD</th><th className="px-4 py-3 text-right">Heavy rain FAR</th><th className="px-5 py-3 text-right">Heavy rain CSI</th></tr></thead>
        <tbody className="divide-y divide-slate-100">{scoreKeys.map((key) => { const score = metrics.overall[key]; const heavy = score["t64.5"] as Record<string, number> | undefined; return <tr key={key} className={key === "hybrid" ? "bg-blue-50/60" : ""}><td className="px-5 py-3 font-medium text-slate-800">{metrics.methods[key]}{key === "hybrid" && <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">Final</span>}</td><td className="px-4 py-3 text-right tabular-nums">{score.rmse.toFixed(2)}</td><td className="px-4 py-3 text-right tabular-nums">{heavy ? (heavy.POD * 100).toFixed(1) + "%" : "—"}</td><td className="px-4 py-3 text-right tabular-nums">{heavy ? (heavy.FAR * 100).toFixed(1) + "%" : "—"}</td><td className="px-5 py-3 text-right tabular-nums">{heavy ? heavy.CSI.toFixed(3) : "—"}</td></tr>; })}</tbody>
      </table></div>
      <p className="border-t border-slate-100 px-5 py-3 text-xs leading-5 text-slate-500">POD = probability of detection; FAR = false alarm ratio; CSI = critical success index. Scores are shown as supplied and are not recalculated.</p>
    </section>
  );
}
