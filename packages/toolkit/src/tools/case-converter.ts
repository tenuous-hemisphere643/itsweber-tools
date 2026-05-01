import { defineTool } from "../core";
import { words } from "../shared";

function convertCase(value: string): string {
  const parts = words(value);
  const pascal = parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join("");
  const camel = pascal.charAt(0).toLowerCase() + pascal.slice(1);
  const snake = parts.map((part) => part.toLowerCase()).join("_");
  const kebab = parts.map((part) => part.toLowerCase()).join("-");
  return [`camelCase: ${camel}`, `PascalCase: ${pascal}`, `snake_case: ${snake}`, `kebab-case: ${kebab}`].join(
    "\n",
  );
}

export default defineTool({
  id: "case-converter",
  title: "Case Converter",
  titleDe: "Schreibweisen-Konverter",
  description: "Converts text into common code naming styles.",
  descriptionDe: "Wandelt Text in typische Code-Schreibweisen um.",
  explanation:
    "Programming often needs the same words as camelCase, snake_case, kebab-case, or PascalCase. This tool produces them together.",
  explanationDe:
    "In Code braucht man dieselben Begriffe oft als camelCase, snake_case, kebab-case oder PascalCase. Dieses Tool erzeugt die Varianten zusammen.",
  category: "Text",
  keywords: ["case", "camel", "snake", "kebab"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "Paste text...",
  example: "ItsWeber Tools Docker App",
  useCasesDe: ["Variablennamen vorbereiten", "API-Felder angleichen", "Datei- und Routen-Namen erstellen"],
  run: (input) => ({ output: convertCase(input) }),
});
