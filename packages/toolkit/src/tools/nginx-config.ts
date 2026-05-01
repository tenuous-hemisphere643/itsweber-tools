import { defineTool } from "../core";

export default defineTool({
  id: "nginx-config",
  title: "Nginx Config Generator",
  titleDe: "Nginx-Konfig Generator",
  description: "Generate a ready-to-use nginx server block for reverse proxy or static hosting.",
  descriptionDe: "Erzeugt einen einsatzbereiten nginx Server-Block für Reverse-Proxy oder statisches Hosting.",
  explanation: "Enter domain and upstream (host:port for proxy, or 'static' for static file serving). Outputs a ready-to-use nginx server block with best-practice headers.",
  explanationDe: "Domain und Upstream eingeben (host:port für Proxy, 'static' für statische Dateien). Gibt einen fertigen nginx-Server-Block mit Best-Practice-Headers aus.",
  category: "ItsWeber Ops",
  keywords: ["nginx", "reverse proxy", "server block", "virtual host", "ssl", "config", "konfig", "webserver"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "tools.example.com 127.0.0.1:8080",
  example: "tools.example.com 127.0.0.1:8080",
  useCasesDe: ["Reverse-Proxy für Docker-Services", "Unraid-Apps hinter Nginx", "Nginx-Konfig-Vorlage generieren"],
  run: (input) => {
    const parts = input.trim().split(/\s+/);
    if (parts.length < 1) throw new Error("Enter: domain [upstream]  e.g.  tools.example.com 127.0.0.1:8080");
    const domain = parts[0];
    const upstream = parts[1] ?? "static";
    const isStatic = upstream === "static";

    if (!/^[a-zA-Z0-9.-]+$/.test(domain)) throw new Error("Invalid domain name.");

    const proxyBlock = `    location / {
        proxy_pass         http://${upstream};
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade           $http_upgrade;
        proxy_set_header   Connection        "upgrade";
    }`;

    const staticBlock = `    root   /var/www/${domain};
    index  index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }`;

    return {
      output: `server {
    listen 80;
    listen [::]:80;
    server_name ${domain};

    # Redirect HTTP → HTTPS (remove if no SSL)
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${domain};

    # SSL — replace with your cert paths
    ssl_certificate     /etc/nginx/ssl/${domain}.crt;
    ssl_certificate_key /etc/nginx/ssl/${domain}.key;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options           SAMEORIGIN;
    add_header X-Content-Type-Options    nosniff;
    add_header Referrer-Policy           strict-origin-when-cross-origin;

    access_log  /var/log/nginx/${domain}.access.log;
    error_log   /var/log/nginx/${domain}.error.log;

${isStatic ? staticBlock : proxyBlock}
}`,
    };
  },
});
