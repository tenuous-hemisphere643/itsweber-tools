import { defineTool } from "../core";

export default defineTool({
  id: "curl-builder",
  title: "cURL Command Builder",
  titleDe: "cURL-Befehl-Builder",
  description: "Build curl commands from HTTP method, URL, headers, and body.",
  descriptionDe: "curl-Befehle aus HTTP-Methode, URL, Headern und Body zusammenbauen.",
  explanation: "Enter one option per line. Keys: method, url, header, body, auth, bearer, content-type, timeout.",
  explanationDe: "Eine Option pro Zeile. Schlüssel: method, url, header, body, auth, bearer, content-type, timeout.",
  category: "Web",
  keywords: ["curl","http","request","api","post","get","header","bearer","auth","rest"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "method: POST\nurl: https://api.example.com/users\ncontent-type: application/json\nbody: {\"name\": \"Alice\"}",
  example: "method: GET\nurl: https://api.example.com/health\nbearer: mytoken123",
  useCasesDe: ["API-Anfragen testen","Shell-Skripte vorbereiten","HTTP-Debugging"],
  run: (input) => {
    const lines = input.split("\n");
    const kv: Record<string,string[]> = {};
    for (const line of lines) {
      const i = line.indexOf(":");
      if (i<0) continue;
      const k = line.slice(0,i).trim().toLowerCase();
      const v = line.slice(i+1).trim();
      if (!kv[k]) kv[k]=[];
      kv[k].push(v);
    }
    const method = (kv.method?.[0]||"GET").toUpperCase();
    const url = kv.url?.[0]||"";
    if (!url) throw new Error("'url' ist erforderlich");
    const parts: string[] = [`curl -X ${method}`];
    if (kv["content-type"]) parts.push(`  -H "Content-Type: ${kv["content-type"][0]}"`);
    if (kv.bearer) parts.push(`  -H "Authorization: Bearer ${kv.bearer[0]}"`);
    if (kv.auth) parts.push(`  -u "${kv.auth[0]}"`);
    (kv.header||[]).forEach(h=>parts.push(`  -H "${h}"`));
    if (kv.body) {
      const body = kv.body.join("\n");
      parts.push(`  -d '${body.replace(/'/g,"'\\''")}'`);
    }
    if (kv.timeout) parts.push(`  --max-time ${kv.timeout[0]}`);
    parts.push(`  "${url}"`);
    return { output: parts.join(" \\\n") };
  },
});
