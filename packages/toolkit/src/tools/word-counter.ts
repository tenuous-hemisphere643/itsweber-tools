import { defineTool } from "../core";

export default defineTool({
  id: "word-counter",
  title: "Word & Character Counter",
  titleDe: "Wort- & Zeichenzähler",
  description: "Count words, characters, sentences, paragraphs, and reading time.",
  descriptionDe: "Zählt Wörter, Zeichen, Sätze, Absätze und berechnet die Lesezeit.",
  explanation: "Paste any text to get detailed statistics: word count, character count (with and without spaces), unique words, sentence count, paragraph count, and estimated reading time at 200 wpm.",
  explanationDe: "Text einfügen → detaillierte Statistiken: Wörter, Zeichen (mit/ohne Leerzeichen), eindeutige Wörter, Sätze, Absätze und geschätzte Lesezeit bei 200 Wörtern/Minute.",
  category: "Text",
  keywords: ["word","wort","count","zählen","character","zeichen","sentence","paragraph","reading","lesen","seo"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "Text hier einfügen...",
  example: "ItsWeber Tools ist eine schnelle, self-hosted IT Workbench für Docker und Unraid. Alles lokal, alles offline-fähig.",
  useCasesDe: ["SEO-Textlängen prüfen","Blog-Artikel vorbereiten","Tweet/Post-Zeichenlimits einhalten"],
  run: (input) => {
    const chars = input.length;
    const charsNoSpace = input.replace(/\s/g,"").length;
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const sentences = (input.match(/[.!?]+/g)||[]).length;
    const paragraphs = input.trim() ? input.trim().split(/\n{2,}/).length : 0;
    const uniqueWords = new Set(input.toLowerCase().match(/\b\w+\b/g)||[]).size;
    const readTimeSec = Math.ceil(words/200*60);
    const avgWordLen = words>0 ? (charsNoSpace/words).toFixed(1) : "0";
    return { output: [
      `Wörter:            ${words}`,
      `Eindeutige Wörter: ${uniqueWords}`,
      `Zeichen (gesamt):  ${chars}`,
      `Zeichen (o. Leer): ${charsNoSpace}`,
      `Sätze:             ${sentences}`,
      `Absätze:           ${paragraphs}`,
      `Ø Wortlänge:       ${avgWordLen} Zeichen`,
      ``,
      `Lesezeit (200 wpm): ~${readTimeSec < 60 ? readTimeSec+"s" : Math.ceil(readTimeSec/60)+"min"}`,
      ``,
      `── Limits ──`,
      `Twitter/X:  ${chars}/280  ${chars<=280?"✓":"✗ ("+((chars-280))+" über Limit)"}`,
      `SMS:        ${chars}/160  ${chars<=160?"✓":"~"+(Math.ceil(chars/153))+" SMS"}`,
      `Meta Desc:  ${chars}/160  ${chars<=160?"✓ SEO-ok":chars<=320?"⚠ zu lang":"✗"}`,
    ].join("\n") };
  },
});
