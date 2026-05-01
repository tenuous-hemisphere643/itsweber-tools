import { defineTool } from "../core";
import { clampNumber } from "../shared";

function generateUuids(input: string): string {
  const count = clampNumber(Number.parseInt(input, 10) || 1, 1, 50);
  return Array.from({ length: count }, () => crypto.randomUUID()).join("\n");
}

export default defineTool({
  id: "uuid-generator",
  title: "UUID Generator",
  titleDe: "UUID-Generator",
  description: "Generates unique UUID v4 identifiers.",
  descriptionDe: "Erzeugt eindeutige UUID-v4-Kennungen.",
  explanation: "UUIDs are widely used as stable IDs for configs, databases, APIs, and test data.",
  explanationDe:
    "UUIDs werden als stabile IDs für Konfigurationen, Datenbanken, APIs und Testdaten genutzt.",
  category: "Crypto",
  keywords: ["uuid", "guid", "random"],
  status: "ready",
  privacyMode: "browser-api",
  placeholder: "Optional: number of UUIDs to generate...",
  example: "5",
  run: (input) => ({ output: generateUuids(input) }),
});
