import { defineTool } from "../core";
import { clampNumber } from "../shared";

function generateToken(input: string): string {
  const length = clampNumber(Number.parseInt(input, 10) || 32, 8, 256);
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

export default defineTool({
  id: "token-generator",
  title: "Token Generator",
  titleDe: "Token-Generator",
  description: "Creates random URL-safe tokens.",
  descriptionDe: "Erzeugt zufällige URL-sichere Tokens.",
  explanation:
    "Tokens are random strings for tests, temporary secrets, setup flows, and placeholders. For production secrets, use your final secret management process.",
  explanationDe:
    "Tokens sind zufällige Zeichenketten für Tests, temporäre Geheimnisse, Setup-Prozesse und Platzhalter. Für produktive Secrets bitte den finalen Secret-Workflow nutzen.",
  category: "Crypto",
  keywords: ["token", "password", "random"],
  status: "ready",
  privacyMode: "browser-api",
  placeholder: "Optional token length...",
  example: "32",
  run: (input) => ({ output: generateToken(input) }),
});
