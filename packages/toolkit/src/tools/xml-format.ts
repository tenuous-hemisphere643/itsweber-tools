import { defineTool } from "../core";

export default defineTool({
  id: "xml-format",
  title: "XML Formatter / Validator",
  titleDe: "XML-Formatter / Validator",
  description: "Format, validate, and minify XML — auto-detected by line count.",
  descriptionDe: "XML formatieren, validieren und minifizieren — Richtung wird automatisch erkannt.",
  explanation: "Paste XML to format it. Paste minified (single-line) XML to beautify. Validates basic structure.",
  explanationDe: "XML einfügen → formatieren. Einzeiliges XML einfügen → lesbar machen. Validiert grundlegende Struktur.",
  category: "Development",
  keywords: ["xml","format","validate","minify","pretty","parse","indent","sitemap","rss","soap"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "<root><item id=\"1\"><name>Test</name></item></root>",
  example: "<catalog><book id=\"1\"><title>ItsWeber Guide</title><author>Mani</author></book></catalog>",
  useCasesDe: ["XML-Konfigurationen lesen","RSS-Feeds prüfen","SOAP-Anfragen formatieren"],
  run: (input) => {
    const t = input.trim();
    const tokenize = (xml: string): string[] => {
      const tokens: string[] = [];
      let i = 0;
      while (i < xml.length) {
        if (xml[i]==="<") {
          const end = xml.indexOf(">",i)+1;
          if (end===0) throw new Error("Nicht geschlossenes Tag");
          tokens.push(xml.slice(i,end));
          i = end;
        } else {
          const next = xml.indexOf("<",i);
          const text = next===-1?xml.slice(i):xml.slice(i,next);
          if (text.trim()) tokens.push(text.trim());
          i = next===-1?xml.length:next;
        }
      }
      return tokens;
    };
    const isMinified = !t.includes("\n") || t.split("\n").length < 3;
    if (!isMinified) {
      const minified = t.replace(/>\s+</g,"><").replace(/\s+/g," ").trim();
      return { output: [`Modus: Minify (${t.length} → ${minified.length} Zeichen)`,``,minified].join("\n") };
    }
    try {
      const tokens = tokenize(t);
      let indent = 0;
      const lines: string[] = [];
      for (const token of tokens) {
        if (token.startsWith("</")) {
          indent = Math.max(0, indent-1);
          lines.push("  ".repeat(indent)+token);
        } else if (token.startsWith("<") && !token.startsWith("<?") && !token.endsWith("/>") && !token.includes("</")) {
          lines.push("  ".repeat(indent)+token);
          indent++;
        } else {
          lines.push("  ".repeat(indent)+token);
        }
      }
      return { output: [`Modus: Format`,``,lines.join("\n")].join("\n") };
    } catch (e) {
      throw new Error(`XML-Fehler: ${(e as Error).message}`);
    }
  },
});
