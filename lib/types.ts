export type Warning = "green" | "yellow" | "orange" | "red";
export type Regime = "active" | "normal" | "break";

export interface DistrictInfo {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  loc_class: string;
}

export interface DayDistrict {
  id: string;
  raw_mm: number | null;
  corrected_mm: number | null;
  observed_mm: number | null;
  prob: { heavy: number | null; very_heavy: number | null };
  warning: Warning;
}

export interface DayData {
  regime: Regime;
  districts: DayDistrict[];
}

// what the API gives the map and the table
export type DistrictRow = DistrictInfo & DayDistrict;

export interface Series {
  dates: string[];
  raw: (number | null)[];
  corrected: (number | null)[];
  observed: (number | null)[];
  regime: Regime[];
}
