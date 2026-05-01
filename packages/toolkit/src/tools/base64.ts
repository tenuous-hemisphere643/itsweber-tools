import { defineTool } from "../core";

function encode(input: string): string {
  return btoa(unescape(encodeURIComponent(input)));
}

function decode(input: string): string {
  try {
    return decodeURIComponent(escape(atob(input.trim())));
  } catch {
    throw new Error("Invalid Base64 — input contains characters outside the Base64 alphabet.");
  }
}

function isLikelyBase64(s: string): boolean {
  const trimmed = s.trim().replace(/\s/g, "");
  return /^[A-Za-z0-9+/]+=*$/.test(trimmed) && trimmed.length % 4 === 0 && trimmed.length > 0;
}

export default defineTool({
  id: "base64",
  title: "Base64 Encoder / Decoder",
  titleDe: "Base64 Encoder / Decoder",
  description: "Encode text to Base64 or decode Base64 back to plain text — auto-detected.",
  descriptionDe: "Kodiert Text nach Base64 oder dekodiert Base64 zurück — wird automatisch erkannt.",
  explanation:
    "Paste plain text to encode it, or paste a Base64 string to decode it. Direction is detected automatically: if the input looks like valid Base64, it is decoded; otherwise encoded.",
  explanationDe:
    "Klartext einfügen → wird kodiert. Base64-String einfügen → wird dekodiert. Die Richtung wird automatisch erkannt: Sieht die Eingabe nach gültigem Base64 aus, wird dekodiert — ansonsten kodiert.",
  category: "Converter",
  keywords: ["base64", "encode", "decode", "kodieren", "dekodieren", "transport", "binary"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "Text oder Base64-String eingeben — Richtung wird erkannt",
  example: "ItsWeber Tools",
  useCasesDe: [
    "API-Credentials enkodieren",
    "Kleine Dateninhalte in Konfigs einbetten",
    "Base64-Strings in Logs/APIs dekodieren",
  ],
  run: (input) => {
    const trimmed = input.trim();
    if (isLikelyBase64(trimmed)) {
      const decoded = decode(trimmed);
      return {
        output: [
          `Modus:   Decode  (Base64 → Klartext)`,
          ``,
          decoded,
          ``,
          `── Zur Kontrolle re-enkodiert ──`,
          encode(decoded),
        ].join("\n"),
        rawOutput: decoded,
      };
    }
    const encoded = encode(input);
    return {
      output: [
        `Modus:   Encode  (Klartext → Base64)`,
        ``,
        encoded,
        ``,
        `Länge:   ${input.length} → ${encoded.length} Zeichen`,
      ].join("\n"),
      rawOutput: encoded,
    };
  },
});
