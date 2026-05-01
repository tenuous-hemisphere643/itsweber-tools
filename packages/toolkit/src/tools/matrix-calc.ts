import { defineTool } from "../core";

type Matrix = number[][];

function parseMatrix(s: string): Matrix {
  return s.trim().split("\n").map(row=>row.trim().split(/[\s,;]+/).map(n=>parseFloat(n)));
}
function matMul(a: Matrix, b: Matrix): Matrix {
  if (a[0].length !== b.length) throw new Error(`Dimensionsfehler: (${a.length}×${a[0].length}) × (${b.length}×${b[0].length})`);
  return a.map((row,i)=>b[0].map((_,j)=>row.reduce((sum,_,k)=>sum+a[i][k]*b[k][j],0)));
}
function matAdd(a: Matrix, b: Matrix, sign=1): Matrix {
  if (a.length!==b.length||a[0].length!==b[0].length) throw new Error("Matrizen müssen gleiche Dimensionen haben");
  return a.map((row,i)=>row.map((v,j)=>v+sign*b[i][j]));
}
function transpose(m: Matrix): Matrix { return m[0].map((_,j)=>m.map(row=>row[j])); }
function det2(m: Matrix): number { return m[0][0]*m[1][1]-m[0][1]*m[1][0]; }
function det3(m: Matrix): number {
  return m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])
        -m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])
        +m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);
}
function fmtMatrix(m: Matrix): string {
  const cols = m[0].length;
  const widths = Array.from({length:cols},(_,j)=>Math.max(...m.map(r=>parseFloat(r[j].toPrecision(6)).toString().length)));
  return m.map(row=>`  [${row.map((v,j)=>parseFloat(v.toPrecision(6)).toString().padStart(widths[j])).join("  ")}]`).join("\n");
}

export default defineTool({
  id: "matrix-calc",
  title: "Matrix Calculator",
  titleDe: "Matrix-Rechner",
  description: "Perform matrix operations: multiply, add, subtract, transpose, determinant.",
  descriptionDe: "Matrizenoperationen durchführen: Multiplizieren, Addieren, Subtrahieren, Transponieren, Determinante.",
  explanation: "First line: operation (mul, add, sub, transpose, det). Matrices separated by --- on its own line. Rows are newlines, columns are spaces.",
  explanationDe: "Erste Zeile: Operation (mul, add, sub, transpose, det). Matrizen durch --- getrennt. Zeilen = Zeilenumbrüche, Spalten = Leerzeichen.",
  category: "Math",
  keywords: ["matrix","matrizen","multiply","determinant","transpose","linear","algebra","math"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "mul\n1 2\n3 4\n---\n5 6\n7 8",
  example: "det\n1 2 3\n4 5 6\n7 8 9",
  useCasesDe: ["Lineare Algebra","Transformationen berechnen","Grafik-Mathe"],
  run: (input) => {
    const lines = input.split("\n");
    const op = lines[0].trim().toLowerCase();
    const rest = lines.slice(1).join("\n");
    const parts = rest.split(/^---$/m).map(s=>s.trim()).filter(Boolean);
    if (op==="transpose" || op==="det") {
      const m = parseMatrix(parts[0]);
      if (op==="transpose") return { output: `Transponiert:\n${fmtMatrix(transpose(m))}` };
      if (m.length===2 && m[0].length===2) return { output: `det = ${det2(m)}` };
      if (m.length===3 && m[0].length===3) return { output: `det = ${det3(m)}` };
      throw new Error("Determinante nur für 2×2 und 3×3 Matrizen");
    }
    if (parts.length < 2) throw new Error("Zwei Matrizen benötigt — durch '---' trennen");
    const a = parseMatrix(parts[0]);
    const b = parseMatrix(parts[1]);
    let result: Matrix;
    if (op==="mul") result = matMul(a,b);
    else if (op==="add") result = matAdd(a,b);
    else if (op==="sub") result = matAdd(a,b,-1);
    else throw new Error("Operationen: mul, add, sub, transpose, det");
    return { output: `Ergebnis:\n${fmtMatrix(result)}` };
  },
});
