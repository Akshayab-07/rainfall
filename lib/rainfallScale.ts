/**
 * Rainfall Scale & Classification
 * 
 * Shared source of truth for Legend.tsx and MapView.tsx marker colors and radii.
 * Values and colors adhere strictly to IMD thresholds and Google Stitch DESIGN.md / code.html tokens.
 */

export interface RainfallBracket {
  id: string;
  label: string;
  shortLabel: string;
  min: number; // inclusive lower bound
  max: number; // upper bound (exclusive except for top bracket)
  color: string;
  textColor: string;
  badgeBg: string;
  badgeText: string;
  radius: number; // in pixels
  rangeText: string;
}

export const RAINFALL_SCALE: RainfallBracket[] = [
  {
    id: 'very-light',
    label: 'Very Light',
    shortLabel: 'Very Light',
    min: 0,
    max: 2.5,
    color: '#BAE6FD',
    textColor: '#0369A1',
    badgeBg: '#E0F2FE',
    badgeText: '#0369A1',
    radius: 6,
    rangeText: '0 – 2.5 mm',
  },
  {
    id: 'light',
    label: 'Light',
    shortLabel: 'Light',
    min: 2.5,
    max: 15.5,
    color: '#38BDF8',
    textColor: '#0C4A6E',
    badgeBg: '#E0F2FE',
    badgeText: '#0C4A6E',
    radius: 8,
    rangeText: '2.5 – 15.5 mm',
  },
  {
    id: 'moderate',
    label: 'Moderate',
    shortLabel: 'Moderate',
    min: 15.5,
    max: 64.5,
    color: '#2563EB',
    textColor: '#FFFFFF',
    badgeBg: '#EFF6FF',
    badgeText: '#1D4ED8',
    radius: 10,
    rangeText: '15.5 – 64.5 mm',
  },
  {
    id: 'heavy',
    label: 'Heavy',
    shortLabel: 'Heavy',
    min: 64.5,
    max: 115.5,
    color: '#F59E0B',
    textColor: '#FFFFFF',
    badgeBg: '#FEF3C7',
    badgeText: '#B45309',
    radius: 12,
    rangeText: '64.5 – 115.5 mm',
  },
  {
    id: 'very-heavy',
    label: 'Very Heavy',
    shortLabel: 'Very Heavy',
    min: 115.5,
    max: 204.5,
    color: '#EA580C',
    textColor: '#FFFFFF',
    badgeBg: '#FFEDD5',
    badgeText: '#C2410C',
    radius: 14,
    rangeText: '115.5 – 204.5 mm',
  },
  {
    id: 'extremely-heavy',
    label: 'Extremely Heavy',
    shortLabel: 'Extrem. Heavy',
    min: 204.5,
    max: Infinity,
    color: '#7E22CE',
    textColor: '#FFFFFF',
    badgeBg: '#F3E8FF',
    badgeText: '#6B21A8',
    radius: 16,
    rangeText: '> 204.5 mm',
  },
];

/**
 * Returns the matching rainfall bracket for a given rainfall amount in mm/day.
 */
export function getRainfallBracket(mm: number): RainfallBracket {
  const value = Math.max(0, mm);
  for (let i = RAINFALL_SCALE.length - 1; i >= 0; i--) {
    if (value >= RAINFALL_SCALE[i].min) {
      return RAINFALL_SCALE[i];
    }
  }
  return RAINFALL_SCALE[0];
}
