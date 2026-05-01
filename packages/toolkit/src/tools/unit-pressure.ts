import { defineTool } from "../core";

const TO_PA: Record<string,number> = {
  "pa":1,"hpa":100,"kpa":1000,"mpa":1e6,"bar":100000,"mbar":100,
  "atm":101325,"at":98066.5,"torr":133.322,"mmhg":133.322,
  "psi":6894.76,"ksi":6894760,"inHg":3386.39,"inhg":3386.39,
};

export default defineTool({
  id: "unit-pressure",
  title: "Pressure Converter",
  titleDe: "Druck-Konverter",
  description: "Convert between Pa, hPa, bar, mbar, atm, psi, Torr, and inHg.",
  descriptionDe: "Zwischen Pa, hPa, bar, mbar, atm, psi, Torr und inHg konvertieren.",
  explanation: "Enter a value with unit, e.g. '1 bar' or '14.7 psi'.",
  explanationDe: "Wert mit Einheit eingeben, z.B. '1 bar' oder '14.7 psi'.",
  category: "Converter",
  keywords: ["pressure","druck","bar","psi","atm","pascal","hpa","mbar","konvertieren"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "1 bar",
  example: "1 atm",
  useCasesDe: ["Reifendruck umrechnen","Wetterdaten vergleichen","Industrielle Prozesse"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const m = t.match(/^([\d.,]+)\s*(.+)$/);
    if (!m) throw new Error("Format: '1 bar' oder '1013 hPa'");
    const val = parseFloat(m[1].replace(",","."));
    const unit = m[2].trim();
    if (!(unit in TO_PA)) throw new Error(`Unbekannte Einheit '${unit}'.\nErlaubt: ${Object.keys(TO_PA).join(", ")}`);
    const pa = val * TO_PA[unit];
    const f = (v: number) => parseFloat(v.toPrecision(5)).toString();
    return { output: [
      `${val} ${unit} =`,``,
      `  Pa:    ${f(pa)}`,
      `  hPa:   ${f(pa/100)}`,
      `  kPa:   ${f(pa/1000)}`,
      `  MPa:   ${f(pa/1e6)}`,
      `  bar:   ${f(pa/100000)}`,
      `  mbar:  ${f(pa/100)}`,
      `  atm:   ${f(pa/101325)}`,
      `  psi:   ${f(pa/6894.76)}`,
      `  Torr:  ${f(pa/133.322)}`,
      `  inHg:  ${f(pa/3386.39)}`,
    ].join("\n") };
  },
});
