import { defineTool } from "../core";

export default defineTool({
  id: "tls-checker",
  title: "TLS/SSL Info Guide",
  titleDe: "TLS/SSL-Info-Leitfaden",
  description: "Reference guide for TLS versions, cipher suites, certificates, and best practices.",
  descriptionDe: "Referenzleitfaden für TLS-Versionen, Cipher Suites, Zertifikate und Best Practices.",
  explanation: "Enter a topic: versions, ciphers, cert, headers, checklist. Or leave blank for overview.",
  explanationDe: "Thema eingeben: versions, ciphers, cert, headers, checklist. Oder leer für Übersicht.",
  category: "Network",
  keywords: ["tls","ssl","https","certificate","cipher","security","openssl","letsencrypt","https"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "checklist",
  example: "versions",
  useCasesDe: ["HTTPS-Konfiguration prüfen","Zertifikat-Infos nachschlagen","TLS-Sicherheit verbessern"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const sections: Record<string,string[]> = {
      versions: [
        `TLS-Versionen:`,``,
        `  TLS 1.3  (2018)  ✓ Modern, beste Performance, empfohlen`,
        `  TLS 1.2  (2008)  ✓ Akzeptabel, noch weit verbreitet`,
        `  TLS 1.1  (2006)  ✗ Veraltet, 2020 deprecated (RFC 8996)`,
        `  TLS 1.0  (1999)  ✗ Unsicher, deaktivieren`,
        `  SSL 3.0  (1996)  ✗ POODLE-Angriff, definitiv deaktivieren`,
        `  SSL 2.0  (1994)  ✗ Komplett unsicher`,
      ],
      ciphers: [
        `Moderne sichere Cipher Suites (TLS 1.3):`,
        `  TLS_AES_256_GCM_SHA384`,
        `  TLS_AES_128_GCM_SHA256`,
        `  TLS_CHACHA20_POLY1305_SHA256`,``,
        `TLS 1.2 (ECDHE preferred):`,
        `  ECDHE-RSA-AES256-GCM-SHA384`,
        `  ECDHE-RSA-AES128-GCM-SHA256`,``,
        `❌ Schwache Ciphers (deaktivieren):`,
        `  RC4, DES, 3DES, EXPORT, MD5, NULL, aNULL`,
      ],
      cert: [
        `Zertifikat-Typen:`,
        `  DV (Domain Validation)  — günstig, automatisch (Let's Encrypt)`,
        `  OV (Organization)       — Firmenvalidierung`,
        `  EV (Extended)           — Grüne Adressleiste (auslaufend)`,``,
        `Zertifikat mit OpenSSL prüfen:`,
        `  openssl s_client -connect domain.com:443 2>/dev/null | openssl x509 -noout -dates`,
        `  openssl s_client -connect domain.com:443 2>/dev/null | openssl x509 -noout -subject`,``,
        `Let's Encrypt mit Certbot:`,
        `  certbot --nginx -d domain.com`,
        `  certbot renew --dry-run`,
      ],
      headers: [
        `Wichtige Security-HTTP-Headers:`,``,
        `  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`,
        `  X-Content-Type-Options: nosniff`,
        `  X-Frame-Options: DENY`,
        `  Content-Security-Policy: default-src 'self'`,
        `  Referrer-Policy: strict-origin-when-cross-origin`,
        `  Permissions-Policy: geolocation=(), microphone=()`,
      ],
      checklist: [
        `TLS-Sicherheits-Checkliste:`,``,
        `  ✓ TLS 1.2 und 1.3 aktiviert`,
        `  ✓ TLS 1.0/1.1 und SSL deaktiviert`,
        `  ✓ HSTS-Header gesetzt (max-age ≥ 1 Jahr)`,
        `  ✓ Zertifikat gültig und nicht abgelaufen`,
        `  ✓ Zertifikat-Chain vollständig`,
        `  ✓ Starke Cipher Suites konfiguriert`,
        `  ✓ OCSP Stapling aktiviert`,
        `  ✓ Perfect Forward Secrecy (ECDHE)`,
        `  ✓ Keine Mixed Content`,
        `  ✓ Automatic Renewal (certbot renew)`,``,
        `Online-Test: ssllabs.com/ssltest`,
      ],
    };
    if (t && sections[t]) return { output: sections[t].join("\n") };
    return { output: [
      `TLS/SSL Referenz:`,``,
      ...Object.keys(sections).map(k=>`  ${k}`),``,
      `Thema eingeben für Details.`,
    ].join("\n") };
  },
});
