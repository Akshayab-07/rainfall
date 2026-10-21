import Link from "next/link";
import districtsData from "@/data/districts.json";
import seriesData from "@/data/district_series.json";
import forecastData from "@/data/forecast_by_date.json";
import ForecastChart from "@/components/ForecastChart";
import ProbabilityBars from "@/components/ProbabilityBars";
import type { DistrictInfo } from "@/lib/types";

type District = DistrictInfo & { state: string; loc_class: string };
type Series = { dates: string[]; raw: number[]; corrected: number[]; observed: number[] };
type ForecastRow = { id: string; raw_mm: number; corrected_mm: number; observed_mm: number; prob: { heavy: number; very_heavy: number }; warning: string };
type Day = { regime: string; districts: ForecastRow[] };
const districts = districtsData as District[];
const series = seriesData as Record<string, Series>;
const forecasts = forecastData as Record<string, Day>;
const dates = Object.keys(forecasts).sort();
const latestDate = dates[dates.length - 1];

export function generateStaticParams() {
  return districts.map((d) => ({ id: d.id }));
}

export default async function DistrictPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const district = districts.find((d) => d.id === id);
  if (!district) return <main className="min-h-screen bg-slate-50 p-8"><h1 className="text-2xl font-bold">District not found</h1><Link className="mt-4 inline-block text-blue-700 hover:underline" href="/">Return to dashboard</Link></main>;
  const current = forecasts[latestDate]?.districts.find((row) => row.id === id);
  const s = series[id];
  const total = (values: number[] | undefined) => values?.reduce((sum, value) => sum + value, 0) ?? 0;
  return <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8"><div className="mx-auto max-w-6xl">
    <Link href="/" className="text-sm font-medium text-blue-700 hover:underline">← Back to dashboard</Link>
    <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">District details</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{district.name}</h1><p className="mt-2 text-slate-500">{district.state} · {district.loc_class} location</p></div><span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">Sample date: {latestDate}</span></div>
    <div className="mt-7 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Raw forecast</p><p className="mt-2 text-3xl font-bold">{(current?.raw_mm ?? 0).toFixed(1)} <span className="text-base font-medium text-slate-500">mm</span></p></div><div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 shadow-sm"><p className="text-sm text-blue-700">Corrected forecast</p><p className="mt-2 text-3xl font-bold text-blue-800">{(current?.corrected_mm ?? 0).toFixed(1)} <span className="text-base font-medium">mm</span></p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Observed rainfall</p><p className="mt-2 text-3xl font-bold">{(current?.observed_mm ?? 0).toFixed(1)} <span className="text-base font-medium text-slate-500">mm</span></p></div></div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]"><ForecastChart districtId={id} limit={60} /><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold">Rain probability</h2><p className="mb-5 mt-1 text-sm text-slate-500">From the latest supplied sample</p><ProbabilityBars heavy={current?.prob.heavy ?? 0} veryHeavy={current?.prob.very_heavy ?? 0} compact /><div className="mt-6 border-t border-slate-100 pt-4"><p className="text-xs leading-5 text-slate-500">Series totals across the available sample dates (not a climatological summary).</p><div className="mt-3 flex justify-between text-sm"><span className="text-slate-500">Raw total</span><span className="font-semibold">{total(s?.raw).toFixed(1)} mm</span></div><div className="mt-2 flex justify-between text-sm"><span className="text-slate-500">Corrected total</span><span className="font-semibold text-blue-700">{total(s?.corrected).toFixed(1)} mm</span></div><div className="mt-2 flex justify-between text-sm"><span className="text-slate-500">Observed total</span><span className="font-semibold">{total(s?.observed).toFixed(1)} mm</span></div></div></section></div>
    <p className="mt-5 text-xs leading-5 text-slate-500">The repository contains sample evaluation data for 2024–2025. This page is not a live weather service or emergency warning system.</p>
  </div></main>;
}
