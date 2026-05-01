import { defineTool } from "../core";

export default defineTool({
  id: "json-to-table",
  title: "JSON to Table",
  titleDe: "JSON zu Tabelle",
  description: "Convert a JSON array of objects to ASCII, Markdown, or CSV table.",
  descriptionDe: "JSON-Array von Objekten in ASCII-, Markdown- oder CSV-Tabelle konvertieren.",
  explanation: "First line: output format (ascii, markdown, csv). Then paste a JSON array of objects.",
  explanationDe: "Erste Zeile: Ausgabeformat (ascii, markdown, csv). Dann JSON-Array von Objekten einfügen.",
  category: "Data",
  keywords: ["json","table","tabelle","csv","markdown","ascii","convert","data","array"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "markdown\n[{\"name\":\"Alice\",\"age\":30},{\"name\":\"Bob\",\"age\":25}]",
  example: "ascii\n[{\"tool\":\"subnet-calc\",\"category\":\"Network\"},{\"tool\":\"jwt-decoder\",\"category\":\"Crypto\"}]",
  useCasesDe: ["API-Antworten tabellarisch darstellen","JSON-Arrays als CSV exportieren","Daten für Reports aufbereiten"],
  run: (input) => {
    const nl = input.indexOf("\n");
    let fmt = "ascii", json = input;
    if (nl > -1) {
      const first = input.slice(0,nl).trim().toLowerCase();
      if (["ascii","markdown","csv"].includes(first)) { fmt = first; json = input.slice(nl+1).trim(); }
    }
    let data: Record<string,unknown>[];
    try { data = JSON.parse(json); } catch { throw new Error("Ungültiges JSON"); }
    if (!Array.isArray(data)) throw new Error("JSON muss ein Array sein");
    if (!data.length) throw new Error("Leeres Array");
    const headers = [...new Set(data.flatMap(r=>Object.keys(r)))];
    const rows = data.map(r=>headers.map(h=>String(r[h]??"")));
    if (fmt==="csv") {
      const csvRow = (cols: string[]) => cols.map(c=>c.includes(",")?"\""+c+"\"":c).join(",");
      return { output: [csvRow(headers),...rows.map(csvRow)].join("\n") };
    }
    const widths = headers.map((h,i)=>Math.max(h.length,...rows.map(r=>r[i].length)));
    if (fmt==="markdown") {
      const h = `| ${headers.map((c,i)=>c.padEnd(widths[i])).join(" | ")} |`;
      const sep = `| ${widths.map(w=>"-".repeat(w)).join(" | ")} |`;
      return { output: [h,sep,...rows.map(r=>`| ${r.map((c,i)=>c.padEnd(widths[i])).join(" | ")} |`)].join("\n") };
    }
    const sep = `+${widths.map(w=>"-".repeat(w+2)).join("+")}+`;
    const h = `| ${headers.map((c,i)=>c.padEnd(widths[i])).join(" | ")} |`;
    return { output: [sep,h,sep,...rows.map(r=>`| ${r.map((c,i)=>c.padEnd(widths[i])).join(" | ")} |`),sep].join("\n") };
  },
});
