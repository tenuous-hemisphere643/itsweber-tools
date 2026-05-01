import { defineTool } from "../core";

const TO_KG: Record<string,number> = {
  mg:1e-6,g:0.001,kg:1,t:1000,
  oz:0.0283495,lb:0.453592,st:6.35029,
};

export default defineTool({
  id: "unit-weight",
  title: "Weight / Mass Converter",
  titleDe: "Gewicht / Masse Konverter",
  description: "Convert between metric and imperial weight units.",
  descriptionDe: "Konvertiert zwischen metrischen und imperialen Gewichtseinheiten.",
  explanation: "Enter a value with unit (e.g. '10 kg' or '22 lb'). Converts to all common weight/mass units.",
  explanationDe: "Wert mit Einheit eingeben (z.B. '10 kg' oder '22 lb'). Rechnet in alle gängigen Gewichtseinheiten um.",
  category: "Converter",
  keywords: ["weight","mass","gewicht","masse","kg","lb","pounds","gram","ounce","ton","einheit"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "10 kg  oder  22 lb",
  example: "75 kg",
  useCasesDe: ["Gewichte für internationale Versanddokumente","Serverhardware-Gewichte","Ernährung und Fitness"],
  run: (input) => {
    const m = input.trim().match(/^([\d.,]+)\s*([a-zA-Z]+)$/);
    if (!m) throw new Error("Format: '10 kg' oder '22 lb'");
    const val = parseFloat(m[1].replace(",","."));
    const unit = m[2].toLowerCase();
    if (!(unit in TO_KG)) throw new Error(`Unbekannte Einheit '${m[2]}'. Erlaubt: ${Object.keys(TO_KG).join(", ")}`);
    const kg = val * TO_KG[unit];
    const fmt = (v: number) => parseFloat(v.toPrecision(6)).toString();
    return { output: [
      `${val} ${unit} =`,
      ``,
      `  mg:  ${fmt(kg/1e-6)}`,
      `  g:   ${fmt(kg/0.001)}`,
      `  kg:  ${fmt(kg)}`,
      `  t:   ${fmt(kg/1000)}`,
      `  oz:  ${fmt(kg/0.0283495)}`,
      `  lb:  ${fmt(kg/0.453592)}`,
      `  st:  ${fmt(kg/6.35029)}`,
    ].join("\n") };
  },
});
