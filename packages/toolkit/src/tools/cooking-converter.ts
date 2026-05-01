import { defineTool } from "../core";

const CONVERSIONS: Record<string,[number,string]> = {
  "tsp":   [4.929,  "ml"],
  "tbsp":  [14.787, "ml"],
  "cup":   [236.588,"ml"],
  "fl oz": [29.574, "ml"],
  "pint":  [473.176,"ml"],
  "qt":    [946.353,"ml"],
  "gal":   [3785.41,"ml"],
  "l":     [1000,   "ml"],
  "dl":    [100,    "ml"],
  "cl":    [10,     "ml"],
  "ml":    [1,      "ml"],
  "g":     [1,      "g"],
  "kg":    [1000,   "g"],
  "oz":    [28.3495,"g"],
  "lb":    [453.592,"g"],
};

const OVEN: [string,number,number][] = [
  ["Stufe 1", 50, 122],["Stufe 2", 75, 167],["Stufe 3", 100, 212],
  ["Stufe 4", 125, 257],["Stufe 5", 150, 302],["Stufe 6", 175, 347],
  ["Stufe 7", 200, 392],["Stufe 8", 225, 437],["Stufe 9", 250, 482],
  ["Heißluft", 20, 0],
];

export default defineTool({
  id: "cooking-converter",
  title: "Cooking Unit Converter",
  titleDe: "Koch-Einheiten-Konverter",
  description: "Convert cooking measurements: cups, tablespoons, fl oz, g, oz, and oven temperatures.",
  descriptionDe: "Koch-Maßeinheiten umrechnen: Cups, Esslöffel, fl oz, g, oz und Ofentemperaturen.",
  explanation: "Enter: '2 cups to ml', '100 g to oz', or 'oven' for temperature table.",
  explanationDe: "Eingabe: '2 cups to ml', '100 g to oz', oder 'oven' für Temperatur-Tabelle.",
  category: "Converter",
  keywords: ["cooking","kochen","cup","tablespoon","teaspoon","oz","oven","recipe","rezept","backen"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "2 cups to ml",
  example: "3 tbsp to ml",
  useCasesDe: ["Amerikanische Rezepte umrechnen","Maßeinheiten im Kochen","Backtemperaturen umrechnen"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    if (t==="oven" || t==="ofen") {
      const rows = OVEN.slice(0,-1).map(([n,c,f])=>`  ${n.padEnd(8)}  ${String(c).padStart(3)}°C  ${String(f).padStart(3)}°F`);
      rows.push(`  Heißluft: ca. 20°C weniger als Ober-/Unterhitze`);
      return { output: [`Ofentemperaturen:`,``,...rows].join("\n") };
    }
    const m = t.match(/^([\d.,]+)\s+(.+?)\s+to\s+(.+)$/);
    if (!m) throw new Error("Format: '2 cups to ml' oder '100 g to oz' oder 'oven'");
    const val = parseFloat(m[1].replace(",","."));
    const from = m[2].trim();
    const to = m[3].trim();
    if (!CONVERSIONS[from]) throw new Error(`Unbekannte Einheit '${from}'.\nErlaubt: ${Object.keys(CONVERSIONS).join(", ")}`);
    if (!CONVERSIONS[to]) throw new Error(`Unbekannte Einheit '${to}'`);
    const fromEntry = CONVERSIONS[from];
    const toEntry = CONVERSIONS[to];
    if (fromEntry[1] !== toEntry[1]) throw new Error(`Inkompatible Einheiten: ${from} (${fromEntry[1]}) ≠ ${to} (${toEntry[1]})`);
    const result = val * fromEntry[0] / toEntry[0];
    return { output: `${val} ${from} = ${parseFloat(result.toPrecision(4))} ${to}` };
  },
});
