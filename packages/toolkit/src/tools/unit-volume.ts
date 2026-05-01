import { defineTool } from "../core";

const TO_L: Record<string,number> = {
  "ml":0.001,"cl":0.01,"dl":0.1,"l":1,"hl":100,"m³":1000,"m3":1000,
  "tsp":0.00492892,"tbsp":0.0147868,"fl oz":0.0295735,"cup":0.236588,
  "pt":0.473176,"qt":0.946353,"gal":3.78541,
  "uk fl oz":0.0284131,"uk pt":0.568261,"uk gal":4.54609,
};

export default defineTool({
  id: "unit-volume",
  title: "Volume Converter",
  titleDe: "Volumen-Konverter",
  description: "Convert between ml, cl, l, m³, teaspoon, cup, gallon (US/UK), and more.",
  descriptionDe: "Zwischen ml, cl, l, m³, Teelöffel, Cup, Gallone (US/UK) und weiteren Volumenmaßen konvertieren.",
  explanation: "Enter a value with unit, e.g. '500 ml' or '1 gal'.",
  explanationDe: "Wert mit Einheit eingeben, z.B. '500 ml' oder '1 gal'.",
  category: "Converter",
  keywords: ["volume","volumen","liter","ml","gallon","cup","fluid","convert","kochen"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "1 l",
  example: "1 gal",
  useCasesDe: ["Kochrezepte umrechnen","Behältergrößen vergleichen","Chemikalien dosieren"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const m = t.match(/^([\d.,]+)\s*(.+)$/);
    if (!m) throw new Error("Format: '500 ml' oder '2 cup'");
    const val = parseFloat(m[1].replace(",","."));
    const unit = m[2].trim();
    if (!(unit in TO_L)) throw new Error(`Unbekannte Einheit '${unit}'.\nErlaubt: ${Object.keys(TO_L).join(", ")}`);
    const l = val * TO_L[unit];
    const f = (v: number) => parseFloat(v.toPrecision(4)).toString();
    return { output: [
      `${val} ${unit} =`,``,
      `  ml:     ${f(l*1000)}`,
      `  cl:     ${f(l*100)}`,
      `  dl:     ${f(l*10)}`,
      `  l:      ${f(l)}`,
      `  m³:     ${f(l/1000)}`,
      `  tsp:    ${f(l/0.00492892)}`,
      `  tbsp:   ${f(l/0.0147868)}`,
      `  fl oz:  ${f(l/0.0295735)}  (US)`,
      `  cup:    ${f(l/0.236588)}`,
      `  pt:     ${f(l/0.473176)}  (US)`,
      `  gal:    ${f(l/3.78541)}  (US)`,
      `  uk gal: ${f(l/4.54609)}`,
    ].join("\n") };
  },
});
