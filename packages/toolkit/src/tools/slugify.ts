import { defineTool } from "../core";
import { slugify } from "../shared";

export default defineTool({
  id: "slugify",
  title: "Slug Generator",
  titleDe: "Slug-Generator",
  description: "Creates URL-friendly names from titles.",
  descriptionDe: "Erstellt URL-freundliche Namen aus Titeln.",
  explanation:
    "A slug is a clean lowercase URL segment such as itsweber-tools. It avoids spaces and special characters.",
  explanationDe:
    "Ein Slug ist ein sauberer URL-Teil in Kleinbuchstaben, zum Beispiel itsweber-tools. Leerzeichen und Sonderzeichen werden vermieden.",
  category: "Text",
  keywords: ["slug", "seo", "url"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "Paste a title...",
  example: "ItsWeber Tools Docker App",
  useCasesDe: ["Dateinamen erzeugen", "SEO-URLs bauen", "Docker-/GitHub-Slugs prüfen"],
  run: (input) => ({ output: slugify(input) }),
});
