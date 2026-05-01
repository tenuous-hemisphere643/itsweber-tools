import { defineTool } from "../core";

function isMinified(s: string): boolean {
  return !s.includes("\n") && s.length > 20;
}

export default defineTool({
  id: "json-format",
  title: "JSON Formatter / Minifier",
  titleDe: "JSON Formatter / Minifier",
  description: "Format (pretty-print) or minify JSON — auto-detected. Also validates and shows stats.",
  descriptionDe: "Formatiert (Pretty-Print) oder minifiziert JSON — Richtung wird automatisch erkannt. Validiert und zeigt Strukturstatistiken.",
  explanation:
    "Paste minified JSON to pretty-print it with 2-space indentation. Paste already-formatted JSON to minify it. Direction is auto-detected: multi-line input → minify, single-line → format. Also reports key count, depth, and types.",
  explanationDe:
    "Minifiziertes JSON → Pretty-Print mit 2 Leerzeichen. Bereits formatiertes JSON → Minify. Richtung wird automatisch erkannt: mehrzeilige Eingabe → Minify, einzeilig → Formatieren. Zeigt Schlüsselanzahl, Tiefe und Typen.",
  category: "Development",
  keywords: ["json", "format", "pretty", "print", "minify", "minifizieren", "formatieren", "validate", "validieren", "lint"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "JSON einfügen — Richtung wird erkannt",
  example: '{"name":"ItsWeber Tools","docker":true,"tags":["ops","local","offline"]}',
  useCasesDe: [
    "API-Antworten lesbar machen",
    "JSON vor dem Deployment komprimieren",
    "Konfigurationsdateien prüfen und strukturieren",
  ],
  run: (input) => {
    let parsed: unknown;
    try { parsed = JSON.parse(input.trim()); }
    catch (e) {
      const msg = e instanceof SyntaxError ? e.message : String(e);
      throw new Error(`Ungültiges JSON: ${msg}`);
    }

    let totalKeys = 0, maxDepth = 0, arrays = 0;
    const types = new Set<string>();
    function walk(val: unknown, depth: number) {
      maxDepth = Math.max(maxDepth, depth);
      types.add(val === null ? "null" : Array.isArray(val) ? "array" : typeof val);
      if (Array.isArray(val)) { arrays++; val.forEach((v) => walk(v, depth + 1)); }
      else if (typeof val === "object" && val !== null) {
        const keys = Object.keys(val as object);
        totalKeys += keys.length;
        keys.forEach((k) => walk((val as Record<string, unknown>)[k], depth + 1));
      }
    }
    walk(parsed, 0);

    const minified = JSON.stringify(parsed);
    const pretty = JSON.stringify(parsed, null, 2);

    if (isMinified(input.trim())) {
      return {
        output: [
          `Modus:   Format  (minifiziert → Pretty-Print)`,
          `Keys: ${totalKeys}  ·  Tiefe: ${maxDepth}  ·  Arrays: ${arrays}  ·  Typen: ${[...types].join(", ")}`,
          ``,
          pretty,
        ].join("\n"),
        rawOutput: pretty,
      };
    }
    return {
      output: [
        `Modus:   Minify  (formatiert → einzeilig)`,
        `Keys: ${totalKeys}  ·  Tiefe: ${maxDepth}  ·  ${input.trim().length} → ${minified.length} Zeichen`,
        ``,
        minified,
      ].join("\n"),
      rawOutput: minified,
    };
  },
});
