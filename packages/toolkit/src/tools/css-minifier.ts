import { defineTool } from "../core";

export default defineTool({
  id: "css-minifier",
  title: "CSS Minifier / Beautifier",
  titleDe: "CSS-Minifier / Beautifier",
  description: "Minify or beautify CSS code — auto-detected by formatting.",
  descriptionDe: "CSS-Code minifizieren oder formatieren — Richtung wird automatisch erkannt.",
  explanation: "Paste minified CSS to beautify, or multi-line CSS to minify. Auto-detected.",
  explanationDe: "Minifiziertes CSS einfügen → formatieren. Mehrzeiliges CSS einfügen → minifizieren. Automatisch erkannt.",
  category: "Web",
  keywords: ["css","minify","beautify","format","compress","stylesheet","style","optimize"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: ".btn { color: red; background: blue; }",
  example: ".btn{color:red;background:blue;margin:0}",
  useCasesDe: ["CSS für Production minifizieren","Fremdes CSS leserlich machen","Bundle-Größe reduzieren"],
  run: (input) => {
    const isMinified = !input.includes("\n") || input.split("\n").length < 3;
    if (isMinified) {
      let result = input;
      result = result.replace(/\/\*[\s\S]*?\*\//g,"");
      result = result.replace(/\s*\{\s*/g," {\n  ");
      result = result.replace(/;\s*/g,";\n  ");
      result = result.replace(/\s*\}\s*/g,"\n}\n");
      result = result.replace(/ {2}\n}/g,"\n}");
      result = result.trim();
      const lines = input.replace(/\s+/g," ").trim().length;
      return { output: [`Modus: Beautify (${lines} → ${result.length} Zeichen)`,``,result].join("\n") };
    }
    let result = input;
    result = result.replace(/\/\*[\s\S]*?\*\//g,"");
    result = result.replace(/\s+/g," ");
    result = result.replace(/\s*\{\s*/g,"{");
    result = result.replace(/\s*\}\s*/g,"}");
    result = result.replace(/\s*;\s*/g,";");
    result = result.replace(/\s*:\s*/g,":");
    result = result.replace(/\s*,\s*/g,",");
    result = result.trim();
    const saving = Math.round((1-result.length/input.length)*100);
    return { output: [`Modus: Minify (${saving}% kleiner)`,``,result].join("\n") };
  },
});
