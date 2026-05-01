import { defineTool } from "../core";

const FIELD_NAMES = ["Minute", "Hour", "Day of Month", "Month", "Day of Week"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function describeField(expr: string, name: string, min: number, max: number, labels?: string[]): string {
  if (expr === "*") return `${name}: every`;
  if (expr === "?") return `${name}: any`;
  if (expr.includes("/")) {
    const [, step] = expr.split("/");
    return `${name}: every ${step}`;
  }
  if (expr.includes("-")) {
    const [from, to] = expr.split("-").map(Number);
    const fl = labels ? labels[from - min] : from;
    const tl = labels ? labels[to - min] : to;
    return `${name}: ${fl}–${tl}`;
  }
  if (expr.includes(",")) {
    const vals = expr.split(",").map((v) => labels ? labels[Number(v) - min] : v);
    return `${name}: ${vals.join(", ")}`;
  }
  const num = Number(expr);
  const label = labels ? labels[num - min] : num;
  return `${name}: ${label}`;
}

const PRESETS: Record<string, string> = {
  "@yearly":   "0 0 1 1 *",
  "@annually": "0 0 1 1 *",
  "@monthly":  "0 0 1 * *",
  "@weekly":   "0 0 * * 0",
  "@daily":    "0 0 * * *",
  "@midnight": "0 0 * * *",
  "@hourly":   "0 * * * *",
};

export default defineTool({
  id: "cron-parser",
  title: "Cron Expression Parser",
  titleDe: "Cron-Ausdruck Parser",
  description: "Parse and explain cron expressions in plain language.",
  descriptionDe: "Erklärt Cron-Ausdrücke in verständlicher Sprache.",
  explanation: "Parses 5-field cron expressions (minute hour dom month dow) and @presets. Shows what each field means and the next conceptual trigger.",
  explanationDe: "Liest 5-Felder Cron-Ausdrücke (Minute Stunde Tag Monat Wochentag) und @Presets. Erklärt jedes Feld in Klartext.",
  category: "Development",
  keywords: ["cron", "schedule", "cronjob", "zeitplan", "task", "automation", "linux", "docker"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "0 3 * * 1-5",
  example: "0 3 * * 1-5",
  useCasesDe: ["Cron-Jobs dokumentieren", "Backup-Zeitpläne erklären", "Scheduled Tasks prüfen"],
  run: (input) => {
    let expr = input.trim().toLowerCase();
    if (PRESETS[expr]) expr = PRESETS[expr];

    const parts = expr.split(/\s+/);
    if (parts.length !== 5) throw new Error("Enter a 5-field cron expression: minute hour day month weekday. Or use @daily, @hourly, etc.");

    const [min, hr, dom, mon, dow] = parts;
    const descriptions = [
      describeField(min, FIELD_NAMES[0], 0, 59),
      describeField(hr,  FIELD_NAMES[1], 0, 23),
      describeField(dom, FIELD_NAMES[2], 1, 31),
      describeField(mon, FIELD_NAMES[3], 1, 12, MONTHS),
      describeField(dow, FIELD_NAMES[4], 0,  6, DAYS),
    ];

    return {
      output: [
        `Expression: ${expr}`,
        "",
        ...descriptions,
        "",
        "Format: ┌── minute (0–59)",
        "        │ ┌── hour (0–23)",
        "        │ │ ┌── day of month (1–31)",
        "        │ │ │ ┌── month (1–12)",
        "        │ │ │ │ ┌── day of week (0–6, Sun=0)",
        `        ${parts.join(" ")}`,
      ].join("\n"),
    };
  },
});
