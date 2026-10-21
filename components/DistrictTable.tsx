"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import districtsData from "@/data/districts.json";
import forecastData from "@/data/forecast_by_date.json";

type District = { id: string; name: string; state: string };
type ForecastRow = { id: string; raw_mm: number; corrected_mm: number; observed_mm: number; prob: { heavy: number; very_heavy: number }; warning: string };
type Day = { regime: string; districts: ForecastRow[] };
const districts = districtsData as District[];
const forecasts = forecastData as Record<string, Day>;
const dates = Object.keys(forecasts).sort();
const latestDate = dates[dates.length - 1];

export default function DistrictTable() {
  const [sortBy, setSortBy] = useState<"name" | "raw_mm" | "corrected_mm" | "observed_mm" | "heavy">("corrected_mm");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    const dayRows = forecasts[latestDate]?.districts ?? [];
    return dayRows.map((row) => ({ ...row, district: districts.find((d) => d.id === row.id) })).filter((row) => row.district && row.district.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => {
      const av = sortBy === "name" ? a.district!.name : sortBy === "heavy" ? a.prob.heavy : a[sortBy];
      const bv = sortBy === "name" ? b.district!.name : sortBy === "heavy" ? b.prob.heavy : b[sortBy];
      const cmp = typeof av === "string" && typeof bv === "string" ? av.localeCompare(bv) : Number(av) - Number(bv);
      return direction === "asc" ? cmp : -cmp;
    });
  }, [sortBy, direction, query]);

  function sort(key: typeof sortBy) {
    if (key === sortBy) setDirection((d) => d === "asc" ? "desc" : "asc");
    else { setSortBy(key); setDirection(key === "name" ? "asc" : "desc"); }
  }
  const heading = (label: string, key: typeof sortBy) => (
    <button type="button" onClick={() => sort(key)} className="inline-flex items-center gap-1 whitespace-nowrap font-semibold hover:text-blue-700">
      {label}<span aria-hidden="true" className="text-slate-400">{sortBy === key ? (direction === "asc" ? "↑" : "↓") : "↕"}</span>
    </button>
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-lg font-semibold text-slate-900">District comparison</h2><p className="mt-1 text-sm text-slate-500">Sample values for {latestDate}</p></div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search districts…" aria-label="Search districts" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-56" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>
            <th className="px-5 py-3">{heading("District", "name")}</th><th className="px-4 py-3 text-right">{heading("Raw mm", "raw_mm")}</th><th className="px-4 py-3 text-right">{heading("Corrected mm", "corrected_mm")}</th><th className="px-4 py-3 text-right">{heading("Observed mm", "observed_mm")}</th><th className="px-5 py-3 text-right">{heading("Heavy chance", "heavy")}</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => <tr key={row.id} className="transition-colors hover:bg-blue-50/50">
              <td className="px-5 py-3"><Link className="font-semibold text-slate-800 hover:text-blue-700 hover:underline" href={`/district/${row.id}`}>{row.district!.name}</Link><div className="text-xs text-slate-500">{row.district!.state}</div></td>
              <td className="px-4 py-3 text-right tabular-nums text-slate-600">{row.raw_mm.toFixed(1)}</td><td className="px-4 py-3 text-right font-semibold tabular-nums text-blue-700">{row.corrected_mm.toFixed(1)}</td><td className="px-4 py-3 text-right tabular-nums text-slate-600">{row.observed_mm.toFixed(1)}</td><td className="px-5 py-3 text-right"><span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold tabular-nums text-blue-700">{(row.prob.heavy * 100).toFixed(1)}%</span></td>
            </tr>)}
            {rows.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">No districts match that search.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Click a district name for its time series and probability details. Values are supplied sample data, not live forecasts.</div>
    </section>
  );
}
