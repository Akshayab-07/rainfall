"use client";

import { useMemo } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import seriesData from "@/data/district_series.json";
import districtsData from "@/data/districts.json";

type Series = { dates: string[]; raw: number[]; corrected: number[]; observed: number[] };
type Props = { districtId?: string; limit?: number };
const series = seriesData as Record<string, Series>;
const districts = districtsData as { id: string; name: string }[];

export default function ForecastChart({ districtId = "bengaluru", limit = 60 }: Props) {
  const districtName = districts.find((d) => d.id === districtId)?.name ?? districtId;
  const data = useMemo(() => {
    const s = series[districtId];
    if (!s) return [];
    return s.dates.map((date, i) => ({ date, label: date.slice(5), raw: s.raw[i], corrected: s.corrected[i], observed: s.observed[i] })).slice(-limit);
  }, [districtId, limit]);
  if (!data.length) return <div className="rounded-xl bg-slate-50 p-6 text-sm text-slate-500">No time-series data available for this district.</div>;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4"><h2 className="text-lg font-semibold text-slate-900">Rainfall over time</h2><p className="mt-1 text-sm text-slate-500">{districtName} · last {data.length} sample dates · millimetres</p></div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 10, left: -16, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} minTickGap={28} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} width={42} />
            <Tooltip labelFormatter={(_, payload) => payload?.[0]?.payload?.date ?? ""} formatter={(value, name) => [`${Number(value).toFixed(1)} mm`, name]} contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0", fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Line type="monotone" dataKey="raw" name="Raw forecast" stroke="#94a3b8" strokeWidth={1.8} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="corrected" name="Corrected forecast" stroke="#2563eb" strokeWidth={2.3} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="observed" name="Observed" stroke="#0f766e" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
