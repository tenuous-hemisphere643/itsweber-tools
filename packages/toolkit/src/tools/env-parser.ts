import { defineTool } from "../core";

export default defineTool({
  id: "env-parser",
  title: ".env File Parser",
  titleDe: ".env-Datei Parser",
  description: "Parse, validate, and convert .env files to JSON, shell export, or Docker env format.",
  descriptionDe: "Parst, validiert und konvertiert .env-Dateien in JSON, Shell-Exports oder Docker-env-Format.",
  explanation: "Paste .env content. First line can be a format keyword: json, shell, docker. Otherwise shows a table of all keys and values.",
  explanationDe: "Env-Inhalt einfügen. Erste Zeile kann ein Format sein: json, shell, docker. Ansonsten wird eine Tabelle aller Schlüssel/Werte angezeigt.",
  category: "Development",
  keywords: ["env","dotenv","environment","config","parse","docker","shell","export","secret","variable"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "DB_HOST=localhost\nDB_PORT=5432\nAPP_SECRET=mysecret",
  example: "DB_HOST=localhost\nDB_PORT=5432\nNODE_ENV=production\n# Comment line\nAPI_KEY=abc123",
  useCasesDe: ["Docker-Compose env_file vorbereiten","Configs zwischen Formaten konvertieren",".env auf Fehler prüfen"],
  run: (input) => {
    const lines = input.split("\n");
    let format = "table";
    let start = 0;
    const fmt = lines[0].trim().toLowerCase();
    if (["json","shell","docker"].includes(fmt)) { format = fmt; start = 1; }
    const entries: {key: string; val: string; comment: boolean}[] = [];
    for (const raw of lines.slice(start)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) { entries.push({key:"",val:line,comment:true}); continue; }
      const eq = line.indexOf("=");
      if (eq === -1) { entries.push({key:line,val:"",comment:false}); continue; }
      const key = line.slice(0,eq).trim();
      let val = line.slice(eq+1).trim();
      if ((val.startsWith('"')&&val.endsWith('"'))||(val.startsWith("'")&&val.endsWith("'"))) val = val.slice(1,-1);
      entries.push({key,val,comment:false});
    }
    const pairs = entries.filter(e=>!e.comment && e.key);
    if (format==="json") {
      const obj: Record<string,string> = {};
      pairs.forEach(e=>obj[e.key]=e.val);
      return { output: JSON.stringify(obj, null, 2) };
    }
    if (format==="shell") return { output: pairs.map(e=>`export ${e.key}="${e.val}"`).join("\n") };
    if (format==="docker") return { output: pairs.map(e=>`  - ${e.key}=${e.val}`).join("\n") };
    const maxKey = Math.max(...pairs.map(e=>e.key.length), 3);
    const out = [`${"Schlüssel".padEnd(maxKey)}  Wert`,`${"─".repeat(maxKey)}  ${"─".repeat(30)}`];
    pairs.forEach(e=>out.push(`${e.key.padEnd(maxKey)}  ${e.val||"(leer)"}`));
    out.push(``, `${pairs.length} Variablen gefunden`);
    return { output: out.join("\n") };
  },
});
