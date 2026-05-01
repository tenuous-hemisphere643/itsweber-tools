import { defineTool } from "../core";

function getPath(obj: unknown, path: string): unknown {
  const parts = path.replace(/\[(\d+)\]/g,".$1").split(".").filter(Boolean);
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur === null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string,unknown>)[p];
  }
  return cur;
}

export default defineTool({
  id: "json-query",
  title: "JSON Query / Path Extractor",
  titleDe: "JSON-Query / Pfad-Extraktor",
  description: "Extract values from JSON using dot-notation paths or simple key search.",
  descriptionDe: "Werte aus JSON mit Punkt-Notation-Pfaden oder einfacher Schlüsselsuche extrahieren.",
  explanation: "First line: dot-path like 'user.address.city' or '[0].name' or 'search:keyname'. Second+ lines: JSON.",
  explanationDe: "Erste Zeile: Punkt-Pfad wie 'user.address.city' oder '[0].name' oder 'search:schlüssel'. Folgende Zeilen: JSON.",
  category: "Data",
  keywords: ["json","query","path","extract","jq","dot","filter","data","key","search"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "user.address.city\n{\"user\":{\"name\":\"Alice\",\"address\":{\"city\":\"Berlin\"}}}",
  example: "[0].name\n[{\"name\":\"Alice\",\"age\":30},{\"name\":\"Bob\",\"age\":25}]",
  useCasesDe: ["API-Antworten analysieren","JSON-Werte extrahieren","Verschachtelte Daten navigieren"],
  run: (input) => {
    const nl = input.indexOf("\n");
    if (nl===-1) throw new Error("Erste Zeile: Pfad oder 'search:schlüssel', dann JSON");
    const query = input.slice(0,nl).trim();
    const jsonStr = input.slice(nl+1).trim();
    let parsed: unknown;
    try { parsed = JSON.parse(jsonStr); } catch { throw new Error("Ungültiges JSON"); }
    if (query.startsWith("search:")) {
      const key = query.slice(7).trim().toLowerCase();
      const results: string[] = [];
      const search = (obj: unknown, path: string) => {
        if (typeof obj !== "object" || !obj) return;
        for (const [k,v] of Object.entries(obj as Record<string,unknown>)) {
          const newPath = path ? `${path}.${k}` : k;
          if (k.toLowerCase().includes(key)) results.push(`${newPath}: ${JSON.stringify(v)}`);
          if (typeof v==="object") search(v, newPath);
        }
      };
      search(parsed, "");
      if (!results.length) return { output: `Kein Schlüssel '${key}' gefunden` };
      return { output: results.join("\n") };
    }
    const val = getPath(parsed, query);
    if (val === undefined) return { output: `Pfad '${query}' nicht gefunden` };
    return { output: typeof val==="object" ? JSON.stringify(val, null, 2) : String(val) };
  },
});
