import { defineTool } from "../core";

export default defineTool({
  id: "table-format",
  title: "Table Formatter",
  titleDe: "Tabellen-Formatierer",
  description: "Convert CSV or tab-separated data to ASCII table, Markdown table, or HTML table.",
  descriptionDe: "CSV oder Tab-getrennte Daten in ASCII-Tabelle, Markdown-Tabelle oder HTML-Tabelle konvertieren.",
  explanation: "First line: output format (ascii, markdown, html). Rest: CSV or tab-separated data. First row = header.",
  explanationDe: "Erste Zeile: Ausgabeformat (ascii, markdown, html). Rest: CSV oder Tab-getrennte Daten. Erste Zeile = Kopfzeile.",
  category: "Data",
  keywords: ["table","tabelle","csv","markdown","html","ascii","format","data","spalten"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "markdown\nName,Alter,Stadt\nAlice,30,Berlin\nBob,25,Hamburg",
  example: "ascii\nTool,Kategorie,Status\nSubnet Calc,Network,ready\nJWT Decoder,Crypto,ready",
  useCasesDe: ["README-Tabellen erstellen","CSV als Markdown exportieren","Daten für Berichte formatieren"],
  run: (input) => {
    const lines = input.trim().split("\n");
    const fmt = lines[0].trim().toLowerCase();
    if (!["ascii","markdown","html"].includes(fmt)) throw new Error("Erstes Format: ascii, markdown oder html");
    const rows = lines.slice(1).filter(l=>l.trim()).map(l=>l.includes("\t")?l.split("\t"):l.split(","));
    if (rows.length < 1) throw new Error("Keine Daten");
    const header = rows[0];
    const data = rows.slice(1);
    const cols = header.length;
    const widths = Array.from({length:cols},(_,i)=>Math.max(header[i]?.length??0,...data.map(r=>r[i]?.length??0)));
    if (fmt==="markdown") {
      const h = `| ${header.map((c,i)=>c.padEnd(widths[i])).join(" | ")} |`;
      const sep = `| ${widths.map(w=>"-".repeat(w)).join(" | ")} |`;
      const body = data.map(r=>`| ${r.map((c,i)=>c.padEnd(widths[i])).join(" | ")} |`);
      return { output: [h,sep,...body].join("\n") };
    }
    if (fmt==="html") {
      const th = header.map(c=>`    <th>${c}</th>`).join("\n");
      const tbody = data.map(r=>`  <tr>\n${r.map(c=>`    <td>${c}</td>`).join("\n")}\n  </tr>`).join("\n");
      return { output: `<table>\n  <thead>\n  <tr>\n${th}\n  </tr>\n  </thead>\n  <tbody>\n${tbody}\n  </tbody>\n</table>` };
    }
    const sep = `+${widths.map(w=>"-".repeat(w+2)).join("+")}+`;
    const h = `| ${header.map((c,i)=>c.padEnd(widths[i])).join(" | ")} |`;
    const body = data.map(r=>`| ${r.map((c,i)=>(c||"").padEnd(widths[i])).join(" | ")} |`);
    return { output: [sep,h,sep,...body,sep].join("\n") };
  },
});
