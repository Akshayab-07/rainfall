/**
 * TEMPORARY SAMPLE DATA
 * 
 * Note: lib/mockData.ts was missing in the project folder.
 * This temporary sample data conforms strictly to the data shape described in the
 * SIH26080 Frontend Task Guide (Page 1 & Page 2) and visual references from Google Stitch.
 * 
 * Future FastAPI swap can be achieved by updating lib/data.ts without changing components.
 */

export type MonsoonRegime = 'Active' | 'Normal' | 'Break';

export type RainfallLayer = 'raw' | 'corrected' | 'observed';

export interface DistrictInfo {
  id: string;
  name: string;
  state: string;
  division?: string;
  lat: number;
  lng: number;
}

export interface DistrictRainfallData {
  districtId: string;
  raw: number;
  corrected: number;
  observed: number;
  heavyRainProb: number;      // percentage 0-100
  veryHeavyRainProb: number;  // percentage 0-100
}

export interface DailyForecastData {
  date: string; // YYYY-MM-DD format within bounds 2024-06-01 to 2025-09-30
  regime: MonsoonRegime;
  districts: DistrictRainfallData[];
}

export const DISTRICTS: DistrictInfo[] = [
  {
    id: 'cherrapunji',
    name: 'Cherrapunji',
    state: 'Meghalaya',
    division: 'East Khasi Hills',
    lat: 25.2986,
    lng: 91.5822,
  },
  {
    id: 'mumbai',
    name: 'Mumbai Suburban',
    state: 'Maharashtra',
    division: 'Konkan Coast',
    lat: 19.0760,
    lng: 72.8777,
  },
  {
    id: 'wayanad',
    name: 'Wayanad',
    state: 'Kerala',
    division: 'Western Ghats',
    lat: 11.6854,
    lng: 76.1320,
  },
  {
    id: 'dehradun',
    name: 'Dehradun',
    state: 'Uttarakhand',
    division: 'Garhwal Foothills',
    lat: 30.3165,
    lng: 78.0322,
  },
  {
    id: 'patna',
    name: 'Patna',
    state: 'Bihar',
    division: 'Gangetic Plain',
    lat: 25.5941,
    lng: 85.1376,
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    division: 'Desh / Western Ghats',
    lat: 18.5204,
    lng: 73.8567,
  },
  {
    id: 'nagpur',
    name: 'Nagpur',
    state: 'Maharashtra',
    division: 'Vidarbha',
    lat: 21.1458,
    lng: 79.0882,
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    division: 'Eastern Rajasthan',
    lat: 26.9124,
    lng: 75.7873,
  },
];

export const MOCK_FORECASTS: Record<string, DailyForecastData> = {
  '2024-07-15': {
    date: '2024-07-15',
    regime: 'Active',
    districts: [
      {
        districtId: 'cherrapunji',
        raw: 309.0,
        corrected: 285.0,
        observed: 298.4,
        heavyRainProb: 96,
        veryHeavyRainProb: 88,
      },
      {
        districtId: 'mumbai',
        raw: 168.0,
        corrected: 142.4,
        observed: 138.6,
        heavyRainProb: 88,
        veryHeavyRainProb: 65,
      },
      {
        districtId: 'wayanad',
        raw: 145.0,
        corrected: 126.8,
        observed: 121.0,
        heavyRainProb: 82,
        veryHeavyRainProb: 55,
      },
      {
        districtId: 'dehradun',
        raw: 85.5,
        corrected: 94.0,
        observed: 91.2,
        heavyRainProb: 65,
        veryHeavyRainProb: 30,
      },
      {
        districtId: 'patna',
        raw: 70.0,
        corrected: 78.4,
        observed: 74.0,
        heavyRainProb: 58,
        veryHeavyRainProb: 24,
      },
      {
        districtId: 'pune',
        raw: 52.0,
        corrected: 48.2,
        observed: 45.0,
        heavyRainProb: 35,
        veryHeavyRainProb: 12,
      },
      {
        districtId: 'nagpur',
        raw: 15.0,
        corrected: 18.5,
        observed: 17.0,
        heavyRainProb: 15,
        veryHeavyRainProb: 4,
      },
      {
        districtId: 'jaipur',
        raw: 1.5,
        corrected: 2.1,
        observed: 1.8,
        heavyRainProb: 5,
        veryHeavyRainProb: 1,
      },
    ],
  },
  '2024-07-16': {
    date: '2024-07-16',
    regime: 'Normal',
    districts: [
      {
        districtId: 'cherrapunji',
        raw: 120.0,
        corrected: 110.0,
        observed: 105.0,
        heavyRainProb: 75,
        veryHeavyRainProb: 40,
      },
      {
        districtId: 'mumbai',
        raw: 75.0,
        corrected: 68.0,
        observed: 65.0,
        heavyRainProb: 60,
        veryHeavyRainProb: 25,
      },
      {
        districtId: 'wayanad',
        raw: 80.0,
        corrected: 72.0,
        observed: 70.0,
        heavyRainProb: 62,
        veryHeavyRainProb: 28,
      },
      {
        districtId: 'dehradun',
        raw: 45.0,
        corrected: 40.0,
        observed: 42.0,
        heavyRainProb: 30,
        veryHeavyRainProb: 10,
      },
      {
        districtId: 'patna',
        raw: 35.0,
        corrected: 32.0,
        observed: 30.0,
        heavyRainProb: 25,
        veryHeavyRainProb: 8,
      },
      {
        districtId: 'pune',
        raw: 28.0,
        corrected: 24.0,
        observed: 22.0,
        heavyRainProb: 18,
        veryHeavyRainProb: 5,
      },
      {
        districtId: 'nagpur',
        raw: 12.0,
        corrected: 10.0,
        observed: 11.0,
        heavyRainProb: 10,
        veryHeavyRainProb: 2,
      },
      {
        districtId: 'jaipur',
        raw: 0.5,
        corrected: 1.0,
        observed: 0.8,
        heavyRainProb: 2,
        veryHeavyRainProb: 0,
      },
    ],
  },
  '2024-07-17': {
    date: '2024-07-17',
    regime: 'Break',
    districts: [
      {
        districtId: 'cherrapunji',
        raw: 60.0,
        corrected: 55.0,
        observed: 52.0,
        heavyRainProb: 45,
        veryHeavyRainProb: 15,
      },
      {
        districtId: 'mumbai',
        raw: 15.0,
        corrected: 12.0,
        observed: 10.0,
        heavyRainProb: 10,
        veryHeavyRainProb: 2,
      },
      {
        districtId: 'wayanad',
        raw: 25.0,
        corrected: 20.0,
        observed: 18.0,
        heavyRainProb: 15,
        veryHeavyRainProb: 3,
      },
      {
        districtId: 'dehradun',
        raw: 18.0,
        corrected: 14.0,
        observed: 15.0,
        heavyRainProb: 12,
        veryHeavyRainProb: 2,
      },
      {
        districtId: 'patna',
        raw: 10.0,
        corrected: 8.0,
        observed: 7.0,
        heavyRainProb: 8,
        veryHeavyRainProb: 1,
      },
      {
        districtId: 'pune',
        raw: 5.0,
        corrected: 4.0,
        observed: 3.5,
        heavyRainProb: 4,
        veryHeavyRainProb: 0,
      },
      {
        districtId: 'nagpur',
        raw: 2.0,
        corrected: 1.5,
        observed: 1.0,
        heavyRainProb: 2,
        veryHeavyRainProb: 0,
      },
      {
        districtId: 'jaipur',
        raw: 0.0,
        corrected: 0.0,
        observed: 0.0,
        heavyRainProb: 0,
        veryHeavyRainProb: 0,
      },
    ],
  },
};
