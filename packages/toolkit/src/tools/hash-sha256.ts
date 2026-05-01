import { defineTool } from "../core";
import { textEncoder } from "../shared";

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export default defineTool({
  id: "hash-sha256",
  title: "SHA-256 Hash",
  titleDe: "SHA-256-Hash",
  description: "Creates a SHA-256 checksum from text.",
  descriptionDe: "Erzeugt eine SHA-256-Prüfsumme aus Text.",
  explanation: "A hash is a fingerprint of content. It helps compare values without storing the original text.",
  explanationDe:
    "Ein Hash ist ein Fingerabdruck eines Inhalts. Damit kann man Werte vergleichen, ohne den Ursprungstext zu speichern.",
  category: "Crypto",
  keywords: ["sha", "hash", "checksum"],
  status: "ready",
  privacyMode: "browser-api",
  placeholder: "Paste text to hash...",
  example: "ItsWeber Tools",
  run: async (input) => ({ output: await sha256(input) }),
});
