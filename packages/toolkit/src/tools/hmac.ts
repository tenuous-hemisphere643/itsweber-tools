import { defineTool } from "../core";
import { textEncoder } from "../shared";

async function hmac(algorithm: string, key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(key),
    { name: "HMAC", hash: algorithm },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, textEncoder.encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default defineTool({
  id: "hmac",
  title: "HMAC Generator",
  titleDe: "HMAC-Generator",
  description: "Generate HMAC-SHA256/SHA512 signatures using the Web Crypto API.",
  descriptionDe: "Erzeugt HMAC-SHA256/SHA512-Signaturen über die Web Crypto API.",
  explanation: "Input format: first line = secret key, second line = algorithm (SHA-256 or SHA-512), third line = message. Uses Web Crypto API — runs entirely in your browser.",
  explanationDe: "Eingabe: erste Zeile = Secret-Key, zweite Zeile = Algorithmus (SHA-256 oder SHA-512), dritte Zeile = Nachricht. Läuft vollständig im Browser.",
  category: "Crypto",
  keywords: ["hmac", "sha256", "sha512", "signature", "signatur", "web crypto", "api", "secret", "webhook"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "my-secret-key\nSHA-256\nHello, World!",
  example: "my-secret-key\nSHA-256\nHello, ItsWeber Tools!",
  useCasesDe: ["Webhook-Signaturen generieren", "API-Authentifizierung prüfen", "Nachrichten-Integrität sichern"],
  run: async (input) => {
    const lines = input.split("\n");
    if (lines.length < 3) throw new Error("Enter 3 lines: key / algorithm (SHA-256 or SHA-512) / message");
    const [key, algoRaw, ...msgParts] = lines;
    const message = msgParts.join("\n");
    const algoMap: Record<string, string> = {
      "sha-256": "SHA-256", "sha256": "SHA-256",
      "sha-512": "SHA-512", "sha512": "SHA-512",
    };
    const algo = algoMap[algoRaw.trim().toLowerCase()];
    if (!algo) throw new Error("Algorithm must be SHA-256 or SHA-512.");
    const hex = await hmac(algo, key, message);
    return {
      output: [
        `Algorithm: HMAC-${algo}`,
        `Key:       ${key.slice(0, 4)}${"*".repeat(Math.max(0, key.length - 4))}`,
        ``,
        `HEX:    ${hex}`,
        `Base64: ${btoa(hex.match(/.{2}/g)!.map((h) => String.fromCharCode(parseInt(h, 16))).join(""))}`,
      ].join("\n"),
    };
  },
});
