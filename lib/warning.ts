import type { Warning } from "./types";

// IMD thresholds (24 h): heavy 64.5, very heavy 115.6, extremely heavy 204.5
export function warningFor(mm: number | null): Warning {
  if (mm === null) return "green";
  if (mm >= 204.5) return "red";
  if (mm >= 115.6) return "orange";
  if (mm >= 64.5) return "yellow";
  return "green";
}

export const WARNING_COLORS: Record<Warning, string> = {
  green: "#22c55e",
  yellow: "#facc15",
  orange: "#f97316",
  red: "#ef4444",
};

export const WARNING_LABELS: Record<Warning, string> = {
  green: "No warning",
  yellow: "Heavy (64.5 mm or more)",
  orange: "Very heavy (115.6 mm or more)",
  red: "Extremely heavy (204.5 mm or more)",
};
