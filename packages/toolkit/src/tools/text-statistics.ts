import { defineTool } from "../core";

function textStats(value: string): string {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const lines = value ? value.split(/\r\n|\r|\n/).length : 0;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));
  return [
    `Characters: ${value.length}`,
    `Characters without spaces: ${value.replace(/\s/g, "").length}`,
    `Words: ${wordCount}`,
    `Lines: ${lines}`,
    `Estimated reading time: ${readingMinutes} min`,
  ].join("\n");
}

export default defineTool({
  id: "text-statistics",
  title: "Text Statistics",
  titleDe: "Text-Statistik",
  description: "Counts characters, words, lines, and reading time.",
  descriptionDe: "Zählt Zeichen, Wörter, Zeilen und Lesezeit.",
  explanation: "Useful for documentation, UI copy, release notes, and text fields with length limits.",
  explanationDe:
    "Praktisch für Dokumentation, UI-Texte, Release Notes und Textfelder mit Zeichenbegrenzung.",
  category: "Text",
  keywords: ["count", "words", "characters"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "Paste text...",
  example: "Fast local tools for daily IT work.",
  run: (input) => ({ output: textStats(input) }),
});
