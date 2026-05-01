import { defineTool } from "../core";

export default defineTool({
  id: "text-wrap",
  title: "Text Wrap / Unwrap",
  titleDe: "Text umbrechen / entfalten",
  description: "Wrap text to a specific column width, or unwrap hard-wrapped text into paragraphs.",
  descriptionDe: "Text auf eine bestimmte Spaltenbreite umbrechen oder hart umgebrochenen Text zu Absätzen zusammenführen.",
  explanation: "First line: 'wrap N' (wrap to N chars) or 'unwrap'. Rest: text to process.",
  explanationDe: "Erste Zeile: 'wrap N' (auf N Zeichen umbrechen) oder 'unwrap'. Rest: zu verarbeitender Text.",
  category: "Text",
  keywords: ["wrap","unwrap","text","column","width","reflow","markdown","email","format"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "wrap 72\nDieser sehr langer Text soll auf 72 Zeichen pro Zeile umgebrochen werden.",
  example: "wrap 80\nLorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  useCasesDe: ["Emails formatieren","Markdown-Texte umbrechen","Terminal-Ausgabe anpassen"],
  run: (input) => {
    const nl = input.indexOf("\n");
    if (nl===-1) throw new Error("Erste Zeile: 'wrap N' oder 'unwrap'");
    const cmd = input.slice(0,nl).trim().toLowerCase();
    const text = input.slice(nl+1);
    if (cmd==="unwrap") {
      const result = text.split(/\n{2,}/).map(para=>para.replace(/\n(?!\n)/g," ").trim()).join("\n\n");
      return { output: result };
    }
    const m = cmd.match(/^wrap\s+(\d+)$/);
    if (!m) throw new Error("Format: 'wrap 72' oder 'unwrap'");
    const width = parseInt(m[1]);
    const wrap = (line: string): string => {
      if (line.length <= width) return line;
      const words = line.split(" ");
      const result: string[] = [];
      let current = "";
      for (const word of words) {
        if (current && (current+" "+word).length > width) { result.push(current); current = word; }
        else { current = current ? current+" "+word : word; }
      }
      if (current) result.push(current);
      return result.join("\n");
    };
    const result = text.split("\n").map(wrap).join("\n");
    return { output: result };
  },
});
