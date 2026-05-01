import { defineTool } from "../core";

export default defineTool({
  id: "js-minifier",
  title: "JavaScript Minifier",
  titleDe: "JavaScript-Minifier",
  description: "Basic JavaScript minification: remove comments, collapse whitespace.",
  descriptionDe: "Einfache JavaScript-Minifizierung: Kommentare entfernen, Leerzeichen reduzieren.",
  explanation: "Paste JavaScript code. Removes block comments, line comments, collapses whitespace, removes redundant semicolons. Note: this is a basic minifier, not a full optimizer like Terser.",
  explanationDe: "JavaScript-Code einfügen. Entfernt Block- und Zeilenkommentare, reduziert Leerzeichen. Kein vollständiger Optimizer — für Production Terser/esbuild verwenden.",
  category: "Web",
  keywords: ["js","javascript","minify","compress","whitespace","comment","bundle","optimize"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "// Click handler\nfunction onClick(e) {\n  console.log(e.target);\n}",
  example: "function add(a, b) {\n  // sum\n  return a + b;\n}",
  useCasesDe: ["Script-Größe reduzieren","Inline-JS minifizieren","Bundle-Optimierung verstehen"],
  run: (input) => {
    const original = input.length;
    let result = input;
    result = result.replace(/\/\*[\s\S]*?\*\//g, " ");
    result = result.replace(/\/\/.*/g, "");
    result = result.replace(/\n\s*\n/g, "\n");
    result = result.replace(/[ \t]+/g, " ");
    result = result.replace(/ *([{}()[\];,=+\-*/<>!&|?:]) */g, "$1");
    result = result.replace(/\s*\n\s*/g, "\n").trim();
    const saving = Math.round((1-result.length/original)*100);
    return { output: [`Minifiziert (${saving}% kleiner, ${original} → ${result.length} Zeichen):`,``,result].join("\n") };
  },
});
