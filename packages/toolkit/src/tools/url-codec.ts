import { defineTool } from "../core";

function isLikelyEncoded(s: string): boolean {
  return /%[0-9A-Fa-f]{2}/.test(s) || s.includes("+");
}

export default defineTool({
  id: "url-codec",
  title: "URL Encoder / Decoder",
  titleDe: "URL Encoder / Decoder",
  description: "Encode or decode URL components — auto-detected. Also handles full query strings.",
  descriptionDe: "Kodiert oder dekodiert URL-Komponenten — wird automatisch erkannt. Verarbeitet auch vollständige Query-Strings.",
  explanation:
    "Paste a plain string to percent-encode it for use in URLs, or paste an encoded string (containing %XX sequences) to decode it. Direction is auto-detected. Handles full query strings and individual values.",
  explanationDe:
    "Klartext → Prozent-Kodierung für URLs. Kodierter String (mit %XX) → Klartext. Richtung wird automatisch erkannt. Funktioniert mit vollständigen Query-Strings und einzelnen Werten.",
  category: "Converter",
  keywords: ["url", "encode", "decode", "percent", "prozent", "query", "uri", "escape", "unescape"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "Text, URL oder Query-String eingeben — Richtung wird erkannt",
  example: "name=It's Weber Tools&category=Ops & Docker",
  useCasesDe: [
    "Query-Parameter für APIs vorbereiten",
    "URL-kodierte Strings in Logs lesbar machen",
    "Form-Daten korrekt enkodieren",
  ],
  run: (input) => {
    if (isLikelyEncoded(input)) {
      let decoded: string;
      try {
        decoded = decodeURIComponent(input.replace(/\+/g, " "));
      } catch {
        throw new Error("Ungültige URL-Kodierung — enthält unvollständige %XX-Sequenzen.");
      }
      return {
        output: [
          `Modus:   Decode  (URL-kodiert → Klartext)`,
          ``,
          decoded,
        ].join("\n"),
      };
    }
    const encoded = encodeURIComponent(input).replace(/%20/g, "+");
    const encodedFull = encodeURIComponent(input);
    return {
      output: [
        `Modus:   Encode  (Klartext → URL-kodiert)`,
        ``,
        `Query (+):   ${encoded}`,
        `Strict (%20):${encodedFull}`,
      ].join("\n"),
    };
  },
});
