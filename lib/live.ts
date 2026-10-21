import type { Regime, Warning } from "./types";
import { warningFor } from "./warning";

export interface LeadModel {
  fc_q: number[];
  obs_q: number[];
  z_mean: number;
  z_sd: number;
  p_heavy: number[];
  p_very: number[];
  n: number;
}
export interface LiveModel {
  trained_on: string;
  season_months: number[];
  bin_edges: number[];
  core: { id: string; lat: number; lon: number }[];
  leads: Record<string, LeadModel>;
}
// one location in an Open-Meteo answer
export interface HourlyLoc {
  hourly: { time: string[]; precipitation: (number | null)[] };
}
export interface LiveDay {
  lead: number;
  windowEnd: string; // the date the 24 h window ends on, 08:30 IST (IMD convention)
  raw: number | null;
  corrected: number | null;
  pHeavy: number | null;
  pVery: number | null;
  warning: Warning | null;
  regime: Regime | null; // null when outside the June-September season
  inSeason: boolean;
}

// same behaviour as numpy.interp
export function interp(x: number, xp: number[], fp: number[]): number {
  const n = xp.length;
  if (x <= xp[0]) return fp[0];
  if (x >= xp[n - 1]) return fp[n - 1];
  let lo = 0;
  let hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (xp[mid] <= x) lo = mid;
    else hi = mid;
  }
  if (xp[hi] === xp[lo]) return fp[lo];
  return fp[lo] + ((fp[hi] - fp[lo]) * (x - xp[lo])) / (xp[hi] - xp[lo]);
}

const iso = (ms: number) => new Date(ms).toISOString().slice(0, 16); // "2026-10-19T03:00"

// 24 h totals for windows 03 UTC to 03 UTC; window j starts on day D0 + j
export function dailyTotals(loc: HourlyLoc, d0: Date, nWindows: number): (number | null)[] {
  const byTime = new Map<string, number | null>();
  loc.hourly.time.forEach((t, i) => byTime.set(t, loc.hourly.precipitation[i]));
  const out: (number | null)[] = [];
  for (let j = 0; j < nWindows; j++) {
    const start = Date.UTC(d0.getUTCFullYear(), d0.getUTCMonth(), d0.getUTCDate() + j, 3);
    let sum = 0;
    let ok = true;
    for (let h = 0; h < 24; h++) {
      const v = byTime.get(iso(start + h * 3600_000));
      if (v === undefined || v === null) {
        ok = false;
        break;
      }
      sum += v;
    }
    out.push(ok ? sum : null);
  }
  return out;
}

export function computeLive(model: LiveModel, place: HourlyLoc, core: HourlyLoc[], now: Date): LiveDay[] {
  const d0 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const nWin = 8;
  const placeTot = dailyTotals(place, d0, nWin);
  const coreTot = core.map((c) => dailyTotals(c, d0, nWin));
  const days: LiveDay[] = [];
  for (let j = 0; j < nWin; j++) {
    const end = new Date(Date.UTC(d0.getUTCFullYear(), d0.getUTCMonth(), d0.getUTCDate() + j + 1));
    const inSeason = model.season_months.includes(end.getUTCMonth() + 1);
    const lm = model.leads[String(j)];
    const raw = placeTot[j];
    let corrected: number | null = null;
    let pHeavy: number | null = null;
    let pVery: number | null = null;
    let regime: Regime | null = null;
    if (lm && raw !== null) {
      corrected = interp(raw, lm.fc_q, lm.obs_q);
      const bin = model.bin_edges.filter((e) => corrected !== null && corrected >= e).length;
      pHeavy = lm.p_heavy[bin];
      pVery = lm.p_very[bin];
      const cv = coreTot.map((t) => t[j]);
      if (inSeason && cv.every((v) => v !== null)) {
        const mean = (cv as number[]).reduce((a, b) => a + b, 0) / cv.length;
        const z = (mean - lm.z_mean) / lm.z_sd;
        regime = z > 0.5 ? "active" : z < -0.5 ? "break" : "normal";
      }
    }
    days.push({
      lead: j,
      windowEnd: end.toISOString().slice(0, 10),
      raw,
      corrected,
      pHeavy,
      pVery,
      warning: corrected === null ? null : warningFor(corrected),
      regime,
      inSeason,
    });
  }
  return days;
}

export async function fetchHourly(points: { lat: number; lon: number }[]): Promise<HourlyLoc[]> {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${points.map((p) => p.lat).join(",")}` +
    `&longitude=${points.map((p) => p.lon).join(",")}` +
    "&hourly=precipitation&past_days=1&forecast_days=9&timezone=UTC";
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Open-Meteo answered ${res.status}`);
  const j = (await res.json()) as HourlyLoc | HourlyLoc[];
  return Array.isArray(j) ? j : [j];
}
