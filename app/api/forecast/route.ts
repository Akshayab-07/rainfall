import { NextResponse } from "next/server";
import forecast from "@/data/forecast_by_date.json";
import districts from "@/data/districts.json";
import type { DayData, DistrictInfo, DistrictRow } from "@/lib/types";

const F = forecast as unknown as Record<string, DayData>;
const info = new Map((districts as DistrictInfo[]).map((d) => [d.id, d]));

export async function GET(req: Request) {
  const date = new URL(req.url).searchParams.get("date") ?? "";
  const day = F[date];
  if (!day) {
    return NextResponse.json({ error: "date not found" }, { status: 404 });
  }
  const rows: DistrictRow[] = day.districts.map((d) => ({
    ...(info.get(d.id) as DistrictInfo),
    ...d,
  }));
  return NextResponse.json({ date, regime: day.regime, districts: rows });
}
