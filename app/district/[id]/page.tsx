import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDistrictById, getAllDistricts, getDailyForecast, DATE_BOUNDS } from '@/lib/data';
import { getRainfallBracket } from '@/lib/rainfallScale';

export function generateStaticParams() {
  return getAllDistricts().map((d) => ({
    id: d.id,
  }));
}

interface DistrictPageProps {
  params: Promise<{ id: string }>;
}

export default async function DistrictDetailPage({ params }: DistrictPageProps) {
  const { id } = await params;
  const district = getDistrictById(id);

  if (!district) {
    notFound();
  }

  // Read data for default date
  const forecast = getDailyForecast(DATE_BOUNDS.defaultDate);
  const districtRainfall = forecast?.districts.find((d) => d.districtId === id);

  const raw = districtRainfall?.raw ?? 0;
  const corrected = districtRainfall?.corrected ?? 0;
  const observed = districtRainfall?.observed ?? 0;
  const heavyProb = districtRainfall?.heavyRainProb ?? 0;
  const veryHeavyProb = districtRainfall?.veryHeavyRainProb ?? 0;

  const bracket = getRainfallBracket(corrected);

  return (
    <div className="min-h-screen bg-[#F5F8FB] text-slate-800 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs hover:shadow-xs transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Station Hero Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0"
                style={{ backgroundColor: bracket.color }}
              />
              <h1 className="text-2xl font-black text-slate-900">
                {district.name}
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              {[district.division, district.state, 'India'].filter(Boolean).join(' • ')}
              <span className="ml-2 font-mono text-xs text-slate-400">
                ({district.lat.toFixed(4)}°N, {district.lng.toFixed(4)}°E)
              </span>
            </p>
          </div>

          <div
            className="self-start sm:self-auto px-4 py-1.5 rounded-full text-xs font-bold shadow-2xs border border-black/5"
            style={{
              backgroundColor: bracket.badgeBg,
              color: bracket.badgeText,
            }}
          >
            {bracket.label} ({corrected.toFixed(1)} mm)
          </div>
        </div>

        {/* Telemetry Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
              Corrected Forecast
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono">
                {corrected.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500 font-semibold">mm/day</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              AI calibrated precipitation estimate
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Raw Forecast
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-700 font-mono">
                {raw.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500 font-semibold">mm/day</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Raw numerical weather prediction model output
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
              Recorded Observation
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono">
                {observed.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500 font-semibold">mm/day</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Ground-truth rain gauge telemetry
            </p>
          </div>
        </div>

        {/* Probability Bars */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col gap-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Precipitation Threshold Probabilities</span>
          </h2>

          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Chance of Heavy Rain (&gt; 64.5 mm)</span>
                <span className="font-mono text-amber-700">{heavyProb}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${heavyProb}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Chance of Very Heavy Rain (&gt; 115.5 mm)</span>
                <span className="font-mono text-red-700">{veryHeavyProb}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                <div
                  className="bg-red-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${veryHeavyProb}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
