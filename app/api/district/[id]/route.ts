import { NextResponse } from "next/server";
import series from "@/data/district_series.json";
import districts from "@/data/districts.json";
import type { DistrictInfo, Series } from "@/lib/types";

const S = series as unknown as Record<string, Series>;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const s = S[id];
  if (!s) {
    return NextResponse.json({ error: "district not found" }, { status: 404 });
  }
  const info = (districts as DistrictInfo[]).find((d) => d.id === id);
  return NextResponse.json({ ...info, series: s });
}
