import { defineTool } from "../core";

export default defineTool({
  id: "htaccess-gen",
  title: ".htaccess Generator",
  titleDe: ".htaccess-Generator",
  description: "Generate Apache .htaccess rules for redirects, HTTPS enforcement, CORS, caching, and security headers.",
  descriptionDe: "Apache .htaccess-Regeln für Redirects, HTTPS, CORS, Caching und Security-Header generieren.",
  explanation: "First line is a recipe keyword: https, www, no-www, redirect, cors, cache, security, spa. Some need extra info — see examples.",
  explanationDe: "Erste Zeile ist ein Rezept-Schlüsselwort: https, www, no-www, redirect, cors, cache, security, spa. Manche benötigen Zusatzinfos — siehe Beispiele.",
  category: "ItsWeber Ops",
  keywords: ["htaccess","apache","redirect","https","cors","cache","security","header","rewrite","mod_rewrite"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "https",
  example: "redirect\n/old-path /new-path\n/blog /news",
  useCasesDe: ["HTTPS-Weiterleitung erzwingen","SPA-Routing für Apache","Security-Header setzen"],
  run: (input) => {
    const lines = input.trim().split("\n");
    const cmd = lines[0].trim().toLowerCase();
    if (cmd==="https") return { output: `RewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]` };
    if (cmd==="www") return { output: `RewriteEngine On\nRewriteCond %{HTTP_HOST} !^www\\. [NC]\nRewriteRule ^(.*)$ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]` };
    if (cmd==="no-www") return { output: `RewriteEngine On\nRewriteCond %{HTTP_HOST} ^www\\.(.*)$ [NC]\nRewriteRule ^(.*)$ https://%1%{REQUEST_URI} [L,R=301]` };
    if (cmd==="spa") return { output: `RewriteEngine On\nRewriteBase /\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule . /index.html [L]` };
    if (cmd==="cors") {
      const origin = lines[1]?.trim() || "*";
      return { output: `Header always set Access-Control-Allow-Origin "${origin}"\nHeader always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\nHeader always set Access-Control-Allow-Headers "Authorization, Content-Type"\nHeader always set Access-Control-Max-Age "86400"\n\n<IfModule mod_rewrite.c>\n  RewriteEngine On\n  RewriteCond %{REQUEST_METHOD} OPTIONS\n  RewriteRule ^(.*)$ $1 [R=200,L]\n</IfModule>` };
    }
    if (cmd==="cache") return { output: `<IfModule mod_expires.c>\n  ExpiresActive On\n  ExpiresByType image/jpg "access plus 1 year"\n  ExpiresByType image/png "access plus 1 year"\n  ExpiresByType image/svg+xml "access plus 1 year"\n  ExpiresByType text/css "access plus 1 month"\n  ExpiresByType application/javascript "access plus 1 month"\n  ExpiresByType text/html "access plus 1 day"\n</IfModule>` };
    if (cmd==="security") return { output: `# Security Headers\nHeader always set X-Content-Type-Options "nosniff"\nHeader always set X-Frame-Options "DENY"\nHeader always set X-XSS-Protection "1; mode=block"\nHeader always set Referrer-Policy "strict-origin-when-cross-origin"\nHeader always set Permissions-Policy "geolocation=(), microphone=()"\nHeader always set Strict-Transport-Security "max-age=31536000; includeSubDomains"\n\n# Hide server info\nServerSignature Off\nServerTokens Prod\n\n# Deny dot files\n<FilesMatch "^\\.">\n  Require all denied\n</FilesMatch>` };
    if (cmd==="redirect") {
      const rules = lines.slice(1).filter(l=>l.trim()).map(l=>{ const p=l.trim().split(/\s+/); return p.length>=2?`Redirect 301 ${p[0]} ${p[1]}`:`# Ungültig: ${l}`; });
      if (!rules.length) throw new Error("Format:\nredirect\n/altes-pfad /neues-pfad");
      return { output: rules.join("\n") };
    }
    throw new Error(`Unbekanntes Rezept: '${cmd}'\nErlaubt: https, www, no-www, spa, cors, cache, security, redirect`);
  },
});
