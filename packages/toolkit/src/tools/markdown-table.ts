import { defineTool } from "../core";

export default defineTool({
  id: "markdown-table",
  title: "Markdown Table Builder",
  titleDe: "Markdown-Tabellen-Builder",
  description: "Build Markdown tables from raw data or align/format existing Markdown tables.",
  descriptionDe: "Markdown-Tabellen aus Rohdaten erstellen oder bestehende Markdown-Tabellen ausrichten/formatieren.",
  explanation: "Paste CSV data (comma-separated with header) OR paste an existing Markdown table to align it. First row = headers.",
  explanationDe: "CSV-Daten einfügen (kommagetrennt mit Kopfzeile) ODER bestehende Markdown-Tabelle einfügen um sie auszurichten. Erste Zeile = Kopfzeilen.",
  category: "Text",
  keywords: ["markdown","table","tabelle","align","format","csv","readme","documentation"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "Name,Alter,Stadt\nAlice,30,Berlin\nBob,25,Hamburg",
  example: "Tool | Kategorie | Status\nSubnet Calc | Network | ready\nJWT Decoder | Crypto | ready",
  useCasesDe: ["README-Tabellen erstellen","Docs-Tabellen ausrichten","CSV als Markdown"],
  run: (input) => {
    const lines = input.trim().split("\n");
    const sep = lines[0].includes("|") ? "|" : ",";
    const rows = lines.map(l=>l.split(sep).map(c=>c.trim().replace(/^\||\|$/g,"")));
    const maxCols = Math.max(...rows.map(r=>r.length));
    const normRows = rows.map(r=>{ while(r.length<maxCols) r.push(""); return r; });
    const widths = Array.from({length:maxCols},(_,i)=>Math.max(...normRows.map(r=>(r[i]||"").length),3));
    const fmtRow = (r: string[]) => `| ${r.map((c,i)=>c.padEnd(widths[i])).join(" | ")} |`;
    const sepRow = `| ${widths.map(w=>"-".repeat(w)).join(" | ")} |`;
    const [header,...data] = normRows;
    return { output: [fmtRow(header),sepRow,...data.map(fmtRow)].join("\n") };
  },
});
