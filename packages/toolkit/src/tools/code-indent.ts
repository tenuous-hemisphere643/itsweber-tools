import { defineTool } from "../core";

export default defineTool({
  id: "code-indent",
  title: "Code Indentation Fixer",
  titleDe: "Code-Einrückungs-Korrektor",
  description: "Convert tabs to spaces, spaces to tabs, or fix mixed indentation in code.",
  descriptionDe: "Tabs in Leerzeichen umwandeln, Leerzeichen in Tabs oder gemischte Einrückungen korrigieren.",
  explanation: "First line: 'tabs-to-spaces N', 'spaces-to-tabs N', or 'fix'. Rest: code to process.",
  explanationDe: "Erste Zeile: 'tabs-to-spaces N', 'spaces-to-tabs N' oder 'fix'. Rest: zu verarbeitender Code.",
  category: "Development",
  keywords: ["indent","einrücken","tabs","spaces","code","format","whitespace","fix"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "tabs-to-spaces 2\n\tfunction hello() {\n\t\tconsole.log('hi');\n\t}",
  example: "tabs-to-spaces 4\n\tconst x = 1;\n\t\tconst y = 2;",
  useCasesDe: ["Copy-Paste-Code bereinigen","Tab/Space-Konflikte lösen","Code-Style vereinheitlichen"],
  run: (input) => {
    const nl = input.indexOf("\n");
    if (nl === -1) throw new Error("Erste Zeile: Befehl, dann Code");
    const cmd = input.slice(0,nl).trim().toLowerCase();
    const code = input.slice(nl+1);
    if (cmd.startsWith("tabs-to-spaces")) {
      const n = parseInt(cmd.split(/\s+/)[1]||"2");
      const spaces = " ".repeat(n);
      const result = code.split("\n").map(line=>{
        let i = 0;
        while (line[i]==="\t") i++;
        return spaces.repeat(i)+line.slice(i);
      }).join("\n");
      return { output: result };
    }
    if (cmd.startsWith("spaces-to-tabs")) {
      const n = parseInt(cmd.split(/\s+/)[1]||"2");
      const re = new RegExp(`^ {${n}}`, "gm");
      let result = code;
      let prev = "";
      while (result !== prev) { prev=result; result=result.replace(re, "\t"); }
      return { output: result };
    }
    if (cmd==="fix") {
      const lines = code.split("\n");
      const tabLines = lines.filter(l=>/^\t/.test(l)).length;
      const spaceLines = lines.filter(l=>/ /.test(l[0]||"")).length;
      const useSpaces = spaceLines >= tabLines;
      const detectSize = (() => {
        const indents = lines.map(l=>{const m=l.match(/^( +)/);return m?m[1].length:0;}).filter(n=>n>0);
        return indents.length ? indents.reduce((a,b)=>Math.min(a,b),8) : 2;
      })();
      const result = lines.map(line=>{
        if (useSpaces && /^\t/.test(line)) {
          let i=0; while(line[i]==="\t")i++;
          return " ".repeat(i*detectSize)+line.slice(i);
        }
        return line;
      }).join("\n");
      return { output: [`Modus: ${useSpaces?"Tabs → Spaces":"Einheitlich"} (${detectSize} Spaces)`,``,result].join("\n") };
    }
    throw new Error("Befehle: tabs-to-spaces N | spaces-to-tabs N | fix");
  },
});
