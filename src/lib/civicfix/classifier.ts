import type { Category, Severity } from "./types";

export type Analysis = {
  category: Category;
  severity: Severity;
  severityScore: number;
  confidence: number;
  signals: string[];
};

type Rule = { category: Category; keywords: string[] };

const categoryRules: Rule[] = [
  { category: "Road Maintenance", keywords: ["pothole", "road", "street", "pavement", "sidewalk", "traffic light", "crack"] },
  { category: "Sanitation", keywords: ["garbage", "trash", "waste", "dumpster", "litter", "sewage", "dumped"] },
  { category: "Water Supply", keywords: ["water", "leak", "flood", "drain", "pipe", "sewer", "hydrant"] },
  { category: "Electricity/Streetlight", keywords: ["streetlight", "street lamp", "electric", "power", "lamp", "wire", "outage"] },
  { category: "Public Safety", keywords: ["accident", "fire", "crime", "danger", "unsafe", "violence", "open manhole"] },
];

const severityRules: { severity: Severity; score: number; keywords: string[] }[] = [
  { severity: "Critical", score: 95, keywords: ["fire", "life threatening", "collapsed", "major accident", "violence", "open manhole"] },
  { severity: "High", score: 78, keywords: ["accident", "flooding", "danger", "unsafe", "outage", "blocked road", "injury"] },
  { severity: "Low", score: 25, keywords: ["minor crack", "small litter", "cosmetic", "faded", "minor"] },
];

export function analyzeIssue(description: string): Analysis {
  const text = description.trim().toLowerCase();
  const categoryMatches = categoryRules
    .map((rule) => ({ ...rule, matches: rule.keywords.filter((keyword) => text.includes(keyword)) }))
    .filter((rule) => rule.matches.length > 0)
    .sort((a, b) => b.matches.length - a.matches.length);
  const category = categoryMatches[0]?.category ?? "Other";
  const signals = [...(categoryMatches[0]?.matches ?? [])];
  const severityMatch = severityRules.find((rule) => rule.keywords.some((keyword) => text.includes(keyword)));
  const severity = severityMatch?.severity ?? "Medium";
  const severityScore = severityMatch?.score ?? (category === "Other" ? 45 : 55);
  const confidence = Math.min(0.98, 0.55 + signals.length * 0.12 + (severityMatch ? 0.1 : 0));
  return { category, severity, severityScore, confidence: Number(confidence.toFixed(2)), signals };
}
