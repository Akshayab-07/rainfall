import { Suspense } from "react";
import { connection } from "next/server";
import OutlookChart, { type OutlookPoint } from "@/components/OutlookChart";
import RegimeBadge from "@/components/RegimeBadge";
import liveModelRaw from "@/data/live_model.json";
import { SKILL, PLACES } from "@/lib/outlook";
import { computeLive, fetchHourly, type LiveDay, type LiveModel } from "@/lib/live";
import { WARNING_COLORS } from "@/lib/warning";

const MODEL = liveModelRaw as unknown as LiveModel;
type Params = { district?: string };
const MAX_CORRECTED_LEAD = 3; // beyond this the correction mostly stretches a smooth forecast

const fmt = (v: number | null, d = 1) => (v === null ? "-" : v.toFixed(d));
const pct = (v: number | null) => (v === null ? "-" : `${Math.round(v * 100)}%`);
const pretty = (iso: string) => new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

async function Content({ searchParams }: { searchParams: Promise<Params> }) {
  await connection(); // this page depends on the current time, so it renders on every request
  const sp = await searchParams;
  const place = PLACES.find((p) => p.id === sp.district) ?? PLACES.find((p) => p.id === "mumbai") ?? PLACES[0];
  const now = new Date();

  let days: LiveDay[] | null = null;
  let error = "";
  try {
    const locs = await fetchHourly([{ lat: place.lat, lon: place.lon }, ...MODEL.core]);
    days = computeLive(MODEL, locs[0], locs.slice(1), now);
  } catch (e) {
    error = e instanceof Error ? e.message : "unknown error";
  }
  const offSeason = !!days && days.some((d) => !d.inSeason);

  const rows: OutlookPoint[] = (days ?? []).map((d) => ({
    label: `Day ${d.lead} (${pretty(d.windowEnd)})`,
    raw: d.raw,
    corrected: d.lead <= MAX_CORRECTED_LEAD ? d.corrected : null,
    observed: null,
  }));

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">Live outlook (experimental)</h1>
      <p className="text-sm text-gray-400">
        Today&apos;s forecast from Open-Meteo for the next 8 days, corrected with the lead-time tables learned from the
        2024 and 2025 monsoons. Each day is the rain in the 24 hours ending 08:30 IST on that date. Generated{" "}
        {now.toISOString().slice(0, 16).replace("T", " ")} UTC.
      </p>

      <form method="get" action="/live" className="flex flex-wrap items-end gap-3 text-sm">
        <label className="flex flex-col gap-1">
          Place
          <select name="district" defaultValue={place.id} className="rounded bg-white/10 px-3 py-1">
            {PLACES.map((p) => (
              <option key={p.id} value={p.id} className="text-black">
                {p.name}, {p.state}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="rounded bg-sky-500 px-4 py-1 font-semibold text-black">
          Get forecast
        </button>
      </form>

      {offSeason && (
        <div className="rounded border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
          <b>Outside the training season.</b> The corrections were learned from June to September monsoon data and are
          being applied to other months, so they are <b>not validated</b>. The monsoon regime, the heavy-rain chances
          and the warning colours are only shown in season. IMD rainfall is not available in real time, so there is no
          observed line.
        </div>
      )}
      {error && (
        <div className="rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
          Could not get the live forecast ({error}). Please try again in a minute.
        </div>
      )}

      {days && (
        <>
          <h2 className="text-lg font-semibold">
            {place.name}, {place.state}
          </h2>
          <OutlookChart rows={rows} showObserved={false} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="p-2">Day</th>
                  <th className="p-2">24 h to 08:30 IST on</th>
                  <th className="p-2">Regime</th>
                  <th className="p-2">Raw (mm)</th>
                  <th className="p-2">Corrected (mm)</th>
                  <th className="p-2">Heavy chance</th>
                  <th className="p-2">Very heavy chance</th>
                  <th className="p-2">Warning</th>
                  <th className="p-2">Trust</th>
                </tr>
              </thead>
              <tbody>
                {days.map((d) => (
                  <tr key={d.lead} className="border-b border-white/5">
                    <td className="p-2">Day {d.lead}</td>
                    <td className="p-2">{pretty(d.windowEnd)}</td>
                    <td className="p-2">{d.regime ? <RegimeBadge regime={d.regime} /> : "n/a"}</td>
                    <td className="p-2">{fmt(d.raw)}</td>
                    <td className="p-2">{d.lead > MAX_CORRECTED_LEAD ? "-" : d.inSeason ? fmt(d.corrected) : `${fmt(d.corrected)}*`}</td>
                    <td className="p-2">{d.inSeason ? pct(d.pHeavy) : "n/a"}</td>
                    <td className="p-2">{d.inSeason ? pct(d.pVery) : "n/a"}</td>
                    <td className="p-2">
                      {d.warning && d.inSeason ? (
                        <span
                          className="rounded px-2 py-0.5 text-xs font-medium text-black"
                          style={{ background: WARNING_COLORS[d.warning] }}
                        >
                          {d.warning}
                        </span>
                      ) : (
                        "n/a"
                      )}
                    </td>
                    <td className="p-2">{d.inSeason ? (SKILL.by_lead[String(d.lead)]?.confidence ?? "-") : "not validated"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {offSeason && <p className="text-xs text-gray-500">* Experimental: learned from June to September data, not validated for this month.</p>}
      <p className="text-xs text-gray-500">
        Corrected amounts are shown for Days 0 to 3 only. At longer leads the raw forecast is very smooth, so the
        correction mostly stretches it. In season, rely on the heavy-rain chance at longer leads.
      </p>
      <p className="text-xs text-gray-500">
        Method: per-lead quantile mapping of the raw forecast and heavy-rain chances from past frequencies, trained on{" "}
        {MODEL.trained_on}. Lead times are matched approximately (within about 12 hours). Only the 25 pilot places are
        supported. This is a demonstration, not an official forecast.
      </p>
    </main>
  );
}

export default function LivePage({ searchParams }: { searchParams: Promise<Params> }) {
  return (
    <Suspense fallback={<div className="p-6">Loading the live forecast...</div>}>
      <Content searchParams={searchParams} />
    </Suspense>
  );
}
