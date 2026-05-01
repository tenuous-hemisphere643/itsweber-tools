import { defineTool } from "../core";

const VALS = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]] as [number,string][];

function toRoman(n: number): string {
  if (n < 1 || n > 3999) throw new Error("Zahl muss zwischen 1 und 3999 liegen.");
  let result = ""; let rem = n;
  for (const [v, s] of VALS) { while (rem >= v) { result += s; rem -= v; } }
  return result;
}

function fromRoman(s: string): number {
  const map: Record<string,number> = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = map[s[i]]; const next = map[s[i+1]];
    if (!cur) throw new Error(`Unbekanntes Zeichen: ${s[i]}`);
    total += next && next > cur ? -cur : cur;
  }
  return total;
}

function isRoman(s: string) { return /^[MDCLXVI]+$/i.test(s.trim()); }

export default defineTool({
  id: "roman-numerals",
  title: "Roman Numerals Converter",
  titleDe: "Römische Zahlen Konverter",
  description: "Convert between Arabic numbers and Roman numerals — auto-detected.",
  descriptionDe: "Konvertiert zwischen arabischen Zahlen und römischen Ziffern — Richtung wird erkannt.",
  explanation: "Enter an Arabic number (1–3999) to get Roman numerals, or enter Roman numerals to get the Arabic value. Direction is auto-detected.",
  explanationDe: "Arabische Zahl (1–3999) → Römische Ziffern. Römische Ziffern → Arabische Zahl. Richtung wird automatisch erkannt.",
  category: "Converter",
  keywords: ["roman", "numerals", "römisch", "ziffern", "zahlen", "convert"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "2024 oder MMXXIV",
  example: "2024",
  useCasesDe: ["Jahreszahlen auf Denkmälern lesen","Titelseiten und Einleitungen","Geschichtliche Dokumente"],
  run: (input) => {
    const t = input.trim().toUpperCase();
    if (isRoman(t)) {
      const n = fromRoman(t);
      return { output: `Römisch: ${t}\nArabisch: ${n}` };
    }
    const n = parseInt(t, 10);
    if (isNaN(n)) throw new Error("Eingabe ist weder eine Zahl noch gültige römische Ziffern.");
    return { output: `Arabisch: ${n}\nRömisch:  ${toRoman(n)}` };
  },
});
