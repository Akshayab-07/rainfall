import { NextResponse } from "next/server";
import metrics from "@/data/metrics.json";

export async function GET() {
  return NextResponse.json(metrics);
}
