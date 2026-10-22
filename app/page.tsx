'use client';

import React, { useState } from 'react';
import DatePicker from '@/components/DatePicker';
import LayerToggle from '@/components/LayerToggle';
import RegimeBadge from '@/components/RegimeBadge';
import MapView from '@/components/MapView';
import Legend from '@/components/Legend';
import DistrictCard from '@/components/DistrictCard';
import DistrictTable from '@/components/DistrictTable';
import {
  DATE_BOUNDS,
  RainfallLayer,
  getDailyForecast,
  getCombinedDistrictData,
} from '@/lib/data';

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<string>(DATE_BOUNDS.defaultDate);
  const [selectedLayer, setSelectedLayer] = useState<RainfallLayer>('corrected');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | undefined>('mumbai');

  // Read data via lib/data.ts wrapper
  const dailyForecast = getDailyForecast(selectedDate);
  const combinedDistricts = getCombinedDistrictData(selectedDate);
  const hasData = dailyForecast !== null && combinedDistricts.length > 0;

  // Layer display names
  const layerLabels: Record<RainfallLayer, string> = {
    raw: 'Raw',
    corrected: 'Corrected',
    observed: 'Observed',
  };

  // Top summary districts for priority cards (highest rainfall first)
  const topSummaryDistricts = [...combinedDistricts]
    .sort((a, b) => b.rainfall[selectedLayer] - a.rainfall[selectedLayer])
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F5F8FB] text-slate-800 flex flex-col antialiased">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-xs shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight truncate">
                  Rainfall Forecast
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium truncate">
                Precipitation Analysis &amp; Monsoon Monitoring
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              {combinedDistricts.length} Stations Monitored
            </span>
          </div>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">
        {/* Controls Toolbar: Date Picker, Layer Switcher, and Regime Badge */}
        <section
          aria-label="Dashboard Controls"
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          {/* Left: Date Selection */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Date
            </span>
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={(newDate) => setSelectedDate(newDate)}
              hasData={hasData}
            />
          </div>

          {/* Center: Layer Switcher */}
          <div className="w-full md:w-auto md:min-w-[340px]">
            <LayerToggle
              selectedLayer={selectedLayer}
              onLayerChange={(layer) => setSelectedLayer(layer)}
            />
          </div>

          {/* Right: Monsoon Regime Status */}
          <div className="flex flex-col gap-1 self-start md:self-auto">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Monsoon Status
            </span>
            <RegimeBadge regime={dailyForecast?.regime ?? 'Normal'} />
          </div>
        </section>

        {/* Interactive Map View */}
        <section aria-label="Rainfall Map">
          <MapView
            districts={combinedDistricts}
            selectedLayer={selectedLayer}
            selectedDistrictId={selectedDistrictId}
            onSelectDistrict={(id) => setSelectedDistrictId(id)}
          />
        </section>

        {/* Classification Legend */}
        <section aria-label="Rainfall Scale Legend">
          <Legend />
        </section>

        {/* Priority District Cards */}
        <section aria-label="Highest Rainfall Stations" className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Highest Rainfall Stations
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Showing top active stations ({layerLabels[selectedLayer]} view)
            </span>
          </div>

          {topSummaryDistricts.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
              No station data available for this date.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {topSummaryDistricts.map((item) => (
                <DistrictCard
                  key={item.id}
                  name={item.name}
                  rainfall={item.rainfall[selectedLayer]}
                  layerLabel={layerLabels[selectedLayer]}
                  state={item.state}
                  division={item.division}
                  biasAdjustment={item.rainfall.corrected - item.rainfall.raw}
                  onClick={() => setSelectedDistrictId(item.id)}
                  className={selectedDistrictId === item.id ? 'ring-2 ring-blue-600' : ''}
                />
              ))}
            </div>
          )}
        </section>

        {/* Complete District Table */}
        <section aria-label="All Stations Table">
          <DistrictTable
            districts={combinedDistricts}
            selectedLayer={selectedLayer}
            onSelectDistrict={(id) => setSelectedDistrictId(id)}
          />
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Rainfall Forecast &amp; Precision Precipitation Monitoring</span>
          <span>Updated Daily • Meteorological Data Integration</span>
        </div>
      </footer>
    </div>
  );
}
