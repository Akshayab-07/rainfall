import Link from "next/link";
import MetricsTable from "@/components/MetricsTable";
import metricsData from "@/data/metrics.json";

type Metrics = { test_period: string; train_period: string; n_districts: number; overall: Record<string, { rmse: number }> };
const metrics = metricsData as Metrics;
const rmseEntries = Object.entries(metrics.overall).map(([key, value]) => ({ key, rmse: value.rmse })).sort((a, b) => a.rmse - b.rmse);

export default function VerificationPage() {
  return <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-8"><div className="mx-auto max-w-6xl">
    <Link href="/" className="text-sm font-medium text-blue-700 hover:underline">← Back to dashboard</Link>
    <div className="mt-6"><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Model evaluation</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Verification & scores</h1><p className="mt-3 max-w-2xl leading-7 text-slate-600">Evaluation results read directly from <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">data/metrics.json</code>. No values are estimated or recalculated by this page.</p></div>
    <div className="mt-7 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Locations in pilot</p><p className="mt-2 text-3xl font-bold">{metrics.n_districts}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Training period</p><p className="mt-2 text-xl font-bold">{metrics.train_period}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Test period</p><p className="mt-2 text-xl font-bold">{metrics.test_period}</p></div></div>
    <div className="mt-7"><MetricsTable /></div>
    <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="text-lg font-semibold">RMSE comparison</h2><p className="mt-1 text-sm text-slate-500">Lower RMSE indicates a smaller average error for the supplied test sample.</p><div className="mt-5 space-y-4">{rmseEntries.map((entry) => <div key={entry.key}><div className="mb-1.5 flex justify-between gap-3 text-sm"><span className="text-slate-700">{entry.key}</span><span className="font-semibold tabular-nums">{entry.rmse.toFixed(2)} mm</span></div><div className="h-2.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-500" style={{ width: `${(entry.rmse / Math.max(...rmseEntries.map((x) => x.rmse))) * 100}%` }} /></div></div>)}</div></section>
    <p className="mt-5 text-xs leading-5 text-slate-500">Important: this is a pilot evaluation on 25 locations. The supplied project notes caution that very-heavy-rain events are few; interpret those event scores cautiously. FSS was not computed.</p>
  </div></main>;
}
