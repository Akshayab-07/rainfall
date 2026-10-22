/**
 * Data Access Layer (Wrapper)
 * 
 * Single point of access for all forecasting, telemetry, and district data.
 * Reads seamlessly from official datasets (data/districts.json, data/forecast_by_date.json)
 * and falls back to mockData when needed.
 * 
 * When swapping to a live FastAPI backend in the future, only this file needs to be updated.
 */

import districtsJson from '@/data/districts.json';
import forecastByDateJson from '@/data/forecast_by_date.json';
import {
  MOCK_FORECASTS,
  type DailyForecastData,
  type DistrictInfo,
  type DistrictRainfallData,
  type MonsoonRegime,
  type RainfallLayer,
} from './mockData';

export type {
  DailyForecastData,
  DistrictInfo,
  DistrictRainfallData,
  MonsoonRegime,
  RainfallLayer,
};

export interface DistrictCombinedData extends DistrictInfo {
  rainfall: DistrictRainfallData;
}

export const DATE_BOUNDS = {
  min: '2024-06-01',
  max: '2025-09-30',
  defaultDate: '2024-07-15',
};

interface RawDistrictJson {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon?: number;
  lng?: number;
  loc_class?: string;
}

interface RawDayForecastJson {
  regime: string;
  districts: {
    id: string;
    raw_mm: number | null;
    corrected_mm: number | null;
    observed_mm: number | null;
    prob?: { heavy: number | null; very_heavy: number | null };
    warning?: string;
  }[];
}

const typedDistrictsJson = districtsJson as RawDistrictJson[];
const typedForecastJson = forecastByDateJson as Record<string, RawDayForecastJson>;

/**
 * Returns all registered districts/places.
 */
export function getAllDistricts(): DistrictInfo[] {
  return typedDistrictsJson.map((d) => ({
    id: d.id,
    name: d.name,
    state: d.state,
    division: d.loc_class ? `${d.loc_class.toUpperCase()} Region` : undefined,
    lat: d.lat,
    lng: d.lon ?? d.lng ?? 0,
  }));
}

/**
 * Returns info for a specific district.
 */
export function getDistrictById(id: string): DistrictInfo | undefined {
  return getAllDistricts().find((d) => d.id === id);
}

/**
 * Normalizes regime string into 'Active' | 'Normal' | 'Break'
 */
function normalizeRegime(regimeStr: string): MonsoonRegime {
  const lower = regimeStr.toLowerCase();
  if (lower === 'active') return 'Active';
  if (lower === 'break') return 'Break';
  return 'Normal';
}

/**
 * Get daily forecast metadata and all district records for a specific date.
 * Returns null if no data is available for that date.
 */
export function getDailyForecast(date: string): DailyForecastData | null {
  // Check official dataset first
  const dayRecord = typedForecastJson[date];
  if (dayRecord) {
    return {
      date,
      regime: normalizeRegime(dayRecord.regime),
      districts: dayRecord.districts.map((d) => {
        const raw = d.raw_mm ?? 0;
        const corrected = d.corrected_mm ?? 0;
        const observed = d.observed_mm ?? 0;
        const heavyProb = Math.round((d.prob?.heavy ?? 0) * 100);
        const veryHeavyProb = Math.round((d.prob?.very_heavy ?? 0) * 100);

        return {
          districtId: d.id,
          raw,
          corrected,
          observed,
          heavyRainProb: heavyProb,
          veryHeavyRainProb: veryHeavyProb,
        };
      }),
    };
  }

  // Fallback to sample mockData if present
  return MOCK_FORECASTS[date] || null;
}

/**
 * Returns merged district metadata and rainfall values for a selected date.
 * If no data exists for the date, returns empty array.
 */
export function getCombinedDistrictData(date: string): DistrictCombinedData[] {
  const forecast = getDailyForecast(date);
  if (!forecast) return [];

  const districtsMap = new Map(getAllDistricts().map((d) => [d.id, d]));

  return forecast.districts
    .map((rainfallItem) => {
      const info = districtsMap.get(rainfallItem.districtId);
      if (!info) return null;
      return {
        ...info,
        rainfall: rainfallItem,
      };
    })
    .filter((item): item is DistrictCombinedData => item !== null);
}
