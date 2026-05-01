import { defineTool } from "../core";

export default defineTool({
  id: "http-headers-gen",
  title: "HTTP Security Headers",
  titleDe: "HTTP-Sicherheits-Header",
  description: "Generate recommended HTTP security headers for web servers (Nginx, Apache, Next.js).",
  descriptionDe: "Empfohlene HTTP-Sicherheits-Header für Webserver generieren (Nginx, Apache, Next.js).",
  explanation: "Enter a target: nginx, apache, nextjs, or express. Optional: 'strict' for maximum security profile.",
  explanationDe: "Ziel eingeben: nginx, apache, nextjs oder express. Optional: 'strict' für maximales Sicherheitsprofil.",
  category: "Web",
  keywords: ["http","security","headers","hsts","csp","nginx","apache","nextjs","express","cors","xss"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "nginx",
  example: "nginx strict",
  useCasesDe: ["Webserver sicher konfigurieren","Security-Headers prüfen","HSTS aktivieren"],
  run: (input) => {
    const parts = input.trim().toLowerCase().split(/\s+/);
    const target = parts[0];
    const strict = parts.includes("strict");

    const headers: [string, string][] = [
      ["Strict-Transport-Security", `max-age=${strict ? "63072000" : "31536000"}; includeSubDomains${strict ? "; preload" : ""}`],
      ["X-Content-Type-Options", "nosniff"],
      ["X-Frame-Options", strict ? "DENY" : "SAMEORIGIN"],
      ["X-XSS-Protection", "1; mode=block"],
      ["Referrer-Policy", strict ? "no-referrer" : "strict-origin-when-cross-origin"],
      ["Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()"],
      ["Content-Security-Policy", strict
        ? "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'"
        : "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:"],
      ["Cross-Origin-Opener-Policy", "same-origin"],
      ["Cross-Origin-Resource-Policy", "same-origin"],
    ];

    if (target === "nginx") {
      const lines = [
        `# Nginx HTTP Security Headers${strict ? " (Strict)" : ""}`,
        `# In server{} oder location{} Block einfügen:`,
        ``,
        ...headers.map(([k, v]) => `add_header ${k} "${v}" always;`),
        ``,
        `# Server-Token verstecken (in nginx.conf → http{}):`,
        `# server_tokens off;`,
      ];
      return { output: lines.join("\n") };
    }

    if (target === "apache") {
      const lines = [
        `# Apache HTTP Security Headers${strict ? " (Strict)" : ""}`,
        `# In .htaccess oder VirtualHost einfügen:`,
        ``,
        `<IfModule mod_headers.c>`,
        ...headers.map(([k, v]) => `  Header always set ${k} "${v}"`),
        `</IfModule>`,
        ``,
        `# ServerTokens Prod  # in httpd.conf`,
        `# ServerSignature Off`,
      ];
      return { output: lines.join("\n") };
    }

    if (target === "nextjs") {
      const lines = [
        `// next.config.js — HTTP Security Headers${strict ? " (Strict)" : ""}`,
        `const securityHeaders = [`,
        ...headers.map(([k, v]) => `  { key: "${k}", value: "${v}" },`),
        `];`,
        ``,
        `module.exports = {`,
        `  async headers() {`,
        `    return [{ source: "/(.*)", headers: securityHeaders }];`,
        `  },`,
        `};`,
      ];
      return { output: lines.join("\n") };
    }

    if (target === "express") {
      const lines = [
        `// Express.js — HTTP Security Headers${strict ? " (Strict)" : ""}`,
        `// npm install helmet`,
        `import helmet from "helmet";`,
        ``,
        `app.use(helmet({`,
        `  hsts: { maxAge: ${strict ? 63072000 : 31536000}, includeSubDomains: true${strict ? ", preload: true" : ""} },`,
        `  frameguard: { action: "${strict ? "deny" : "sameorigin"}" },`,
        `  contentSecurityPolicy: { directives: {`,
        `    defaultSrc: ["'self'"],`,
        strict ? `    scriptSrc: ["'self'"],` : `    scriptSrc: ["'self'", "'unsafe-inline'"],`,
        `  }},`,
        `  referrerPolicy: { policy: "${strict ? "no-referrer" : "strict-origin-when-cross-origin"}" },`,
        `}));`,
        ``,
        `// Oder manuell:`,
        ...headers.map(([k, v]) => `app.use((_, res, next) => { res.setHeader("${k}", "${v}"); next(); });`),
      ];
      return { output: lines.join("\n") };
    }

    return { output: [
      `HTTP Security Headers${strict ? " (Strict)" : ""}`,
      ``,
      ...headers.map(([k, v]) => `${k}:\n  ${v}`),
      ``,
      `Unterstützte Ziele: nginx, apache, nextjs, express`,
    ].join("\n") };
  },
});
