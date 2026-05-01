import { defineTool } from "../core";

export default defineTool({
  id: "fibonacci",
  title: "Fibonacci Sequence",
  titleDe: "Fibonacci-Folge",
  description: "Generate Fibonacci sequence, check if a number is Fibonacci, or find the nth term.",
  descriptionDe: "Fibonacci-Folge generieren, prüfen ob eine Zahl zur Folge gehört oder das n-te Glied berechnen.",
  explanation: "Commands: 'list N' (first N terms), 'nth N' (nth term), 'check N' (is N fibonacci?), 'golden' (ratio exploration).",
  explanationDe: "Befehle: 'list N' (erste N Glieder), 'nth N' (n-tes Glied), 'check N' (ist N Fibonacci?), 'golden' (Goldener Schnitt).",
  category: "Math",
  keywords: ["fibonacci","folge","sequence","golden","ratio","number","math","series"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "list 15",
  example: "nth 20",
  useCasesDe: ["Algorithmen erklären","Goldenen Schnitt berechnen","Mathematik veranschaulichen"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const fib = (n: number): bigint => {
      let a=0n, b=1n;
      for (let i=0; i<n; i++) { [a,b]=[b,a+b]; }
      return a;
    };
    const isFib = (n: number): boolean => {
      const isPerfectSq = (x: number) => Math.sqrt(x) === Math.floor(Math.sqrt(x));
      return isPerfectSq(5*n*n+4) || isPerfectSq(5*n*n-4);
    };
    if (t.startsWith("list")) {
      const n = Math.min(100, Math.max(1, parseInt(t.replace("list","").trim())||10));
      const seq: string[] = [];
      let a=0n, b=1n;
      for (let i=0; i<n; i++) { seq.push(a.toString()); [a,b]=[b,a+b]; }
      return { output: `Erste ${n} Fibonacci-Zahlen:\n${seq.join(", ")}` };
    }
    if (t.startsWith("nth")) {
      const n = Math.min(1000, Math.max(0, parseInt(t.replace("nth","").trim())||0));
      return { output: `F(${n}) = ${fib(n).toString()}` };
    }
    if (t.startsWith("check")) {
      const n = parseInt(t.replace("check","").trim());
      if (isNaN(n)) throw new Error("Format: check 144");
      return { output: `${n} ${isFib(n) ? "ist eine Fibonacci-Zahl ✓" : "ist keine Fibonacci-Zahl ✗"}` };
    }
    if (t==="golden") {
      const ratios = Array.from({length:15},(_,i)=>i+2).map(i=>{
        const f1=fib(i), f2=fib(i+1);
        return `F(${i+1})/F(${i}) = ${f2}/${f1} ≈ ${(Number(f2)/Number(f1)).toFixed(8)}`;
      });
      return { output: [`Goldener Schnitt φ ≈ 1.61803398875...`,``,`Verhältnis aufeinanderfolgender Fibonacci-Zahlen:`,``,...ratios].join("\n") };
    }
    const n = parseInt(t);
    if (!isNaN(n)) return { output: `F(${n}) = ${fib(n).toString()}\n${isFib(n)?n+" ist eine Fibonacci-Zahl ✓":n+" ist keine Fibonacci-Zahl ✗"}` };
    throw new Error("Befehle: list N | nth N | check N | golden");
  },
});
