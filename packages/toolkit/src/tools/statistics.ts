import { defineTool } from "../core";

export default defineTool({
  id: "statistics",
  title: "Statistics Calculator",
  titleDe: "Statistik-Rechner",
  description: "Calculate mean, median, mode, standard deviation, and more for a list of numbers.",
  descriptionDe: "Mittelwert, Median, Modus, Standardabweichung und mehr für eine Zahlenliste berechnen.",
  explanation: "Enter numbers separated by newlines, commas, or spaces. Calculates: count, min, max, range, mean, median, mode, variance, stddev, quartiles.",
  explanationDe: "Zahlen durch Zeilenumbrüche, Kommas oder Leerzeichen getrennt eingeben. Berechnet: Anzahl, Min, Max, Spanne, Mittelwert, Median, Modus, Varianz, Standardabweichung, Quartile.",
  category: "Math",
  keywords: ["statistics","statistik","mean","median","mode","stddev","variance","numbers","zahlen","quartile"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "12\n45\n23\n67\n34\n56\n12\n89",
  example: "5 3 8 1 9 2 7 4 6 3",
  useCasesDe: ["Messwerte auswerten","Log-Zeiten analysieren","Datensätze zusammenfassen"],
  run: (input) => {
    const nums = input.split(/[\n,\s]+/).map(s=>s.trim()).filter(Boolean).map(s=>{
      const n = parseFloat(s.replace(",","."));
      if (isNaN(n)) throw new Error(`Ungültige Zahl: '${s}'`);
      return n;
    });
    if (nums.length < 1) throw new Error("Mindestens eine Zahl erforderlich");
    const sorted = [...nums].sort((a,b)=>a-b);
    const n = nums.length;
    const sum = nums.reduce((a,b)=>a+b,0);
    const mean = sum/n;
    const median = n%2===0 ? (sorted[n/2-1]+sorted[n/2])/2 : sorted[Math.floor(n/2)];
    const freq: Record<number,number> = {};
    nums.forEach(v=>freq[v]=(freq[v]||0)+1);
    const maxFreq = Math.max(...Object.values(freq));
    const mode = Object.entries(freq).filter(([,f])=>f===maxFreq).map(([v])=>parseFloat(v));
    const variance = nums.reduce((a,v)=>a+Math.pow(v-mean,2),0)/n;
    const stddev = Math.sqrt(variance);
    const q1 = sorted[Math.floor(n*0.25)];
    const q3 = sorted[Math.floor(n*0.75)];
    const f = (v: number) => parseFloat(v.toPrecision(6)).toString();
    return { output: [
      `Anzahl:          ${n}`,
      `Summe:           ${f(sum)}`,
      `Min:             ${f(sorted[0])}`,
      `Max:             ${f(sorted[n-1])}`,
      `Spanne:          ${f(sorted[n-1]-sorted[0])}`,
      ``,
      `Mittelwert:      ${f(mean)}`,
      `Median:          ${f(median)}`,
      `Modus:           ${mode.length<=3 ? mode.map(f).join(", ") : mode.slice(0,3).map(f).join(", ")+"..."}`,
      ``,
      `Varianz:         ${f(variance)}`,
      `Standardabw.:    ${f(stddev)}`,
      ``,
      `Q1 (25%):        ${f(q1)}`,
      `Q3 (75%):        ${f(q3)}`,
      `IQR:             ${f(q3-q1)}`,
    ].join("\n") };
  },
});
