import outlookRaw from "@/data/outlook_by_issue.json";
import skillRaw from "@/data/lead_skill.json";
import districtsRaw from "@/data/districts.json";
import type { DistrictInfo, Regime, Warning } from "./types";

// one forecast "issue day": 8 forecast days (Day 0 to Day 7) for each place
export interface OutlookDistrict {
  raw: (number | null)[];
  corrected: (number | null)[];
  observed: (number | null)[];
  p_heavy: (number | null)[];
  p_very: (number | null)[];
  warning: (Warning | null)[];
}
export interface OutlookIssue {
  dates: string[];
  regime: (Regime | null)[];
  districts: Record<string, OutlookDistrict>;
}
interface MethodScores {
  rmse: number | null;
  ets_15_6: number | null;
  ets_64_5: number | null;
  pod_64_5: number | null;
  far_64_5: number | null;
}
export interface LeadSkill {
  raw: MethodScores;
  qm: MethodScores;
  ml: MethodScores;
  hybrid: MethodScores;
  brier_skill_heavy: number | null;
  heavy_events: number;
  confidence: "higher" | "moderate" | "low";
}
export interface SkillFile {
  note: string;
  confidence_rule: string;
  by_lead: Record<string, LeadSkill>;
}

export const OUTLOOK = outlookRaw as unknown as Record<string, OutlookIssue>;
export const SKILL = skillRaw as unknown as SkillFile;
export const PLACES = districtsRaw as DistrictInfo[];
export const ISSUE_DATES = Object.keys(OUTLOOK).sort();
