import { defineTool } from "../core";

const ONES_DE = ["","ein","zwei","drei","vier","fünf","sechs","sieben","acht","neun","zehn","elf","zwölf","dreizehn","vierzehn","fünfzehn","sechzehn","siebzehn","achtzehn","neunzehn"];
const TENS_DE = ["","","zwanzig","dreißig","vierzig","fünfzig","sechzig","siebzig","achtzig","neunzig"];

function numToWordsDe(n: number): string {
  if (n === 0) return "null";
  if (n < 0) return "minus " + numToWordsDe(-n);
  if (n < 20) return ONES_DE[n];
  if (n < 100) { const t=Math.floor(n/10); const o=n%10; return o>0?ONES_DE[o]+"und"+TENS_DE[t]:TENS_DE[t]; }
  if (n < 1000) { const h=Math.floor(n/100); const r=n%100; return ONES_DE[h]+"hundert"+(r>0?numToWordsDe(r):""); }
  if (n < 1000000) { const t=Math.floor(n/1000); const r=n%1000; return (t===1?"ein":numToWordsDe(t))+"tausend"+(r>0?numToWordsDe(r):""); }
  if (n < 1000000000) { const m=Math.floor(n/1000000); const r=n%1000000; return (m===1?"eine Million":numToWordsDe(m)+" Millionen")+(r>0?" "+numToWordsDe(r):""); }
  return n.toString();
}

const ONES_EN = ["","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const TENS_EN = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];

function numToWordsEn(n: number): string {
  if (n === 0) return "zero";
  if (n < 0) return "minus " + numToWordsEn(-n);
  if (n < 20) return ONES_EN[n];
  if (n < 100) { const t=Math.floor(n/10); const o=n%10; return o>0?TENS_EN[t]+"-"+ONES_EN[o]:TENS_EN[t]; }
  if (n < 1000) { const h=Math.floor(n/100); const r=n%100; return ONES_EN[h]+" hundred"+(r>0?" "+numToWordsEn(r):""); }
  if (n < 1000000) { const t=Math.floor(n/1000); const r=n%1000; return numToWordsEn(t)+" thousand"+(r>0?" "+numToWordsEn(r):""); }
  if (n < 1000000000) { const m=Math.floor(n/1000000); const r=n%1000000; return numToWordsEn(m)+" million"+(r>0?" "+numToWordsEn(r):""); }
  return n.toString();
}

export default defineTool({
  id: "number-words",
  title: "Number to Words",
  titleDe: "Zahl in Wörter",
  description: "Convert numbers to words in German and English.",
  descriptionDe: "Zahlen in Wörter auf Deutsch und Englisch umwandeln.",
  explanation: "Enter a number (up to 999 million). Shows written form in German and English.",
  explanationDe: "Zahl eingeben (bis 999 Millionen). Zeigt Schreibweise auf Deutsch und Englisch.",
  category: "Text",
  keywords: ["number","words","zahlen","wörter","schreiben","convert","german","english","spell"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "1234",
  example: "42000",
  useCasesDe: ["Rechnungsbeträge ausschreiben","Cheques ausfüllen","Sprachverarbeitung"],
  run: (input) => {
    const n = parseInt(input.trim().replace(/[.,_\s]/g,""));
    if (isNaN(n)) throw new Error("Ungültige ganze Zahl");
    if (Math.abs(n) > 999999999) throw new Error("Maximum: 999.999.999");
    return { output: [
      `Deutsch:  ${numToWordsDe(n)}`,
      `Englisch: ${numToWordsEn(n)}`,
    ].join("\n") };
  },
});
