import { defineTool } from "../core";

export default defineTool({
  id: "string-escape",
  title: "String Escape / Unescape",
  titleDe: "String Escape / Unescape",
  description: "Escape or unescape strings for JSON, JavaScript, SQL, and regex — auto-detected.",
  descriptionDe: "Escapet oder unescapet Strings für JSON, JavaScript, SQL und Regex — Richtung wird erkannt.",
  explanation: "Paste raw text to escape special characters, or paste escaped text (containing \\n, \\t, \\\") to unescape. Shows results for JSON, JS, SQL, and regex contexts.",
  explanationDe: "Rohtext → Escape-Zeichen einfügen. Escape-Text (mit \\n, \\t, \\\") → rückwandeln. Zeigt Ergebnisse für JSON, JS, SQL und Regex.",
  category: "Text",
  keywords: ["escape","unescape","string","json","javascript","sql","regex","newline","backslash","quote","anführungszeichen"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "Text mit \"Anführungszeichen\" und\nZeilenumbrüchen",
  example: 'Hello "World"\nNew line\tTab',
  useCasesDe: ["Strings in JSON-Payloads einbetten","SQL-Werte escapen","Regex-Sonderzeichen maskieren"],
  run: (input) => {
    const hasEscapes = /\\[ntr"'\\]/.test(input);
    if (hasEscapes) {
      const unescaped = input.replace(/\\n/g,"\n").replace(/\\t/g,"\t").replace(/\\r/g,"\r").replace(/\\"/g,'"').replace(/\\'/g,"'").replace(/\\\\/g,"\\");
      return { output: [`Modus:   Unescape`,``,unescaped].join("\n") };
    }
    const json = input.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t");
    const sql = input.replace(/'/g,"''").replace(/\\/g,"\\\\");
    const regex = input.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
    return { output: [
      `Modus:   Escape`,``,
      `JSON / JS:`,`  "${json}"`,``,
      `SQL (single-quoted):`,`  '${sql}'`,``,
      `Regex:`,`  ${regex}`,
    ].join("\n") };
  },
});
