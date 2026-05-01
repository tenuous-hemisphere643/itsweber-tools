import { defineTool } from "../core";

export default defineTool({
  id: "sha-tools",
  title: "SHA Hash Generator",
  titleDe: "SHA-Hash-Generator",
  description: "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes using the Web Crypto API.",
  descriptionDe: "Erzeugt SHA-1, SHA-256, SHA-384 und SHA-512 Hashes über die Web-Crypto-API.",
  explanation: "Enter any text to generate all four SHA variants. Uses browser-native Web Crypto API — nothing leaves your device.",
  explanationDe: "Beliebigen Text eingeben → alle vier SHA-Varianten werden berechnet. Nutzt die native Web-Crypto-API — nichts verlässt das Gerät.",
  category: "Crypto",
  keywords: ["sha","sha256","sha512","sha1","hash","crypto","digest","fingerprint","prüfsumme"],
  status: "ready",
  privacyMode: "browser-api",
  placeholder: "Text zum Hashen...",
  example: "Hello, ItsWeber!",
  useCasesDe: ["Datei-Integrität prüfen","Passwort-Hashes vergleichen","API-Signaturen debuggen"],
  run: async (input) => {
    const enc = new TextEncoder();
    const buf = enc.encode(input);
    const toHex = (b: ArrayBuffer) => Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,"0")).join("");
    const [h1, h256, h384, h512] = await Promise.all([
      crypto.subtle.digest("SHA-1", buf),
      crypto.subtle.digest("SHA-256", buf),
      crypto.subtle.digest("SHA-384", buf),
      crypto.subtle.digest("SHA-512", buf),
    ]);
    return { output: [
      `SHA-1:    ${toHex(h1)}`,
      `SHA-256:  ${toHex(h256)}`,
      `SHA-384:  ${toHex(h384)}`,
      `SHA-512:  ${toHex(h512)}`,
      ``,
      `⚠ SHA-1 gilt als unsicher (nur für Kompatibilität).`,
    ].join("\n") };
  },
});
