import { defineTool } from "../core";

export default defineTool({
  id: "date-calc",
  title: "Date Calculator",
  titleDe: "Datum-Rechner",
  description: "Calculate date differences, add/subtract days, find weekdays, and week numbers.",
  descriptionDe: "Datumsdifferenzen berechnen, Tage addieren/subtrahieren, Wochentage und Kalenderwochen ermitteln.",
  explanation: "Commands: diff <date1> <date2> | add <date> +/-N days | info <date> | today",
  explanationDe: "Befehle: diff <Datum1> <Datum2> | add <Datum> +/-N Tage | info <Datum> | today",
  category: "Converter",
  keywords: ["date","datum","calendar","kalender","days","tage","diff","add","weekday","wochentag","kw"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "diff 2024-01-01 2024-12-31",
  example: "add 2026-04-30 +90",
  useCasesDe: ["Projektlaufzeiten berechnen","Deadlines planen","Wochentag bestimmen"],
  run: (input) => {
    const t = input.trim();
    const DAYS = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
    const MONTHS = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
    const getWeek = (d: Date): number => {
      const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay()||7));
      const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(),0,1));
      return Math.ceil((((tmp.getTime()-yearStart.getTime())/86400000)+1)/7);
    };
    const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")} (${DAYS[d.getDay()]}, KW${getWeek(d)})`;
    if (t.toLowerCase()==="today") {
      const d = new Date();
      return { output: fmt(d) };
    }
    const m1 = t.match(/^diff\s+(\S+)\s+(\S+)$/i);
    if (m1) {
      const d1 = new Date(m1[1]); const d2 = new Date(m1[2]);
      if (isNaN(d1.getTime())||isNaN(d2.getTime())) throw new Error("Ungültiges Datum (ISO: YYYY-MM-DD)");
      const ms = Math.abs(d2.getTime()-d1.getTime());
      const days = Math.floor(ms/86400000);
      return { output: [
        `Von: ${fmt(d1)}`,
        `Bis: ${fmt(d2)}`,``,
        `Differenz: ${days} Tage`,
        `  = ${Math.floor(days/7)} Wochen, ${days%7} Tage`,
        `  ≈ ${(days/30.437).toFixed(1)} Monate`,
        `  ≈ ${(days/365.25).toFixed(2)} Jahre`,
      ].join("\n") };
    }
    const m2 = t.match(/^add\s+(\S+)\s+([+-]?\d+)/i);
    if (m2) {
      const d = new Date(m2[1]);
      if (isNaN(d.getTime())) throw new Error("Ungültiges Datum");
      d.setDate(d.getDate()+parseInt(m2[2]));
      return { output: `Ergebnis: ${fmt(d)}` };
    }
    const m3 = t.match(/^info\s+(\S+)$/i);
    const dateStr = m3?.[1] || t;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) throw new Error("Format: diff YYYY-MM-DD YYYY-MM-DD | add YYYY-MM-DD +N | info YYYY-MM-DD | today");
    const isLeap = (d.getFullYear()%4===0&&d.getFullYear()%100!==0)||d.getFullYear()%400===0;
    const dayOfYear = Math.floor((d.getTime()-new Date(d.getFullYear(),0,0).getTime())/86400000);
    return { output: [
      `Datum:     ${fmt(d)}`,
      `Tag im Jahr: ${dayOfYear}/365`,
      `Quartal:   Q${Math.ceil((d.getMonth()+1)/3)}`,
      `Schaltjahr: ${isLeap?"Ja":"Nein"}`,
      `Monat:     ${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
    ].join("\n") };
  },
});
