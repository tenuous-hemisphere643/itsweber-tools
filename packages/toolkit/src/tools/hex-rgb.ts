import { defineTool } from "../core";

function hexToRgb(hex: string) {
  const clean = hex.replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) throw new Error("Invalid hex color. Use #RGB or #RRGGBB.");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return { r, g, b, full };
}

export default defineTool({
  id: "hex-rgb",
  title: "HEX ↔ RGB Converter",
  titleDe: "HEX ↔ RGB Konverter",
  description: "Convert between HEX color codes and RGB values.",
  descriptionDe: "Konvertiert HEX-Farbcodes in RGB-Werte und zurück.",
  explanation: "Converts a HEX color (#RRGGBB or #RGB) to its RGB representation and vice versa. Also outputs HSL for reference.",
  explanationDe: "Wandelt einen HEX-Farbcode (#RRGGBB oder #RGB) in RGB um und umgekehrt. Gibt zusätzlich HSL zur Orientierung aus.",
  category: "Converter",
  keywords: ["hex", "rgb", "color", "colour", "farbe", "css", "hsl"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "#157897 or rgb(21, 120, 151)",
  example: "#157897",
  useCasesDe: ["CSS-Farben umrechnen", "Design-Tokens prüfen", "Palette dokumentieren"],
  run: (input) => {
    const trimmed = input.trim();
    if (trimmed.startsWith("#") || /^[0-9a-fA-F]{3,6}$/.test(trimmed)) {
      const { r, g, b, full } = hexToRgb(trimmed.startsWith("#") ? trimmed : `#${trimmed}`);
      const rn = r / 255, gn = g / 255, bn = b / 255;
      const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
      const l = (max + min) / 2;
      const d = max - min;
      const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
      const h = d === 0 ? 0 : max === rn ? 60 * (((gn - bn) / d) % 6) : max === gn ? 60 * ((bn - rn) / d + 2) : 60 * ((rn - gn) / d + 4);
      return {
        output: [
          `HEX:  #${full.toUpperCase()}`,
          `RGB:  rgb(${r}, ${g}, ${b})`,
          `HSL:  hsl(${Math.round((h + 360) % 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
          `CSS:  color: #${full.toUpperCase()};`,
        ].join("\n"),
      };
    }
    const rgbMatch = trimmed.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch.map(Number);
      if ([r, g, b].some((v) => v < 0 || v > 255)) throw new Error("RGB values must be between 0 and 255.");
      const hex = [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
      return { output: `HEX:  #${hex}\nRGB:  rgb(${r}, ${g}, ${b})\nCSS:  color: #${hex};` };
    }
    throw new Error("Enter a HEX color (#157897) or RGB value (rgb(21, 120, 151)).");
  },
});
