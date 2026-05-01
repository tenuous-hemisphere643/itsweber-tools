import { defineTool } from "../core";

const ZONES = [
  ["UTC","UTC"],
  ["Europe/Berlin","Berlin"],
  ["Europe/London","London"],
  ["Europe/Paris","Paris"],
  ["America/New_York","New York"],
  ["America/Chicago","Chicago"],
  ["America/Denver","Denver"],
  ["America/Los_Angeles","Los Angeles"],
  ["America/Sao_Paulo","São Paulo"],
  ["Asia/Dubai","Dubai"],
  ["Asia/Kolkata","Kolkata"],
  ["Asia/Bangkok","Bangkok"],
  ["Asia/Shanghai","Shanghai"],
  ["Asia/Tokyo","Tokyo"],
  ["Australia/Sydney","Sydney"],
  ["Pacific/Auckland","Auckland"],
];

export default defineTool({
  id: "time-zones",
  title: "World Time Zones",
  titleDe: "Weltzeit-Zeitzonen",
  description: "Show current time across major world cities, or convert a time from one zone to another.",
  descriptionDe: "Aktuelle Uhrzeit in wichtigen Weltstädten anzeigen oder eine Uhrzeit zwischen Zeitzonen umrechnen.",
  explanation: "Leave blank for current time in all zones. Or enter: Berlin to Tokyo at 14:30",
  explanationDe: "Leer lassen für aktuelle Uhrzeit in allen Zeitzonen. Oder eingeben: Berlin to Tokyo at 14:30",
  category: "Converter",
  keywords: ["timezone","zeitzone","world","uhrzeit","time","convert","berlin","tokyo","utc","dst"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "",
  example: "Berlin to Tokyo at 14:30",
  useCasesDe: ["Meeting-Zeiten abstimmen","Deployments planen","Internationales Team koordinieren"],
  run: (input) => {
    const t = input.trim();
    const findZone = (name: string): string | undefined => {
      const n = name.toLowerCase();
      return ZONES.find(([z,label])=>label.toLowerCase().includes(n)||z.toLowerCase().includes(n))?.[0];
    };
    if (!t) {
      const now = new Date();
      const lines = ZONES.map(([tz,label]) => {
        try {
          const s = now.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit",timeZone:tz});
          const d = now.toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"short",timeZone:tz});
          return `${label.padEnd(15)}  ${s}  ${d}`;
        } catch { return `${label.padEnd(15)}  (Fehler)`; }
      });
      return { output: lines.join("\n") };
    }
    const m = t.match(/^(.+?)\s+to\s+(.+?)\s+at\s+(\d{1,2}):(\d{2})$/i);
    if (!m) throw new Error("Format: Berlin to Tokyo at 14:30  –  oder leer für aktuelle Zeiten");
    const fromZone = findZone(m[1].trim());
    const toZone = findZone(m[2].trim());
    if (!fromZone) throw new Error(`Unbekannte Zeitzone '${m[1]}'. Verfügbar: ${ZONES.map(([,l])=>l).join(", ")}`);
    if (!toZone) throw new Error(`Unbekannte Zeitzone '${m[2]}'. Verfügbar: ${ZONES.map(([,l])=>l).join(", ")}`);
    const now = new Date();
    now.setHours(parseInt(m[3]),parseInt(m[4]),0,0);
    const toTime = now.toLocaleString("de-DE",{timeZone:toZone,hour:"2-digit",minute:"2-digit"});
    const toDate = now.toLocaleDateString("de-DE",{weekday:"long",timeZone:toZone});
    return { output: `${m[3]}:${m[4]} in ${m[1].trim()}  →  ${toTime} in ${m[2].trim()} (${toDate})` };
  },
});
