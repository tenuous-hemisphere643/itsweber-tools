import { defineTool } from "../core";

export default defineTool({
  id: "spell-numbers",
  title: "Phone Spell / Vanity Number",
  titleDe: "Telefon-Buchstaben / Vanity-Nummer",
  description: "Convert between phone numbers and their letter equivalents (T9 / vanity).",
  descriptionDe: "Zwischen Telefonnummern und ihren Buchstabenäquivalenten konvertieren (T9 / Vanity).",
  explanation: "Enter digits to see all letter combinations, or enter a word to see its numeric equivalent.",
  explanationDe: "Ziffern eingeben → alle Buchstabenkombinationen. Wort eingeben → numerisches Äquivalent.",
  category: "Text",
  keywords: ["phone","t9","vanity","number","spell","letters","keypad","numerisch","telefon"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "42",
  example: "HELLO",
  useCasesDe: ["Vanity-Nummern erstellen","T9-Eingabe verstehen","Telefonnummern merken"],
  run: (input) => {
    const t = input.trim().toUpperCase();
    const PAD: Record<string,string[]> = {
      "2":["A","B","C"],"3":["D","E","F"],"4":["G","H","I"],
      "5":["J","K","L"],"6":["M","N","O"],"7":["P","Q","R","S"],
      "8":["T","U","V"],"9":["W","X","Y","Z"],"0":[" "],"1":["1"],
    };
    const REVERSE: Record<string,string> = {};
    for (const [d,ls] of Object.entries(PAD)) ls.forEach(l=>REVERSE[l]=d);
    if (/^[A-Z\s]+$/.test(t)) {
      const digits = t.split("").map(c=>REVERSE[c]||c).join("");
      return { output: `"${t}" → ${digits}` };
    }
    if (/^[\d\s+\-()]+$/.test(t)) {
      const clean = t.replace(/[\s+\-()]/g,"");
      const numLetters = clean.split("").map(d=>PAD[d]?.join("")||d).join(" ");
      return { output: [
        `${clean} → [${numLetters}]`,
        ``,
        clean.length <= 8 ? `Alle Kombinationen (${clean.split("").reduce((a,d)=>a*(PAD[d]?.length||1),1)}):` : "(zu viele Kombinationen für Anzeige)",
        ...( clean.length <= 5 ? (() => {
          const combos: string[][] = [[]];
          for (const d of clean) {
            const ls = PAD[d] || [d];
            const next: string[][] = [];
            for (const combo of combos) for (const l of ls) next.push([...combo,l]);
            combos.splice(0,combos.length,...next);
          }
          return combos.slice(0,50).map(c=>c.join(""));
        })() : [])
      ].join("\n") };
    }
    throw new Error("Ziffern (0-9) oder Buchstaben eingeben");
  },
});
