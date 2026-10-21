import { Suspense } from "react";
import OutlookChart, { type OutlookPoint } from "@/components/OutlookChart";
import RegimeBadge from "@/components/RegimeBadge";
import { ISSUE_DATES, OUTLOOK, PLACES, SKILL } from "@/lib/outlook";
import { WARNING_COLORS } from "@/lib/warning";

type Params = { district?: string; issue?: string };

const fmt = (v: number | null | undefined, d = 1) => (v === null || v === undefined ? "-" : v.toFixed(d));
const pct = (v: number | null | undefined) => (v === null || v === undefined ? "-" : `${Math.round(v * 100)}%`);
const dayLabel = (k: number) => (k === 0 ? "Day 0" : `Day ${k}`);

async function Content({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const defaultIssue = ISSUE_DATES.includes("2025-07-14") ? "2025-07-14" : ISSUE_DATES[Math.floor(ISSUE_DATES.length / 2)];
  const issueOk = !!sp.issue && !!OUTLOOK[sp.issue];
  const issue = issueOk ? (sp.issue as string) : defaultIssue;
  const place = PLACES.find((p) => p.id === sp.district) ?? PLACES.find((p) => p.id === "mumbai") ?? PLACES[0];
  const day = OUTLOOK[issue];
  const d = day.districts[place.id];

  const rows: OutlookPoint[] = day.dates.map((date, k) => ({
    label: `${dayLabel(k)} (${date.slice(5)})`,
    raw: d.raw[k],
    corrected: d.corrected[k],
    observed: d.observed[k],
  }));

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">Outlook: the next 8 days</h1>
      <p className="text-sm text-gray-400">
        Replay of the 2024 and 2025 monsoons. Pick a place and the day the forecast was issued. Day 0 is the latest
        forecast for the issue day itself; Day 7 is a week ahead. Each season was corrected by a model trained on the
        other season, so none of these results were seen in training.
      </p>

      <form method="get" action="/outlook" className="flex flex-wrap items-end gap-3 text-sm">
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
        <label className="flex flex-col gap-1">
          Issue date
          <input
            type="date"
            name="issue"
            defaultValue={issue}
            min={ISSUE_DATES[0]}
            max={ISSUE_DATES[ISSUE_DATES.length - 1]}
            className="rounded bg-white/10 px-3 py-1"
          />
        </label>
        <button type="submit" className="rounded bg-sky-500 px-4 py-1 font-semibold text-black">
          Show forecast
        </button>
      </form>
      {sp.issue && !issueOk && (
        <p className="text-sm text-amber-400">No data for {sp.issue}. Showing {issue} instead.</p>
      )}

      <h2 className="text-lg font-semibold">
        {place.name}, issued {issue}
      </h2>
      <OutlookChart rows={rows} />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="p-2">Day</th>
              <th className="p-2">Date</th>
              <th className="p-2">Regime</th>
              <th className="p-2">Raw (mm)</th>
              <th className="p-2">Corrected (mm)</th>
              <th className="p-2">Observed (mm)</th>
              <th className="p-2">Heavy chance</th>
              <th className="p-2">Warning</th>
              <th className="p-2">Trust</th>
            </tr>
          </thead>
          <tbody>
            {day.dates.map((date, k) => {
              const w = d.warning[k];
              const regime = day.regime[k];
              return (
                <tr key={date} className="border-b border-white/5">
                  <td className="p-2">{dayLabel(k)}</td>
                  <td className="p-2">{date}</td>
                  <td className="p-2">{regime ? <RegimeBadge regime={regime} /> : "-"}</td>
                  <td className="p-2">{fmt(d.raw[k])}</td>
                  <td className="p-2">{fmt(d.corrected[k])}</td>
                  <td className="p-2">{fmt(d.observed[k])}</td>
                  <td className="p-2">{pct(d.p_heavy[k])}</td>
                  <td className="p-2">
                    {w ? (
                      <span className="rounded px-2 py-0.5 text-xs font-medium text-black" style={{ background: WARNING_COLORS[w] }}>
                        {w}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-2">{SKILL.by_lead[String(k)]?.confidence ?? "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">How much to trust each day</h2>
        <p className="text-sm text-gray-400">
          Heavy-rain skill (ETS at 64.5 mm; higher is better) for the raw and corrected forecast, over all 25 places.
          Fewer than about 110 heavy-rain days per season, so small differences are noise.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="p-2">Day</th>
                <th className="p-2">Trust</th>
                <th className="p-2">Raw ETS</th>
                <th className="p-2">Corrected ETS</th>
                <th className="p-2">Corrected POD</th>
                <th className="p-2">Corrected FAR</th>
                <th className="p-2">Chance skill</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(SKILL.by_lead).map(([k, s]) => (
                <tr key={k} className="border-b border-white/5">
                  <td className="p-2">{dayLabel(Number(k))}</td>
                  <td className="p-2">{s.confidence}</td>
                  <td className="p-2">{fmt(s.raw.ets_64_5, 3)}</td>
                  <td className="p-2">{fmt(s.hybrid.ets_64_5, 3)}</td>
                  <td className="p-2">{fmt(s.hybrid.pod_64_5, 2)}</td>
                  <td className="p-2">{fmt(s.hybrid.far_64_5, 2)}</td>
                  <td className="p-2">{fmt(s.brier_skill_heavy, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500">{SKILL.confidence_rule}</p>
        <p className="text-xs text-gray-500">
          At Days 4 to 7 the raw forecast is very smooth, so the correction stretches it a lot. At those leads, use the
          heavy-rain chance rather than the corrected amount.
        </p>
      </section>
    </main>
  );
}

export default function OutlookPage({ searchParams }: { searchParams: Promise<Params> }) {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <Content searchParams={searchParams} />
    </Suspense>
  );
}
