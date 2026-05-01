import { defineTool } from "../core";

export default defineTool({
  id: "csv-analyzer",
  title: "CSV Analyzer",
  titleDe: "CSV-Analyser",
  description: "Analyze CSV structure: column names, types, null count, unique values, and data preview.",
  descriptionDe: "CSV-Struktur analysieren: Spaltennamen, Typen, Null-Werte, eindeutige Werte und Datenvorschau.",
  explanation: "Paste CSV data (with header row). Shows column info, type guessing, and statistics per column.",
  explanationDe: "CSV-Daten einfügen (mit Kopfzeile). Zeigt Spalteninformationen, Typschätzung und Statistiken pro Spalte.",
  category: "Data",
  keywords: ["csv","analyze","analyse","column","data","stats","preview","tabular","header","type"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "name,age,city,score\nAlice,30,Berlin,98.5\nBob,25,Hamburg,\nCarol,35,München,87",
  example: "id,name,value,date\n1,Alpha,100,2024-01-01\n2,Beta,200,2024-02-15\n3,Gamma,,2024-03-20",
  useCasesDe: ["Datenqualität prüfen","CSV-Import vorbereiten","Datenbankschema ableiten"],
  run: (input) => {
    const lines = input.trim().split("\n");
    if (lines.length < 2) throw new Error("Mindestens Kopfzeile + eine Datenzeile erforderlich");
    const header = lines[0].split(",").map(h=>h.trim().replace(/^"|"$/g,""));
    const rows = lines.slice(1).map(l=>l.split(",").map(c=>c.trim().replace(/^"|"$/g,"")));
    const out: string[] = [
      `${rows.length} Zeilen × ${header.length} Spalten`,``,
      `Spaltenanalyse:`,`${"─".repeat(60)}`,
    ];
    for (let i=0; i<header.length; i++) {
      const vals = rows.map(r=>r[i]||"");
      const nonEmpty = vals.filter(v=>v!=="");
      const nullCount = vals.length - nonEmpty.length;
      const unique = new Set(nonEmpty).size;
      const isNum = nonEmpty.every(v=>!isNaN(parseFloat(v)));
      let type = "string";
      if (isNum) type = nonEmpty.some(v=>v.includes("."))?"float":"integer";
      else if (nonEmpty.every(v=>/^\d{4}-\d{2}-\d{2}/.test(v))) type = "date";
      else if (nonEmpty.every(v=>["true","false","0","1","yes","no"].includes(v.toLowerCase()))) type = "boolean";
      let stats = `${type}, ${unique} eindeutig, ${nullCount} leer`;
      if (isNum && nonEmpty.length) {
        const nums = nonEmpty.map(Number);
        const avg = (nums.reduce((a,b)=>a+b,0)/nums.length).toFixed(2);
        stats += `, Ø ${avg}, Min ${Math.min(...nums)}, Max ${Math.max(...nums)}`;
      }
      out.push(`  ${header[i].padEnd(20)}  ${stats}`);
      if (unique <= 5 && type==="string" && nonEmpty.length) {
        out.push(`    Werte: ${[...new Set(nonEmpty)].join(", ")}`);
      }
    }
    out.push(``, `Vorschau (erste 3 Zeilen):`);
    out.push(`  ${header.join(" | ")}`);
    rows.slice(0,3).forEach(r=>out.push(`  ${r.join(" | ")}`));
    return { output: out.join("\n") };
  },
});
