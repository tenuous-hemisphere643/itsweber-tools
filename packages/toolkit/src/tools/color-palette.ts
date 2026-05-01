import { defineTool } from "../core";

function hexToHsl(hex: string): [number, number, number] {
  const clean = hex.replace(/^#/, "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  const h = d === 0 ? 0 : max === r ? 60 * (((g - b) / d) % 6) : max === g ? 60 * ((b - r) / d + 2) : 60 * ((r - g) / d + 4);
  return [Math.round((h + 360) % 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100, ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = ln - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

export default defineTool({
  id: "color-palette",
  title: "Color Palette Generator",
  titleDe: "Farbpaletten-Generator",
  description: "Generate tints, shades, and complementary colors from a base hex color.",
  descriptionDe: "Erzeugt Tints, Shades und Komplementärfarben aus einer HEX-Basisfarbe.",
  explanation: "From a single base color, generates a 9-step tint/shade scale (100–900), the complementary color, and analogous colors. Outputs HEX values for all.",
  explanationDe: "Aus einer Basisfarbe werden eine 9-stufige Tint/Shade-Skala (100–900), die Komplementärfarbe und analoge Farben generiert. Alle Werte als HEX.",
  category: "Converter",
  keywords: ["color", "palette", "tint", "shade", "complementary", "farbe", "css", "design", "tokens"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "#157897",
  example: "#157897",
  useCasesDe: ["Design-Token-Skalen erzeugen", "CSS-Custom-Properties befüllen", "Farbpaletten für Projekte erstellen"],
  run: (input) => {
    const hex = input.trim();
    if (!/^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(hex)) throw new Error("Enter a valid HEX color like #157897.");
    const normalized = hex.startsWith("#") ? hex : `#${hex}`;
    const [h, s, l] = hexToHsl(normalized);

    const steps = [
      { label: "100", l: 95 },
      { label: "200", l: 88 },
      { label: "300", l: 78 },
      { label: "400", l: 65 },
      { label: "500", l: 52 },
      { label: "600", l: 40 },
      { label: "700", l: 30 },
      { label: "800", l: 20 },
      { label: "900", l: 12 },
    ];

    const scale = steps.map(({ label, l: sl }) => `  ${label}: ${hslToHex(h, s, sl)}`);
    const comp = hslToHex((h + 180) % 360, s, l);
    const anal1 = hslToHex((h + 30)  % 360, s, l);
    const anal2 = hslToHex((h - 30 + 360) % 360, s, l);

    return {
      output: [
        `Base:  ${normalized.toUpperCase()}  hsl(${h}, ${s}%, ${l}%)`,
        ``,
        `── Scale ──`,
        ...scale,
        ``,
        `── Harmonies ──`,
        `  Complementary: ${comp}`,
        `  Analogous +30: ${anal1}`,
        `  Analogous -30: ${anal2}`,
      ].join("\n"),
    };
  },
});
