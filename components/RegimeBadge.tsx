import React from 'react';
import { MonsoonRegime } from '@/lib/data';

interface RegimeBadgeProps {
  regime: MonsoonRegime;
  className?: string;
}

export default function RegimeBadge({ regime, className = '' }: RegimeBadgeProps) {
  const getBadgeStyle = () => {
    switch (regime) {
      case 'Active':
        return {
          container: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
          dot: 'bg-[#059669]',
          ping: true,
          label: 'Active',
          description: 'Active monsoon conditions across multiple synoptic divisions',
        };
      case 'Break':
        return {
          container: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
          dot: 'bg-[#D97706]',
          ping: false,
          label: 'Break',
          description: 'Suppressed convective activity; break monsoon conditions',
        };
      case 'Normal':
      default:
        return {
          container: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
          dot: 'bg-[#2563EB]',
          ping: false,
          label: 'Normal',
          description: 'Normal seasonal monsoon trough alignment',
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Current Monsoon Regime: ${style.label}`}
      title={style.description}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold tracking-tight transition-colors shadow-2xs ${style.container} ${className}`}
    >
      <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
        {style.ping && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${style.dot}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${style.dot}`} />
      </span>
      <span>Monsoon Regime: {style.label}</span>
    </div>
  );
}
