import { defineTool } from "../core";

const MIME: Record<string,[string,string]> = {
  "html":["text/html","HTML-Dokument"],
  "htm":["text/html","HTML-Dokument"],
  "css":["text/css","CSS-Stylesheet"],
  "js":["application/javascript","JavaScript"],
  "mjs":["application/javascript","ES-Modul"],
  "ts":["application/typescript","TypeScript"],
  "json":["application/json","JSON-Daten"],
  "jsonl":["application/x-ndjson","NDJSON"],
  "xml":["application/xml","XML-Dokument"],
  "csv":["text/csv","CSV-Datei"],
  "txt":["text/plain","Klartext"],
  "md":["text/markdown","Markdown"],
  "yaml":["application/yaml","YAML"],
  "yml":["application/yaml","YAML"],
  "toml":["application/toml","TOML"],
  "png":["image/png","PNG-Bild"],
  "jpg":["image/jpeg","JPEG-Bild"],
  "jpeg":["image/jpeg","JPEG-Bild"],
  "gif":["image/gif","GIF-Bild"],
  "svg":["image/svg+xml","SVG-Vektorgrafik"],
  "webp":["image/webp","WebP-Bild"],
  "ico":["image/x-icon","Icon"],
  "avif":["image/avif","AVIF-Bild"],
  "mp3":["audio/mpeg","MP3-Audio"],
  "wav":["audio/wav","WAV-Audio"],
  "ogg":["audio/ogg","OGG-Audio"],
  "mp4":["video/mp4","MP4-Video"],
  "webm":["video/webm","WebM-Video"],
  "pdf":["application/pdf","PDF-Dokument"],
  "zip":["application/zip","ZIP-Archiv"],
  "gz":["application/gzip","GZ-Archiv"],
  "tar":["application/x-tar","TAR-Archiv"],
  "7z":["application/x-7z-compressed","7-Zip-Archiv"],
  "wasm":["application/wasm","WebAssembly"],
  "woff":["font/woff","WOFF-Schrift"],
  "woff2":["font/woff2","WOFF2-Schrift"],
  "ttf":["font/ttf","TrueType-Schrift"],
  "eot":["application/vnd.ms-fontobject","EOT-Schrift"],
  "exe":["application/octet-stream","Binärdatei"],
  "bin":["application/octet-stream","Binärdatei"],
  "sh":["application/x-sh","Shell-Skript"],
  "py":["text/x-python","Python-Skript"],
  "rb":["application/x-ruby","Ruby-Skript"],
  "php":["application/x-httpd-php","PHP-Skript"],
  "jar":["application/java-archive","Java-Archiv"],
};

export default defineTool({
  id: "mime-types",
  title: "MIME Type Lookup",
  titleDe: "MIME-Typ-Nachschlagewerk",
  description: "Look up MIME types by file extension or find extensions for a MIME type.",
  descriptionDe: "MIME-Typen nach Dateiendung nachschlagen oder Endungen für einen MIME-Typ finden.",
  explanation: "Enter a file extension (e.g. 'png'), a MIME type (e.g. 'image/png'), or a filename.",
  explanationDe: "Dateiendung eingeben (z.B. 'png'), MIME-Typ (z.B. 'image/png') oder Dateiname.",
  category: "Web",
  keywords: ["mime","type","extension","endung","content-type","file","http","header"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "json",
  example: "application/json",
  useCasesDe: ["Content-Type Header setzen","Nginx MIME-Types konfigurieren","Upload-Validierung"],
  run: (input) => {
    const t = input.trim().toLowerCase().replace(/^\./,"");
    if (t.includes("/")) {
      const matches = Object.entries(MIME).filter(([,[m]])=>m===t||m.startsWith(t));
      if (!matches.length) return { output: `MIME-Typ '${t}' nicht in Datenbank.\nBei HTTP-Headern: Content-Type: ${t}` };
      return { output: matches.map(([ext,[m,desc]])=>`  .${ext.padEnd(8)}  ${m}  – ${desc}`).join("\n") };
    }
    const ext = t.includes(".")? t.split(".").pop()! : t;
    const entry = MIME[ext];
    if (!entry) return { output: `Keine MIME-Info für '.${ext}' in der Datenbank.\nFallback: application/octet-stream` };
    return { output: [
      `.${ext}  →  ${entry[0]}`,
      `Beschreibung: ${entry[1]}`,
      ``,
      `HTTP-Header:`,
      `  Content-Type: ${entry[0]}`,
      `  Accept: ${entry[0]}`,
    ].join("\n") };
  },
});
