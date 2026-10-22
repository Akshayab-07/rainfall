'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DistrictCombinedData, RainfallLayer } from '@/lib/data';
import { getRainfallBracket } from '@/lib/rainfallScale';

interface MapInnerProps {
  districts: DistrictCombinedData[];
  selectedLayer: RainfallLayer;
  selectedDistrictId?: string;
  onSelectDistrict?: (id: string) => void;
}

// Controller component to smoothly center map when selected district changes
function MapRecenter({
  selectedDistrict,
}: {
  selectedDistrict?: DistrictCombinedData;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedDistrict) {
      map.flyTo([selectedDistrict.lat, selectedDistrict.lng], 7, {
        duration: 1.2,
      });
    }
  }, [selectedDistrict, map]);

  return null;
}

// Component to provide quick recenter to all-India bounds
function IndiaRecenterButton() {
  const map = useMap();

  const handleRecenter = (e: React.MouseEvent) => {
    e.stopPropagation();
    map.flyTo([21.8, 82.5], 5, { duration: 1 });
  };

  return (
    <div className="leaflet-bottom leaflet-right" style={{ pointerEvents: 'auto', margin: '12px' }}>
      <div className="leaflet-control flex flex-col gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-xl shadow-md border border-slate-200">
        <button
          type="button"
          onClick={handleRecenter}
          title="Recenter Map to India View"
          aria-label="Recenter map to all India"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-blue-700 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2m10-10h-2M4 12H2m16.24-7.24l-1.42 1.42M7.18 16.82l-1.42 1.42m0-12.24l1.42 1.42m9.64 9.64l1.42 1.42M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function MapInner({
  districts,
  selectedLayer,
  selectedDistrictId,
  onSelectDistrict,
}: MapInnerProps) {
  const activeDistrict = districts.find((d) => d.id === selectedDistrictId);

  // Center coordinate of India
  const indiaCenter: [number, number] = [21.8, 82.5];

  return (
    <div className="relative w-full h-[460px] rounded-xl overflow-hidden shadow-inner border border-slate-200 bg-slate-100 z-0">
      <MapContainer
        center={indiaCenter}
        zoom={5}
        minZoom={4}
        maxZoom={10}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter selectedDistrict={activeDistrict} />
        <IndiaRecenterButton />

        {districts.map((station) => {
          const rainfallVal = station.rainfall[selectedLayer];
          const bracket = getRainfallBracket(rainfallVal);
          const isSelected = station.id === selectedDistrictId;

          return (
            <CircleMarker
              key={station.id}
              center={[station.lat, station.lng]}
              radius={bracket.radius * 1.25}
              pathOptions={{
                fillColor: bracket.color,
                fillOpacity: 0.95,
                color: isSelected ? '#1D4ED8' : '#ffffff',
                weight: isSelected ? 3 : 2,
              }}
              eventHandlers={{
                click: () => onSelectDistrict?.(station.id),
              }}
            >
              <Popup className="sih-custom-popup" closeButton={true}>
                <div className="p-1 min-w-[240px] text-slate-800">
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                          style={{ backgroundColor: bracket.color }}
                        />
                        <h4 className="font-bold text-sm text-slate-900 m-0 leading-tight">
                          {station.name}
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {[station.division, station.state].filter(Boolean).join(' • ')}
                      </span>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight shrink-0"
                      style={{
                        backgroundColor: bracket.badgeBg,
                        color: bracket.badgeText,
                      }}
                    >
                      {bracket.shortLabel}
                    </span>
                  </div>

                  {/* 3-column telemetry strip */}
                  <div className="grid grid-cols-3 gap-1 p-2 bg-slate-50 rounded-lg text-center mb-2.5 border border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase">Corrected</span>
                      <span className="text-xs font-bold text-blue-700 font-mono">
                        {station.rainfall.corrected.toFixed(1)}
                        <span className="text-[9px] font-normal text-slate-400">mm</span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase">Raw</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">
                        {station.rainfall.raw.toFixed(1)}
                        <span className="text-[9px] font-normal text-slate-400">mm</span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase">Observed</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">
                        {station.rainfall.observed.toFixed(1)}
                        <span className="text-[9px] font-normal text-slate-400">mm</span>
                      </span>
                    </div>
                  </div>

                  {/* Probability warning pill */}
                  <div className="flex items-center justify-between px-2 py-1 rounded-md bg-red-50 text-red-800 text-[11px] font-semibold mb-2.5 border border-red-100">
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-red-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>Heavy Rain Prob:</span>
                    </div>
                    <span className="font-bold text-red-700">{station.rainfall.heavyRainProb}%</span>
                  </div>

                  {/* Link to district details page */}
                  <Link
                    href={`/district/${station.id}`}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs no-underline"
                  >
                    <span>View Station Details</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
