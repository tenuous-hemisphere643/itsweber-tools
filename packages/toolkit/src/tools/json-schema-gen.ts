import { defineTool } from "../core";

function jsonToSchema(val: unknown, depth=0): object {
  if (val === null) return { type: "null" };
  if (Array.isArray(val)) {
    if (!val.length) return { type: "array", items: {} };
    const items = depth < 4 ? jsonToSchema(val[0], depth+1) : {};
    return { type: "array", items };
  }
  if (typeof val === "object") {
    const props: Record<string,unknown> = {};
    for (const [k,v] of Object.entries(val as Record<string,unknown>)) {
      props[k] = depth < 4 ? jsonToSchema(v, depth+1) : {};
    }
    return { type: "object", properties: props, required: Object.keys(val as object) };
  }
  if (typeof val === "string") {
    const s = val as string;
    if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return { type: "string", format: "date-time" };
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return { type: "string", format: "date" };
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(s)) return { type: "string", format: "email" };
    if (/^https?:\/\//.test(s)) return { type: "string", format: "uri" };
    return { type: "string" };
  }
  if (typeof val === "number") return Number.isInteger(val) ? { type: "integer" } : { type: "number" };
  if (typeof val === "boolean") return { type: "boolean" };
  return {};
}

export default defineTool({
  id: "json-schema-gen",
  title: "JSON Schema Generator",
  titleDe: "JSON-Schema-Generator",
  description: "Generate a JSON Schema draft-07 from a JSON example.",
  descriptionDe: "JSON-Schema draft-07 aus einem JSON-Beispiel generieren.",
  explanation: "Paste a JSON object or array to generate a draft-07 JSON Schema. Detects formats: date, date-time, email, uri.",
  explanationDe: "JSON-Objekt oder -Array einfügen → draft-07 JSON-Schema wird generiert. Erkennt Formate: date, date-time, email, uri.",
  category: "Development",
  keywords: ["json","schema","validate","generator","draft","openapi","swagger","types","structure"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "{\"name\": \"Alice\", \"age\": 30, \"email\": \"alice@example.com\"}",
  example: "[{\"id\": 1, \"name\": \"Alice\", \"active\": true}]",
  useCasesDe: ["API-Dokumentation erstellen","Formular-Validierung generieren","OpenAPI-Schemas ableiten"],
  run: (input) => {
    let parsed: unknown;
    try { parsed = JSON.parse(input.trim()); } catch { throw new Error("Ungültiges JSON"); }
    const schema = { "$schema": "http://json-schema.org/draft-07/schema#", ...jsonToSchema(parsed) };
    return { output: JSON.stringify(schema, null, 2) };
  },
});
