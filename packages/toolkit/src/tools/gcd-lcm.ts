import { defineTool } from "../core";

function gcd(a: number, b: number): number { return b===0?a:gcd(b,a%b); }
function lcm(a: number, b: number): number { return Math.abs(a*b)/gcd(a,b); }

export default defineTool({
  id: "gcd-lcm",
  title: "GCD / LCM Calculator",
  titleDe: "GGT / KGV Rechner",
  description: "Calculate Greatest Common Divisor (GCD) and Least Common Multiple (LCM) for multiple numbers.",
  descriptionDe: "Größten Gemeinsamen Teiler (GGT) und Kleinstes Gemeinsames Vielfaches (KGV) für mehrere Zahlen berechnen.",
  explanation: "Enter 2–10 integers separated by commas, spaces, or newlines.",
  explanationDe: "2–10 ganze Zahlen durch Komma, Leerzeichen oder Zeilenumbruch getrennt eingeben.",
  category: "Math",
  keywords: ["gcd","lcm","ggt","kgv","divisor","multiple","math","teiler","vielfaches"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "12 18 24",
  example: "36 48 72",
  useCasesDe: ["Bruchrechnen vereinfachen","Zeitplan-Zyklen berechnen","LCM für Animationen"],
  run: (input) => {
    const nums = input.split(/[\s,\n]+/).map(s=>parseInt(s.trim())).filter(n=>!isNaN(n)&&n>0);
    if (nums.length < 2) throw new Error("Mindestens 2 positive ganze Zahlen");
    if (nums.length > 10) throw new Error("Maximum: 10 Zahlen");
    const g = nums.reduce(gcd);
    const l = nums.reduce(lcm);
    const factors = nums.map(n=>{ const fs: number[]=[]; let d=2; let m=n; while(d*d<=m){while(m%d===0){fs.push(d);m=Math.floor(m/d);}d++;}if(m>1)fs.push(m); return `${n} = ${fs.join(" × ")}`; });
    return { output: [
      `Zahlen: ${nums.join(", ")}`,``,
      `GGT (GCD): ${g}`,
      `KGV (LCM): ${l}`,
      ``,
      `Primfaktorzerlegung:`,
      ...factors,
    ].join("\n") };
  },
});
