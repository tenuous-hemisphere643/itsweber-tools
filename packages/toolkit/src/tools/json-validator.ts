import { defineTool } from "../core";

export default defineTool({
  id: "json-validator",
  title: "JSON Validator",
  titleDe: "JSON-Validator",
  description: "Validate JSON and show structure stats — keys, depth, array lengths.",
  descriptionDe: "Validiert JSON und zeigt Strukturstatistiken — Keys, Tiefe, Array-Längen.",
  explanation: "Validates JSON syntax and reports structure: total keys, max nesting depth, array counts, data types used. Shows friendly error with position on invalid JSON.",
  explanationDe: "Prüft JSON-Syntax und gibt Strukturbericht: Gesamte Keys, maximale Tiefe, Array-Anzahl, verwendete Datentypen. Zeigt freundliche Fehlermeldung mit Position.",
  category: "Development",
  keywords: ["json", "validate", "validator", "lint", "check", "struktur", "prüfen"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: '{"key": "value"}',
  example: '{"name":"itsweber-tools","version":"0.1.0","tags":["docker","ops"],"config":{"port":8080,"debug":false}}',
  useCasesDe: ["API-Antworten validieren", "JSON-Konfigs prüfen", "Fehler in verschachteltem JSON finden"],
  run: (input) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(input.trim());
    } catch (e) {
      const msg = e instanceof SyntaxError ? e.message : String(e);
      throw new Error(`Invalid JSON: ${msg}`);
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

    const rootType = Array.isArray(parsed) ? "array" : typeof parsed;

    return {
      output: [
        `✓ Valid JSON`,
        ``,
        `Root type:  ${rootType}`,
        `Keys:       ${totalKeys}`,
        `Max depth:  ${maxDepth}`,
        `Arrays:     ${arrays}`,
        `Types used: ${[...types].join(", ")}`,
        `Size:       ${input.trim().length} chars`,
        ``,
        `── Minified ──`,
        JSON.stringify(parsed),
      ].join("\n"),
    };
  },
});
