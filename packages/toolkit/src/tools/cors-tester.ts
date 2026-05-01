import { defineTool } from "../core";

export default defineTool({
  id: "cors-tester",
  title: "CORS Header Analyzer",
  titleDe: "CORS-Header-Analysierer",
  description: "Analyze CORS headers and generate server-side CORS configuration for common frameworks.",
  descriptionDe: "CORS-Header analysieren und Server-seitige CORS-Konfiguration für gängige Frameworks generieren.",
  explanation: "Enter 'generate' followed by origin, methods, headers, credentials. Without 'generate', shows CORS basics overview.",
  explanationDe: "'generate' gefolgt von origin, methods, headers, credentials eingeben. Ohne 'generate' werden CORS-Grundlagen angezeigt.",
  category: "Web",
  keywords: ["cors","header","cross-origin","security","api","nginx","express","allow","preflight"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "generate\norigin: https://app.example.com\nmethods: GET,POST,PUT,DELETE\ncredentials: true",
  example: "generate\norigin: *\nmethods: GET,POST",
  useCasesDe: ["CORS-Fehler debuggen","API-CORS konfigurieren","Preflight-Requests verstehen"],
  run: (input) => {
    const lines = input.trim().split("\n");
    const cmd = lines[0].trim().toLowerCase();
    const kv: Record<string,string> = {};
    lines.slice(1).forEach(l=>{ const i=l.indexOf(":"); if(i>0) kv[l.slice(0,i).trim().toLowerCase()]=l.slice(i+1).trim(); });
    if (cmd==="generate") {
      const origin = kv.origin || "*";
      const methods = kv.methods || "GET, POST, PUT, DELETE, OPTIONS";
      const headers = kv.headers || "Authorization, Content-Type";
      const creds = kv.credentials === "true";
      const maxAge = kv.max_age || "86400";
      if (creds && origin === "*") return { output: `⚠ ACHTUNG: Access-Control-Allow-Credentials: true ist NICHT kompatibel mit Allow-Origin: *\nBitte eine spezifische Origin verwenden!` };
      return { output: [
        `# HTTP Response Headers:`,
        `Access-Control-Allow-Origin: ${origin}`,
        `Access-Control-Allow-Methods: ${methods}`,
        `Access-Control-Allow-Headers: ${headers}`,
        creds ? `Access-Control-Allow-Credentials: true` : "",
        `Access-Control-Max-Age: ${maxAge}`,``,
        `# Nginx:`,
        `add_header Access-Control-Allow-Origin "${origin}";`,
        `add_header Access-Control-Allow-Methods "${methods}";`,
        `add_header Access-Control-Allow-Headers "${headers}";`,``,
        `# Node.js / Express:`,
        `app.use(cors({`,
        `  origin: ${origin==="*"?"'*'":JSON.stringify(origin.split(",").map(s=>s.trim()))},`,
        `  methods: [${methods.split(",").map(m=>`'${m.trim()}'`).join(",")}],`,
        creds?`  credentials: true,`:"",
        `}));`,
      ].filter(l=>l!=="").join("\n") };
    }
    return { output: [
      `CORS-Grundlagen:`,``,
      `Simple Request (kein Preflight):`,
      `  Methoden: GET, HEAD, POST`,
      `  Headers: Accept, Content-Type (text/plain, multipart, urlencoded)`,``,
      `Preflight (OPTIONS) wird ausgelöst bei:`,
      `  Andere Methoden (PUT, DELETE, PATCH)`,
      `  Custom Headers (Authorization, X-Custom-...)`,
      `  Content-Type: application/json`,``,
      `Wichtige Headers:`,
      `  Access-Control-Allow-Origin  — Erlaubte Origin (oder *)`,
      `  Access-Control-Allow-Methods — Erlaubte HTTP-Methoden`,
      `  Access-Control-Allow-Headers — Erlaubte Request-Headers`,
      `  Access-Control-Max-Age       — Preflight-Cache in Sekunden`,
      `  Access-Control-Allow-Credentials — Cookie-Weitergabe`,
      ``,
      `Für Konfiguration: 'generate' als erste Zeile verwenden.`,
    ].join("\n") };
  },
});
