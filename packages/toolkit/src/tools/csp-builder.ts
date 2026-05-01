import { defineTool } from "../core";

export default defineTool({
  id: "csp-builder",
  title: "Content Security Policy Builder",
  titleDe: "Content-Security-Policy-Builder",
  description: "Build Content-Security-Policy headers for web applications with presets and custom rules.",
  descriptionDe: "Content-Security-Policy-Header für Webanwendungen mit Vorlagen und eigenen Regeln erstellen.",
  explanation: "Enter a preset (strict, modern-spa, report-only, cdn) or build manually with directive:value lines.",
  explanationDe: "Preset eingeben (strict, modern-spa, report-only, cdn) oder manuell mit Direktive:Wert-Zeilen.",
  category: "Web",
  keywords: ["csp","content-security-policy","security","header","xss","injection","web","helmet"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "strict",
  example: "modern-spa",
  useCasesDe: ["XSS-Schutz konfigurieren","Nginx/Apache-Headers","Security-Audit vorbereiten"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const presets: Record<string,Record<string,string>> = {
      strict: {
        "default-src": "'self'",
        "script-src": "'self'",
        "style-src": "'self'",
        "img-src": "'self' data:",
        "font-src": "'self'",
        "object-src": "'none'",
        "base-uri": "'self'",
        "form-action": "'self'",
        "frame-ancestors": "'none'",
        "upgrade-insecure-requests": "",
      },
      "modern-spa": {
        "default-src": "'self'",
        "script-src": "'self' 'unsafe-inline'",
        "style-src": "'self' 'unsafe-inline'",
        "img-src": "'self' data: blob:",
        "font-src": "'self' data:",
        "connect-src": "'self'",
        "object-src": "'none'",
        "base-uri": "'self'",
      },
      cdn: {
        "default-src": "'self'",
        "script-src": "'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
        "style-src": "'self' https://cdn.jsdelivr.net 'unsafe-inline'",
        "img-src": "'self' data: https:",
        "font-src": "'self' https://fonts.gstatic.com",
        "connect-src": "'self' https://api.example.com",
        "object-src": "'none'",
      },
    };
    const directives = presets[t] || (() => {
      const d: Record<string,string> = {};
      input.split("\n").forEach(l=>{ const i=l.indexOf(":"); if(i>0) d[l.slice(0,i).trim()]=l.slice(i+1).trim(); });
      return d;
    })();
    if (!Object.keys(directives).length) throw new Error(`Unbekanntes Preset: '${t}'.\nErlaubt: strict, modern-spa, cdn\nOder direktive:wert-Paare eingeben`);
    const csp = Object.entries(directives).map(([k,v])=>v?`${k} ${v}`:k).join("; ");
    return { output: [
      `Content-Security-Policy:`,``,csp,``,
      `# Nginx:`,
      `add_header Content-Security-Policy "${csp}";`,``,
      `# Apache:`,
      `Header always set Content-Security-Policy "${csp}"`,``,
      `# HTML Meta (Einschränkungen!):`,
      `<meta http-equiv="Content-Security-Policy" content="${csp}">`,
    ].join("\n") };
  },
});
