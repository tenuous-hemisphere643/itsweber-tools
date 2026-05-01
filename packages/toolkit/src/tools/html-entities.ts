import { defineTool } from "../core";

const ENCODE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const DECODE_MAP: Record<string, string> = {
  "&amp;":  "&",
  "&lt;":   "<",
  "&gt;":   ">",
  "&quot;": '"',
  "&#39;":  "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

function encode(s: string) {
  return s.replace(/[&<>"']/g, (c) => ENCODE_MAP[c]);
}

function decode(s: string) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&[a-z]+;/gi, (e) => DECODE_MAP[e.toLowerCase()] ?? e);
}

export default defineTool({
  id: "html-entities",
  title: "HTML Entity Encoder / Decoder",
  titleDe: "HTML-Entity Encoder / Decoder",
  description: "Encode or decode HTML entities (&amp;, &lt;, &gt; …).",
  descriptionDe: "Kodiert oder dekodiert HTML-Entities (&amp;, &lt;, &gt; …).",
  explanation: "Encodes special characters to their HTML entity equivalents and decodes them back. Handles named, decimal, and hex entities.",
  explanationDe: "Wandelt Sonderzeichen in HTML-Entities um und zurück. Unterstützt benannte, dezimale und hexadezimale Entities.",
  category: "Converter",
  keywords: ["html", "entity", "entities", "encode", "decode", "escape", "amp", "lt", "gt"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "<script>alert('xss')</script>  or  &lt;script&gt;",
  example: "<h1>It's Weber & Tools</h1>",
  useCasesDe: ["Template-Inhalte absichern", "CMS-Ausgaben prüfen", "API-Felder dekodieren"],
  run: (input) => {
    const encoded = encode(input);
    const decoded = decode(input);
    return {
      output: [
        "── Encoded ──",
        encoded,
        "",
        "── Decoded ──",
        decoded,
      ].join("\n"),
    };
  },
});
