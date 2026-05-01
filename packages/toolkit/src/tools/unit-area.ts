import { defineTool } from "../core";

const TO_SQM: Record<string,number> = {
  "mm²":1e-6,"cm²":1e-4,"dm²":0.01,"m²":1,"km²":1e6,
  "mm2":1e-6,"cm2":1e-4,"dm2":0.01,"m2":1,"km2":1e6,
  "in²":6.4516e-4,"ft²":0.092903,"yd²":0.836127,"ac":4046.86,"mi²":2.58999e6,
  "in2":6.4516e-4,"ft2":0.092903,"yd2":0.836127,"acre":4046.86,"acres":4046.86,
  "ha":10000,"hektar":10000,
};

export default defineTool({
  id: "unit-area",
  title: "Area Converter",
  titleDe: "Flächen-Konverter",
  description: "Convert between mm², cm², m², km², hectares, acres, ft², and more.",
  descriptionDe: "Zwischen mm², cm², m², km², Hektar, Acres, ft² und weiteren Flächenmaßen konvertieren.",
  explanation: "Enter a value with unit, e.g. '1 ha' or '500 ft²'.",
  explanationDe: "Wert mit Einheit eingeben, z.B. '1 ha' oder '500 ft²'.",
  category: "Converter",
  keywords: ["area","fläche","m2","ha","hektar","acre","ft2","km2","quadrat","convert"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "1 ha",
  example: "5000 m²",
  useCasesDe: ["Grundstücksgrößen umrechnen","Baupläne skalieren","Grünflächen berechnen"],
  run: (input) => {
    const t = input.trim();
    const m = t.match(/^([\d.,]+)\s*(.+)$/);
    if (!m) throw new Error("Format: '1 ha' oder '500 m²'");
    const val = parseFloat(m[1].replace(",","."));
    const unit = m[2].trim().replace(/\s/g,"");
    if (!(unit in TO_SQM)) throw new Error(`Unbekannte Einheit '${unit}'.\nErlaubt: ${Object.keys(TO_SQM).filter(k=>!k.endsWith("2")).join(", ")}`);
    const sqm = val * TO_SQM[unit];
    const f = (v: number) => v < 0.001 ? v.toExponential(3) : parseFloat(v.toPrecision(5)).toString();
    return { output: [
      `${val} ${unit} =`,``,
      `  mm²:   ${f(sqm*1e6)}`,
      `  cm²:   ${f(sqm*1e4)}`,
      `  m²:    ${f(sqm)}`,
      `  km²:   ${f(sqm*1e-6)}`,
      `  ha:    ${f(sqm/10000)}`,
      `  ft²:   ${f(sqm/0.092903)}`,
      `  yd²:   ${f(sqm/0.836127)}`,
      `  acres: ${f(sqm/4046.86)}`,
    ].join("\n") };
  },
});
