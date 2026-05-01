import { defineTool } from "../core";

const TO_M: Record<string,number> = {
  mm:0.001,cm:0.01,dm:0.1,m:1,km:1000,
  inch:0.0254,in:0.0254,ft:0.3048,yd:0.9144,mi:1609.344,nmi:1852,
  ly:9.461e15,au:1.496e11,
};

export default defineTool({
  id: "unit-length",
  title: "Length Unit Converter",
  titleDe: "Längeneinheiten-Konverter",
  description: "Convert between metric and imperial length units.",
  descriptionDe: "Konvertiert zwischen metrischen und imperialen Längeneinheiten.",
  explanation: "Enter a value with unit (e.g. '5 ft' or '1.8 m'). Converts to all common length units.",
  explanationDe: "Wert mit Einheit eingeben (z.B. '5 ft' oder '1.8 m'). Rechnet in alle gängigen Längeneinheiten um.",
  category: "Converter",
  keywords: ["length","länge","meter","feet","inch","km","miles","meilen","unit","einheit","convert"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "5 ft  oder  1.80 m",
  example: "6 ft",
  useCasesDe: ["Maße für internationale Dokumente","Rack-Einheiten und Kabellängen","Sport und Fitness"],
  run: (input) => {
    const m = input.trim().match(/^([\d.,]+)\s*([a-zA-Z]+)$/);
    if (!m) throw new Error("Format: '5 ft' oder '1.80 m'");
    const val = parseFloat(m[1].replace(",","."));
    const unit = m[2].toLowerCase();
    if (!(unit in TO_M)) throw new Error(`Unbekannte Einheit '${m[2]}'. Erlaubt: ${Object.keys(TO_M).join(", ")}`);
    const meters = val * TO_M[unit];
    const fmt = (v: number) => v < 0.001 ? v.toExponential(4) : v.toPrecision(6).replace(/\.?0+$/,"");
    return { output: [
      `${val} ${unit} =`,
      ``,
      `  mm:   ${fmt(meters/0.001)}`,
      `  cm:   ${fmt(meters/0.01)}`,
      `  m:    ${fmt(meters)}`,
      `  km:   ${fmt(meters/1000)}`,
      `  in:   ${fmt(meters/0.0254)}`,
      `  ft:   ${fmt(meters/0.3048)}`,
      `  yd:   ${fmt(meters/0.9144)}`,
      `  mi:   ${fmt(meters/1609.344)}`,
      `  nmi:  ${fmt(meters/1852)}`,
    ].join("\n") };
  },
});
