import { NextResponse } from "next/server";
import forecast from "@/data/forecast_by_date.json";

export async function GET() {
  return NextResponse.json(Object.keys(forecast).sort());
}
