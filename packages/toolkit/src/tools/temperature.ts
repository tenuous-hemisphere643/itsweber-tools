import { defineTool } from "../core";

export default defineTool({
  id: "temperature",
  title: "Temperature Converter",
  titleDe: "Temperatur-Konverter",
  description: "Convert between Celsius, Fahrenheit, and Kelvin.",
  descriptionDe: "Konvertiert zwischen Celsius, Fahrenheit und Kelvin.",
  explanation: "Converts a temperature value in Celsius, Fahrenheit, or Kelvin to all three scales simultaneously.",
  explanationDe: "Wandelt einen Temperaturwert in Celsius, Fahrenheit oder Kelvin gleichzeitig in alle drei Einheiten um.",
  category: "Converter",
  keywords: ["temperature", "celsius", "fahrenheit", "kelvin", "temperatur", "convert", "unit"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "100°C  or  212F  or  373.15K",
  example: "100°C",
  useCasesDe: ["Server-Betriebstemperaturen prüfen", "Kochrezepte umrechnen", "Internationale Dokumente lesen"],
  run: (input) => {
    const trimmed = input.trim().replace(/°/g, "");
    const match = trimmed.match(/^(-?\d+(\.\d+)?)\s*([CcFfKk]?)$/);
    if (!match) throw new Error("Enter a value like 100°C, 212F, or 373.15K.");
    const value = parseFloat(match[1]);
    const unit = match[3].toUpperCase() || "C";
    let c: number;
    if (unit === "C") c = value;
    else if (unit === "F") c = (value - 32) * 5 / 9;
    else if (unit === "K") c = value - 273.15;
    else throw new Error("Unknown unit. Use C, F, or K.");
    const f = c * 9 / 5 + 32;
    const k = c + 273.15;
    return {
      output: [
        `Celsius:    ${c.toFixed(4)} °C`,
        `Fahrenheit: ${f.toFixed(4)} °F`,
        `Kelvin:     ${k.toFixed(4)} K`,
      ].join("\n"),
    };
  },
});
