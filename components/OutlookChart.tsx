"use client";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface OutlookPoint {
  label: string;
  raw: number | null;
  corrected: number | null;
  observed: number | null;
}

export default function OutlookChart({ rows, showObserved = true }: { rows: OutlookPoint[]; showObserved?: boolean }) {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="label" stroke="#94a3b8" interval={0} angle={-30} textAnchor="end" height={64} tick={{ fontSize: 11 }} />
          <YAxis stroke="#94a3b8" unit=" mm" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="raw" name="Raw forecast" stroke="#94a3b8" dot />
          <Line type="monotone" dataKey="corrected" name="Corrected" stroke="#38bdf8" strokeWidth={2} dot />
          {showObserved && (
            <Line type="monotone" dataKey="observed" name="Observed (IMD)" stroke="#f97316" strokeWidth={2} dot />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
