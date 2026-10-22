'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DistrictCombinedData, RainfallLayer } from '@/lib/data';
import { getRainfallBracket } from '@/lib/rainfallScale';

interface DistrictTableProps {
  districts: DistrictCombinedData[];
  selectedLayer?: RainfallLayer;
  onSelectDistrict?: (id: string) => void;
  className?: string;
}

type SortField = 'name' | 'raw' | 'corrected' | 'observed' | 'heavyRainProb';
type SortOrder = 'asc' | 'desc';

export default function DistrictTable({
  districts,
  selectedLayer = 'corrected',
  onSelectDistrict,
  className = '',
}: DistrictTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('corrected');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredDistricts = districts.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.state.toLowerCase().includes(q)
    );
  });

  const sortedDistricts = [...filteredDistricts].sort((a, b) => {
    let aVal: number | string = 0;
    let bVal: number | string = 0;

    if (sortField === 'name') {
      aVal = a.name;
      bVal = b.name;
      return sortOrder === 'asc'
        ? (aVal as string).localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal as string);
    } else if (sortField === 'raw') {
      aVal = a.rainfall.raw;
      bVal = b.rainfall.raw;
    } else if (sortField === 'corrected') {
      aVal = a.rainfall.corrected;
      bVal = b.rainfall.corrected;
    } else if (sortField === 'observed') {
      aVal = a.rainfall.observed;
      bVal = b.rainfall.observed;
    } else if (sortField === 'heavyRainProb') {
      aVal = a.rainfall.heavyRainProb;
      bVal = b.rainfall.heavyRainProb;
    }

    return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  return (
    <section
      aria-label="District Rainfall Table"
      className={`flex flex-col bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            District Rainfall Data
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare forecast model outputs and recorded rain gauge observations
          </p>
        </div>

        {/* Search bar */}
        <div className="relative min-w-[240px]">
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search district or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="w-full mt-3 rounded-xl bg-slate-50/70 p-1.5 overflow-x-auto border border-slate-200/60">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead>
            <tr className="bg-slate-200/70 text-slate-700 text-xs font-semibold uppercase tracking-wider">
              <th
                onClick={() => handleSort('name')}
                className="py-2.5 px-3 rounded-l-lg cursor-pointer hover:bg-slate-300/60 select-none"
              >
                District {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="py-2.5 px-3">State</th>
              <th
                onClick={() => handleSort('raw')}
                className={`py-2.5 px-3 cursor-pointer hover:bg-slate-300/60 select-none ${
                  selectedLayer === 'raw' ? 'bg-blue-100 text-blue-900 font-bold' : ''
                }`}
              >
                Raw Model (mm) {sortField === 'raw' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('corrected')}
                className={`py-2.5 px-3 cursor-pointer hover:bg-slate-300/60 select-none ${
                  selectedLayer === 'corrected' ? 'bg-blue-100 text-blue-900 font-bold' : ''
                }`}
              >
                Corrected (mm) {sortField === 'corrected' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('observed')}
                className={`py-2.5 px-3 cursor-pointer hover:bg-slate-300/60 select-none ${
                  selectedLayer === 'observed' ? 'bg-blue-100 text-blue-900 font-bold' : ''
                }`}
              >
                Observed (mm) {sortField === 'observed' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('heavyRainProb')}
                className="py-2.5 px-3 cursor-pointer hover:bg-slate-300/60 select-none"
              >
                Alert Chance {sortField === 'heavyRainProb' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="py-2.5 px-3 rounded-r-lg text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {sortedDistricts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                  No districts match your search.
                </td>
              </tr>
            ) : (
              sortedDistricts.map((item) => {
                const bracket = getRainfallBracket(item.rainfall[selectedLayer]);
                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectDistrict?.(item.id)}
                    className="hover:bg-white transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: bracket.color }}
                        aria-hidden="true"
                      />
                      <span className="group-hover:text-blue-700 transition-colors">
                        {item.name}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 text-xs">
                      {item.state}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700 text-xs">
                      {item.rainfall.raw.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700 text-xs">
                      {item.rainfall.corrected.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700 text-xs">
                      {item.rainfall.observed.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold font-mono inline-block"
                        style={{
                          backgroundColor:
                            item.rainfall.heavyRainProb >= 70
                              ? '#FEE2E2'
                              : item.rainfall.heavyRainProb >= 40
                              ? '#FEF3C7'
                              : '#EFF6FF',
                          color:
                            item.rainfall.heavyRainProb >= 70
                              ? '#B91C1C'
                              : item.rainfall.heavyRainProb >= 40
                              ? '#B45309'
                              : '#1D4ED8',
                        }}
                      >
                        {item.rainfall.heavyRainProb}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        href={`/district/${item.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline"
                      >
                        <span>View</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
