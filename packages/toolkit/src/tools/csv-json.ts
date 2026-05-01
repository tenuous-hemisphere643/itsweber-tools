import { defineTool } from "../core";

// ── CSV → JSON ──

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let field = "", inQuotes = false;
  const current: string[] = [];
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"' && input[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else field += ch;
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ',') { current.push(field); field = ""; }
      else if (ch === '\n' || (ch === '\r' && input[i + 1] === '\n')) {
        if (ch === '\r') i++;
        current.push(field); field = "";
        if (current.some((c) => c.trim())) { rows.push([...current]); }
        current.length = 0;
      } else field += ch;
    }
  }
  if (field || current.length) { current.push(field); if (current.some((c) => c.trim())) rows.push([...current]); }
  return rows;
}

function csvToJson(input: string): string {
  const rows = parseCsv(input.trim());
  if (rows.length < 2) throw new Error("Mindestens eine Kopfzeile und eine Datenzeile erforderlich.");
  const [headers, ...dataRows] = rows;
  const objects = dataRows.map((row) =>
    Object.fromEntries(headers.map((h, i) => [h.trim(), row[i]?.trim() ?? ""]))
  );
  return JSON.stringify(objects, null, 2);
}

// ── JSON → CSV ──

function escapeField(v: unknown): string {
  const s = String(v ?? "");
  return /[,"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function jsonToCsv(input: string): string {
  let parsed: unknown;
  try { parsed = JSON.parse(input.trim()); } catch { throw new Error("Ungültiges JSON."); }
  if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Eingabe muss ein nicht-leeres JSON-Array sein.");
  if (typeof parsed[0] !== "object" || parsed[0] === null) throw new Error("Array-Elemente müssen Objekte sein.");
  const headers = Object.keys(parsed[0] as object);
  const rows = (parsed as Record<string, unknown>[]).map((obj) =>
    headers.map((h) => escapeField(obj[h])).join(",")
  );
  return [headers.map(escapeField).join(","), ...rows].join("\n");
}

// ── Auto-detect ──

function isLikelyJson(s: string): boolean {
  const t = s.trim();
  return t.startsWith("[") || t.startsWith("{");
}

export default defineTool({
  id: "csv-json",
  title: "CSV ↔ JSON Converter",
  titleDe: "CSV ↔ JSON Konverter",
  description: "Convert CSV to JSON array or JSON array back to CSV — auto-detected.",
  descriptionDe: "Wandelt CSV in ein JSON-Array oder ein JSON-Array zurück in CSV — Richtung wird automatisch erkannt.",
  explanation:
    "Paste CSV (comma-separated, first row = headers) to get a JSON array of objects. Or paste a JSON array of flat objects to get CSV. Direction is auto-detected from the first character.",
  explanationDe:
    "CSV einfügen (kommagetrennt, erste Zeile = Spaltenköpfe) → JSON-Array. JSON-Array flacher Objekte einfügen → CSV. Richtung wird anhand des ersten Zeichens erkannt.",
  category: "Converter",
  keywords: ["csv", "json", "convert", "konvertieren", "tabelle", "table", "import", "export", "data", "daten"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "CSV oder JSON einfügen — Richtung wird erkannt",
  example: "name,age,city\nAlice,30,Berlin\nBob,25,Hamburg",
  useCasesDe: [
    "Export-Daten in API-Payloads umwandeln",
    "JSON-Antworten als Tabelle exportieren",
    "Datenbank-Imports vorbereiten",
  ],
  run: (input) => {
    const trimmed = input.trim();
    if (isLikelyJson(trimmed)) {
      const csv = jsonToCsv(trimmed);
      return {
        output: [`Modus:   JSON → CSV`, ``, csv].join("\n"),
      };
    }
    const json = csvToJson(trimmed);
    return {
      output: [`Modus:   CSV → JSON`, ``, json].join("\n"),
    };
  },
});
