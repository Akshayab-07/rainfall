/**
 * Design Tokens & Theme Configuration
 * Extracted from Google Stitch DESIGN.md for SIH26080 "Rainfall Forecast Visualization".
 * Reusable across Person A and Person B components.
 */

export const THEME = {
  colors: {
    // Canvas & Structurals
    canvasBase: '#F5F8FB',
    surface: '#FFFFFF',
    surfaceDim: '#D7DADD',
    surfaceContainerLow: '#F1F4F7',
    surfaceContainer: '#EBEEF1',
    surfaceContainerHigh: '#E5E8EB',
    surfaceContainerHighest: '#E0E3E6',
    borderDefault: '#E2E8F0',
    borderStrong: '#CBD5E1',

    // Typography
    textPrimary: '#0F172A',
    textSecondary: '#334155',
    textMuted: '#64748B',

    // Primary Brand & Action
    primary: '#0037B0',
    primaryContainer: '#1D4ED8',
    primaryHover: '#1E40AF',
    primarySelected: '#EFF6FF',
    onPrimary: '#FFFFFF',

    // Monsoon Synoptic Regime Badges
    regimes: {
      Active: {
        fill: '#059669',
        container: '#ECFDF5',
        stroke: '#047857',
        text: '#047857',
        label: 'Active',
      },
      Normal: {
        fill: '#2563EB',
        container: '#EFF6FF',
        stroke: '#1D4ED8',
        text: '#1D4ED8',
        label: 'Normal',
      },
      Break: {
        fill: '#D97706',
        container: '#FFFBEB',
        stroke: '#B45309',
        text: '#B45309',
        label: 'Break',
      },
    },

    // Rainfall Brackets
    rainfall: {
      veryLight: '#BAE6FD',
      light: '#38BDF8',
      moderate: '#2563EB',
      heavy: '#F59E0B',
      veryHeavy: '#EA580C',
      extremelyHeavy: '#7E22CE',
    },
  },
  borderRadius: {
    sm: '0.25rem', // 4px
    DEFAULT: '0.5rem', // 8px
    md: '0.75rem', // 12px
    lg: '1rem', // 16px
    full: '9999px',
  },
} as const;
