import React, { useRef } from 'react';
import { DATE_BOUNDS } from '@/lib/data';

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  hasData: boolean;
  className?: string;
}

export default function DatePicker({
  selectedDate,
  onDateChange,
  hasData,
  className = '',
}: DatePickerProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const formatDateDisplay = (isoDate: string) => {
    try {
      const [year, month, day] = isoDate.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoDate;
    }
  };

  const handlePrevDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 1);
    const prevDate = current.toISOString().split('T')[0];
    if (prevDate >= DATE_BOUNDS.min) {
      onDateChange(prevDate);
    }
  };

  const handleNextDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + 1);
    const nextDate = current.toISOString().split('T')[0];
    if (nextDate <= DATE_BOUNDS.max) {
      onDateChange(nextDate);
    }
  };

  const isAtMin = selectedDate <= DATE_BOUNDS.min;
  const isAtMax = selectedDate >= DATE_BOUNDS.max;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
        <button
          type="button"
          aria-label="Previous day"
          title="Previous day"
          disabled={isAtMin}
          onClick={handlePrevDay}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.focus()}
          aria-label={`Current date ${formatDateDisplay(selectedDate)}. Click to change.`}
          title="Click to select date"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-200/70 transition-colors cursor-pointer group"
        >
          <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm font-bold text-slate-900 tracking-tight font-mono">
            {formatDateDisplay(selectedDate)}
          </span>
          <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Next day"
          title="Next day"
          disabled={isAtMax}
          onClick={handleNextDay}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Native Hidden Date Input */}
        <input
          id="forecast-date-input"
          ref={dateInputRef}
          type="date"
          min={DATE_BOUNDS.min}
          max={DATE_BOUNDS.max}
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="sr-only"
          aria-label="Select date"
        />
      </div>

      {/* Empty state warning when no sample data exists for the selected date */}
      {!hasData && (
        <div
          role="alert"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold animate-fadeIn"
        >
          <svg className="w-3.5 h-3.5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>No data for this date</span>
        </div>
      )}
    </div>
  );
}
