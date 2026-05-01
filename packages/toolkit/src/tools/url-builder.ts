import { defineTool } from "../core";

export default defineTool({
  id: "url-builder",
  title: "URL Builder / Parser",
  titleDe: "URL-Builder / Parser",
  description: "Build URLs from components or parse URLs to components — bidirectional.",
  descriptionDe: "URLs aus Komponenten zusammenbauen oder URLs in Komponenten zerlegen — bidirektional.",
  explanation: "Paste a URL to parse it, or enter key:value pairs (scheme, host, path, query params) to build a URL.",
  explanationDe: "URL einfügen → parsen. Schlüssel:Wert-Paare eingeben → URL bauen.",
  category: "Web",
  keywords: ["url","parse","build","query","params","path","hash","scheme","host","link"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "https://api.example.com/v1/users?page=1&limit=20#results",
  example: "scheme: https\nhost: api.example.com\npath: /v1/users\npage: 1\nlimit: 20",
  useCasesDe: ["API-URLs zusammenbauen","Query-Parameter analysieren","URLs debuggen"],
  run: (input) => {
    const t = input.trim();
    if (t.startsWith("http://") || t.startsWith("https://") || t.startsWith("//")) {
      try {
        const u = new URL(t.startsWith("//")?"https:"+t:t);
        const params = [...u.searchParams.entries()];
        const out = [
          `Schema:    ${u.protocol.replace(":","") }`,
          u.username ? `User:      ${u.username}` : null,
          u.password ? `Passwort:  ${"*".repeat(u.password.length)}` : null,
          `Host:      ${u.hostname}`,
          u.port ? `Port:      ${u.port}` : null,
          `Pfad:      ${u.pathname}`,
          params.length ? `\nQuery-Parameter:` : null,
          ...params.map(([k,v])=>`  ${k} = ${v}`),
          u.hash ? `\nHash:      ${u.hash}` : null,
          `\nVollständige URL: ${u.toString()}`,
        ].filter(l=>l!==null);
        return { output: out.join("\n") };
      } catch { throw new Error("Ungültige URL"); }
    }
    const kv: Record<string,string[]> = {};
    for (const line of t.split("\n")) {
      const i = line.indexOf(":");
      if (i < 0) continue;
      const k = line.slice(0,i).trim().toLowerCase();
      const v = line.slice(i+1).trim();
      if (!kv[k]) kv[k]=[];
      kv[k].push(v);
    }
    const scheme = kv.scheme?.[0] || kv.protocol?.[0] || "https";
    const host = kv.host?.[0] || kv.hostname?.[0] || "";
    if (!host) throw new Error("'host' ist erforderlich");
    const path = kv.path?.[0] || "/";
    const reserved = new Set(["scheme","protocol","host","hostname","path","hash","port","user","password"]);
    const params = Object.entries(kv).filter(([k])=>!reserved.has(k)).map(([k,vs])=>vs.map(v=>`${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&")).join("&");
    const port = kv.port?.[0] ? `:${kv.port[0]}` : "";
    const hash = kv.hash?.[0] ? `#${kv.hash[0]}` : "";
    const url = `${scheme}://${host}${port}${path}${params?"?"+params:""}${hash}`;
    return { output: url };
  },
});
