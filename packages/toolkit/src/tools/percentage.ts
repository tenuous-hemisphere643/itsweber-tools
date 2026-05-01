import { defineTool } from "../core";

export default defineTool({
  id: "percentage",
  title: "Percentage Calculator",
  titleDe: "Prozentrechner",
  description: "Calculate percentages, percentage change, and reverse percentages.",
  descriptionDe: "Berechnet Prozentwerte, Prozentänderungen und umgekehrte Prozentrechnung.",
  explanation: "Supports: '20% of 150', '30 is what % of 200', '200 increased by 15%', '170 decreased by 10%', 'change from 80 to 100'.",
  explanationDe: "Unterstützt: '20% von 150', '30 ist wie viel % von 200', '200 plus 15%', '170 minus 10%', 'Änderung von 80 auf 100'.",
  category: "Math",
  keywords: ["prozent","percent","percentage","berechnung","rabatt","discount","change","increase","decrease","steuer","tax"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "20% von 150  oder  change from 80 to 100",
  example: "20% von 150",
  useCasesDe: ["Rabatte und Preise berechnen","Steuern und Aufschläge","Wachstumsraten ermitteln"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    // "X% of/von Y"
    let m = t.match(/^([\d.,]+)%\s+(?:of|von)\s+([\d.,]+)$/);
    if (m) { const p=parseFloat(m[1]),b=parseFloat(m[2]),r=b*p/100; return { output: `${p}% von ${b} = ${r.toFixed(4)}\n\nAlso: ${b} + ${p}% = ${(b+r).toFixed(4)}\n      ${b} − ${p}% = ${(b-r).toFixed(4)}` }; }
    // "X is what % of Y" / "X ist wie viel % von Y"
    m = t.match(/^([\d.,]+)\s+(?:is|ist)\s+(?:what|wie viel|wieviel)\s*%\s+(?:of|von)\s+([\d.,]+)$/);
    if (m) { const x=parseFloat(m[1]),y=parseFloat(m[2]); return { output: `${x} ist ${(x/y*100).toFixed(4)}% von ${y}` }; }
    // "X plus/increased by Y%"
    m = t.match(/^([\d.,]+)\s+(?:plus|increased by|erhöht um)\s+([\d.,]+)%$/);
    if (m) { const b=parseFloat(m[1]),p=parseFloat(m[2]); return { output: `${b} + ${p}% = ${(b*(1+p/100)).toFixed(4)}` }; }
    // "X minus/decreased by Y%"
    m = t.match(/^([\d.,]+)\s+(?:minus|decreased by|reduziert um)\s+([\d.,]+)%$/);
    if (m) { const b=parseFloat(m[1]),p=parseFloat(m[2]); return { output: `${b} − ${p}% = ${(b*(1-p/100)).toFixed(4)}` }; }
    // "change from X to Y"
    m = t.match(/^(?:change|änderung|von|change from)\s+(?:from\s+)?([\d.,]+)\s+(?:to|auf|zu)\s+([\d.,]+)$/);
    if (m) { const a=parseFloat(m[1]),b=parseFloat(m[2]),chg=(b-a)/a*100; return { output: `Von ${a} auf ${b}:\n  Absolute Änderung: ${(b-a>=0?"+":"")}${(b-a).toFixed(4)}\n  Prozentänderung:   ${chg>=0?"+":""}${chg.toFixed(4)}%` }; }
    throw new Error("Nicht erkannt. Beispiele:\n  20% von 150\n  30 ist wie viel % von 200\n  200 increased by 15%\n  change from 80 to 100");
  },
});
