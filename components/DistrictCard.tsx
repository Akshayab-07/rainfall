import React from 'react';
import { getRainfallBracket } from '@/lib/rainfallScale';

export interface DistrictCardProps {
  name: string;
  rainfall: number;
  layerLabel: string;
  onClick?: () => void;
  state?: string;
  division?: string;
  biasAdjustment?: number;
  className?: string;
}

export default function DistrictCard({
  name,
  rainfall,
  layerLabel,
  onClick,
  state,
  division,
  biasAdjustment,
  className = '',
}: DistrictCardProps) {
  const bracket = getRainfallBracket(rainfall);

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`flex flex-col bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs transition-all duration-200 text-left ${
        onClick
          ? 'cursor-pointer hover:shadow-md hover:border-blue-400 group focus:outline-hidden focus:ring-2 focus:ring-blue-600'
          : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
              style={{ backgroundColor: bracket.color }}
              aria-hidden="true"
            />
            <h4 className="text-base font-bold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
              {name}
            </h4>
          </div>
          {(division || state) && (
            <span className="text-xs text-slate-500 block truncate mt-0.5">
              {[division, state].filter(Boolean).join(' • ')}
            </span>
          )}
        </div>

        <span
          className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-tight shrink-0 shadow-2xs border border-black/5"
          style={{
            backgroundColor: bracket.badgeBg,
            color: bracket.badgeText,
          }}
        >
          {bracket.shortLabel}
        </span>
      </div>

      <div className="flex items-baseline justify-between mt-auto pt-2.5 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
            {rainfall.toFixed(1)}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            mm/day ({layerLabel})
          </span>
        </div>

        {biasAdjustment !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-bold ${
              biasAdjustment <= 0 ? 'text-emerald-700' : 'text-blue-700'
            }`}
            title="Model bias compensation vs raw forecast"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span>
              Adj: {biasAdjustment > 0 ? `+${biasAdjustment.toFixed(1)}` : biasAdjustment.toFixed(1)}mm
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
