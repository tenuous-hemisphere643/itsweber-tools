import { defineTool } from "../core";

const TO_J: Record<string,number> = {
  "j":1,"kj":1000,"mj":1e6,"gj":1e9,"wh":3600,"kwh":3600000,"mwh":3.6e9,
  "cal":4.184,"kcal":4184,"ev":1.60218e-19,"btu":1055.06,"ft-lb":1.35582,"erg":1e-7,
};

export default defineTool({
  id: "unit-energy",
  title: "Energy Converter",
  titleDe: "Energie-Konverter",
  description: "Convert between J, kJ, Wh, kWh, cal, kcal, BTU, and eV.",
  descriptionDe: "Zwischen J, kJ, Wh, kWh, cal, kcal, BTU und eV konvertieren.",
  explanation: "Enter a value with unit, e.g. '2000 kcal' or '1 kWh'.",
  explanationDe: "Wert mit Einheit eingeben, z.B. '2000 kcal' oder '1 kWh'.",
  category: "Converter",
  keywords: ["energy","energie","kwh","joule","calorie","btu","watt","konvertieren"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "1 kWh",
  example: "2000 kcal",
  useCasesDe: ["Stromverbrauch umrechnen","Kalorien vergleichen","Wärmetechnik"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const m = t.match(/^([\d.,]+)\s*(.+)$/);
    if (!m) throw new Error("Format: '1 kWh' oder '2000 kcal'");
    const val = parseFloat(m[1].replace(",","."));
    const unit = m[2].trim();
    if (!(unit in TO_J)) throw new Error(`Unbekannte Einheit '${unit}'.\nErlaubt: ${Object.keys(TO_J).join(", ")}`);
    const j = val * TO_J[unit];
    const f = (v: number) => v < 0.001 ? v.toExponential(3) : parseFloat(v.toPrecision(5)).toString();
    return { output: [
      `${val} ${unit} =`,``,
      `  J:     ${f(j)}`,
      `  kJ:    ${f(j/1000)}`,
      `  MJ:    ${f(j/1e6)}`,
      `  Wh:    ${f(j/3600)}`,
      `  kWh:   ${f(j/3600000)}`,
      `  MWh:   ${f(j/3.6e9)}`,
      `  cal:   ${f(j/4.184)}`,
      `  kcal:  ${f(j/4184)}`,
      `  BTU:   ${f(j/1055.06)}`,
    ].join("\n") };
  },
});
