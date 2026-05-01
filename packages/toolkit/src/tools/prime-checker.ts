import { defineTool } from "../core";

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}
function primeFactors(n: number): number[] {
  const factors: number[] = [];
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) { factors.push(d); n = Math.floor(n / d); }
    d++;
  }
  if (n > 1) factors.push(n);
  return factors;
}
function nextPrimes(start: number, count: number): number[] {
  const result: number[] = [];
  let n = start + 1;
  while (result.length < count) { if (isPrime(n)) result.push(n); n++; }
  return result;
}

export default defineTool({
  id: "prime-checker",
  title: "Prime Number Checker",
  titleDe: "Primzahl-Prüfer",
  description: "Check if a number is prime, find prime factors, and list next primes.",
  descriptionDe: "Prüft ob eine Zahl eine Primzahl ist, findet Primfaktoren und listet die nächsten Primzahlen.",
  explanation: "Enter a positive integer. Shows if it's prime, the prime factorization, and the next 5 primes.",
  explanationDe: "Positive ganze Zahl eingeben. Zeigt ob Primzahl, Primfaktorzerlegung und die nächsten 5 Primzahlen.",
  category: "Math",
  keywords: ["prime","primzahl","factor","faktor","divisible","teiler","number","integer","math"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "97",
  example: "360",
  useCasesDe: ["Kryptografie-Grundlagen","Mathe-Hausaufgaben","RSA-Schlüssel verstehen"],
  run: (input) => {
    const n = parseInt(input.trim().replace(/[.,_]/g,""));
    if (isNaN(n) || n < 1) throw new Error("Positive ganze Zahl erforderlich");
    if (n > 1_000_000) throw new Error("Maximum: 1.000.000");
    const prime = isPrime(n);
    const factors = primeFactors(n);
    const nexts = nextPrimes(n, 5);
    const out = [
      `${n} ist ${prime ? "eine Primzahl ✓" : "keine Primzahl ✗"}`,``,
    ];
    if (!prime) {
      const grouped: Record<number,number> = {};
      factors.forEach(f=>grouped[f]=(grouped[f]||0)+1);
      const factorStr = Object.entries(grouped).map(([p,e])=>e>1?`${p}^${e}`:p).join(" × ");
      out.push(`Primfaktorzerlegung: ${factors.join(" × ")}  =  ${factorStr}`);
      out.push(`Teiler: ${Array.from({length:n},(_, i)=>i+1).filter(i=>n%i===0).join(", ")}`);
    } else {
      out.push(`Teiler: 1, ${n}  (nur sich selbst und 1)`);
    }
    out.push(``, `Nächste Primzahlen: ${nexts.join(", ")}`);
    return { output: out.join("\n") };
  },
});
