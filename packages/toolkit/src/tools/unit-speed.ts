import { defineTool } from "../core";

const TO_MS: Record<string,number> = {
  "m/s":1,"km/h":1/3.6,"mph":0.44704,"kn":0.514444,"ft/s":0.3048,"mach":343,
};

export default defineTool({
  id: "unit-speed",
  title: "Speed Unit Converter",
  titleDe: "Geschwindigkeiten Konverter",
  description: "Convert between m/s, km/h, mph, knots, ft/s, and Mach.",
  descriptionDe: "Konvertiert zwischen m/s, km/h, mph, Knoten, ft/s und Mach.",
  explanation: "Enter a speed with unit (e.g. '100 km/h' or '60 mph'). Converts to all common speed units.",
  explanationDe: "Geschwindigkeit mit Einheit eingeben (z.B. '100 km/h' oder '60 mph'). Rechnet in alle gängigen Einheiten um.",
  category: "Converter",
  keywords: ["speed","geschwindigkeit","km/h","mph","knots","knoten","mach","m/s","velocity"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "100 km/h  oder  60 mph",
  example: "100 km/h",
  useCasesDe: ["Flugzeug- und Schiffsgeschwindigkeiten","Windstärke umrechnen","Netzwerkgeschwindigkeiten"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const m = t.match(/^([\d.,]+)\s*(.+)$/);
    if (!m) throw new Error("Format: '100 km/h'");
    const val = parseFloat(m[1].replace(",",".")); const unit = m[2].trim();
    if (!(unit in TO_MS)) throw new Error(`Unbekannte Einheit '${unit}'. Erlaubt: ${Object.keys(TO_MS).join(", ")}`);
    const ms = val * TO_MS[unit];
    const fmt = (v: number) => parseFloat(v.toPrecision(5)).toString();
    return { output: [
      `${val} ${unit} =`,``,
      `  m/s:   ${fmt(ms)}`,
      `  km/h:  ${fmt(ms*3.6)}`,
      `  mph:   ${fmt(ms/0.44704)}`,
      `  kn:    ${fmt(ms/0.514444)}`,
      `  ft/s:  ${fmt(ms/0.3048)}`,
      `  Mach:  ${fmt(ms/343)}`,
    ].join("\n") };
  },
});
