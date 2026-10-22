import React from 'react';
import { RAINFALL_SCALE } from '@/lib/rainfallScale';

interface LegendProps {
  className?: string;
}

export default function Legend({ className = '' }: LegendProps) {
  return (
    <section
      aria-label="Rainfall Intensity Legend"
      className={`flex flex-col gap-2.5 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
          </svg>
          <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
            Rainfall Classification
          </span>
        </div>
        <span className="text-xs font-medium text-slate-500">
          24-Hour Precipitation (mm)
        </span>
      </div>

      {/* Grid of Classification Strips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {RAINFALL_SCALE.map((bracket) => (
          <div
            key={bracket.id}
            className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50/90 border border-slate-200/60 hover:bg-slate-100/80 transition-colors"
          >
            <span
              className="rounded-full shrink-0 shadow-2xs ring-1 ring-black/10"
              style={{
                backgroundColor: bracket.color,
                width: '14px',
                height: '14px',
              }}
              aria-hidden="true"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-800 truncate">
                {bracket.rangeText}
              </span>
              <span className="text-[11px] text-slate-500 truncate font-medium">
                {bracket.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
