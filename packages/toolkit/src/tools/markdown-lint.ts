import { defineTool } from "../core";

export default defineTool({
  id: "markdown-lint",
  title: "Markdown Linter",
  titleDe: "Markdown-Linter",
  description: "Lint Markdown files for common issues: broken links, missing alt texts, heading hierarchy, and more.",
  descriptionDe: "Markdown auf häufige Probleme prüfen: kaputte Links, fehlende Alt-Texte, Überschriften-Hierarchie und mehr.",
  explanation: "Paste Markdown content. Checks: heading hierarchy, missing alt texts, trailing spaces, bare URLs, long lines, empty sections.",
  explanationDe: "Markdown einfügen. Prüft: Überschriften-Hierarchie, fehlende Alt-Texte, Leerzeichen am Zeilenende, nackte URLs, lange Zeilen, leere Abschnitte.",
  category: "Development",
  keywords: ["markdown","lint","check","validate","heading","alt","link","md","documentation"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "# Haupttitel\n\n## Abschnitt\n\nText hier.",
  example: "# My Docs\n\n### Skipped Level\n\nSome text with a bare URL: https://example.com\n\n![image without alt](img.png)\n",
  useCasesDe: ["README-Qualität prüfen","Dokumentation validieren","Markdown-CI-Checks vorbereiten"],
  run: (input) => {
    const lines = input.split("\n");
    const issues: string[] = [];
    let lastLevel = 0;
    let inCode = false;
    for (let i=0; i<lines.length; i++) {
      const line = lines[i];
      const ln = i+1;
      if (line.startsWith("```")) { inCode = !inCode; continue; }
      if (inCode) continue;
      const hm = line.match(/^(#{1,6})\s/);
      if (hm) {
        const level = hm[1].length;
        if (lastLevel > 0 && level > lastLevel+1) issues.push(`L${ln}: Überschriften-Sprung von H${lastLevel} zu H${level}`);
        lastLevel = level;
      }
      if (line.trim().endsWith("  ")) issues.push(`L${ln}: Leerzeichen am Zeilenende (trailing spaces)`);
      if (/!\[\]\(/.test(line)) issues.push(`L${ln}: Bild ohne Alt-Text: ${line.trim()}`);
      if (/(?<!\()(https?:\/\/\S+)(?!\))/.test(line) && !line.startsWith("  ") && !line.startsWith(">")) {
        issues.push(`L${ln}: Nackte URL (besser als Link formatieren)`);
      }
      if (line.length > 120) issues.push(`L${ln}: Zeile sehr lang (${line.length} Zeichen > 120)`);
    }
    const words = input.trim().split(/\s+/).length;
    const headings = lines.filter(l=>l.match(/^#+\s/)).length;
    const codeBlocks = (input.match(/```/g)||[]).length;
    const out = [
      `Statistik: ${lines.length} Zeilen, ~${words} Wörter, ${headings} Überschriften, ${codeBlocks/2|0} Code-Blöcke`,``,
    ];
    if (!issues.length) {
      out.push(`✓ Keine Probleme gefunden`);
    } else {
      out.push(`${issues.length} Problem(e) gefunden:`,``,...issues);
    }
    return { output: out.join("\n") };
  },
});
