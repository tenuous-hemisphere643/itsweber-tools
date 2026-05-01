import { defineTool } from "../core";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim est laborum".split(" ");

function sentence(wordCount: number): string {
  const words = Array.from({length:wordCount},(_,i)=>i===0?WORDS[i%WORDS.length].charAt(0).toUpperCase()+WORDS[i%WORDS.length].slice(1):WORDS[(i*7+3)%WORDS.length]);
  return words.join(" ") + ".";
}

function paragraph(sentenceCount: number, offset: number): string {
  return Array.from({length:sentenceCount},(_,i)=>sentence(8+((i+offset)*3)%8)).join(" ");
}

export default defineTool({
  id: "lorem-ipsum",
  title: "Lorem Ipsum Generator",
  titleDe: "Lorem-Ipsum Generator",
  description: "Generate placeholder text — paragraphs, sentences, or words.",
  descriptionDe: "Generiert Platzhaltertext — Absätze, Sätze oder Wörter.",
  explanation: "Enter '3 paragraphs', '5 sentences', or '50 words'. Generates deterministic Lorem Ipsum placeholder text.",
  explanationDe: "Eingabe: '3 Absätze', '5 Sätze' oder '50 Wörter'. Erzeugt deterministischen Lorem-Ipsum-Platzhaltertext.",
  category: "Text",
  keywords: ["lorem","ipsum","placeholder","platzhalter","dummy","text","generator","design"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "3 paragraphs  oder  50 words",
  example: "3 paragraphs",
  useCasesDe: ["UI-Mockups befüllen","Design-Reviews vorbereiten","Formulare zum Testen befüllen"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const m = t.match(/^(\d+)\s+(paragraph|absatz|absätze|sentence|satz|sätze|word|wort|wörter|words|sentences|paragraphs)s?$/);
    if (!m) throw new Error("Format: '3 paragraphs', '5 sentences', oder '50 words'");
    const n = Math.min(parseInt(m[1]),50);
    const type = m[2];
    if (type.startsWith("word") || type.startsWith("wort")) {
      const ws = Array.from({length:n},(_,i)=>WORDS[i%WORDS.length]);
      ws[0] = ws[0].charAt(0).toUpperCase()+ws[0].slice(1);
      return { output: ws.join(" ")+"." };
    }
    if (type.startsWith("sentence") || type.startsWith("satz") || type.startsWith("sätze")) {
      return { output: Array.from({length:n},(_,i)=>sentence(7+(i*3)%9)).join(" ") };
    }
    return { output: Array.from({length:n},(_,i)=>paragraph(3+i%3,i)).join("\n\n") };
  },
});
