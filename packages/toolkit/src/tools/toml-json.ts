import { defineTool } from "../core";

export default defineTool({
  id: "toml-json",
  title: "TOML ↔ JSON Converter",
  titleDe: "TOML ↔ JSON Konverter",
  description: "Convert between TOML and JSON formats — auto-detected.",
  descriptionDe: "Zwischen TOML und JSON konvertieren — Richtung wird automatisch erkannt.",
  explanation: "Paste JSON to convert to TOML, or TOML to convert to JSON. JSON starts with { or [.",
  explanationDe: "JSON einfügen → TOML. TOML einfügen → JSON. JSON beginnt mit { oder [.",
  category: "Converter",
  keywords: ["toml","json","convert","konvertieren","config","cargo","rust","pyproject"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "[database]\nhost = \"localhost\"\nport = 5432",
  example: "{\"database\": {\"host\": \"localhost\", \"port\": 5432}}",
  useCasesDe: ["Cargo.toml aus JSON erzeugen","Config-Formate konvertieren","pyproject.toml bearbeiten"],
  run: (input) => {
    const t = input.trim();
    const isJson = t.startsWith("{") || t.startsWith("[");
    if (isJson) {
      let parsed: unknown;
      try { parsed = JSON.parse(t); } catch { throw new Error("Ungültiges JSON"); }
      const toToml = (obj: unknown, prefix=""): string => {
        if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return "";
        const record = obj as Record<string,unknown>;
        const scalars: string[] = [];
        const tables: string[] = [];
        for (const [k, v] of Object.entries(record)) {
          if (v === null) { scalars.push(`${k} = "null"`); }
          else if (typeof v === "boolean") { scalars.push(`${k} = ${v}`); }
          else if (typeof v === "number") { scalars.push(`${k} = ${v}`); }
          else if (typeof v === "string") { scalars.push(`${k} = "${v.replace(/\\/g,"\\\\").replace(/"/g,'\\"')}"`); }
          else if (Array.isArray(v)) {
            if (v.every(i=>typeof i !== "object")) { scalars.push(`${k} = [${v.map(i=>typeof i==="string"?`"${i}"`:i).join(", ")}]`); }
            else { v.forEach(item=>{ tables.push(`\n[[${prefix?prefix+".":""}${k}]]`); tables.push(toToml(item, prefix?prefix+"."+k:k)); }); }
          }
          else if (typeof v === "object") {
            tables.push(`\n[${prefix?prefix+".":""}${k}]`);
            tables.push(toToml(v, prefix?prefix+"."+k:k));
          }
        }
        return [...scalars,...tables].join("\n");
      };
      return { output: [`Modus: JSON → TOML`,``,toToml(parsed)].join("\n") };
    }
    const obj: Record<string,unknown> = {};
    let current = obj;
    let currentKey = "";
    const lines = t.split("\n");
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const headerM = line.match(/^\[([^\]]+)\]$/);
      if (headerM) {
        currentKey = headerM[1];
        const parts = currentKey.split(".");
        let node: Record<string,unknown> = obj;
        for (const p of parts) { if (!node[p]) node[p]={}; node = node[p] as Record<string,unknown>; }
        current = node;
        continue;
      }
      const eqIdx = line.indexOf("=");
      if (eqIdx < 0) continue;
      const key = line.slice(0,eqIdx).trim();
      const valRaw = line.slice(eqIdx+1).trim();
      let val: unknown = valRaw;
      if (valRaw==="true") val=true;
      else if (valRaw==="false") val=false;
      else if (!isNaN(Number(valRaw))) val=Number(valRaw);
      else if ((valRaw.startsWith('"')&&valRaw.endsWith('"'))||(valRaw.startsWith("'")&&valRaw.endsWith("'"))) val=valRaw.slice(1,-1);
      else if (valRaw.startsWith("[")&&valRaw.endsWith("]")) { try { val=JSON.parse(valRaw.replace(/'/g,'"')); } catch { val=valRaw; } }
      current[key] = val;
    }
    return { output: [`Modus: TOML → JSON`,``,JSON.stringify(obj,null,2)].join("\n") };
  },
});
