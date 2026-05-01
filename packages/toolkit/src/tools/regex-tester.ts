import { defineTool } from "../core";

export default defineTool({
  id: "regex-tester",
  title: "Regex Tester",
  titleDe: "Regex-Tester",
  description: "Test a regular expression against text — shows all matches with groups.",
  descriptionDe: "Testet einen regulären Ausdruck gegen Text — zeigt alle Treffer mit Gruppen.",
  explanation: "Enter your regex on the first line (with optional flags like /gi), then the test text. Shows all matches, captured groups, and positions.",
  explanationDe: "Regex in der ersten Zeile eingeben (optionale Flags wie /gi), dann den Testtext. Zeigt alle Treffer, Gruppen und Positionen.",
  category: "Development",
  keywords: ["regex", "regexp", "regular expression", "pattern", "match", "test", "suchen"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "/\\d+/g\n\nTest text with numbers like 42 and 1337",
  example: "/(?<word>\\b[A-Z][a-z]+\\b)/g\n\nItsWeber Tools is a Docker-first IT Workbench",
  useCasesDe: ["Log-Patterns entwickeln", "Nginx-Rewrite-Regeln testen", "Input-Validierung prüfen"],
  run: (input) => {
    const lines = input.split("\n");
    const firstLine = lines[0].trim();
    const text = lines.slice(1).join("\n").trimStart();

    let pattern: string, flags: string;
    const regexLiteral = firstLine.match(/^\/(.+)\/([gimsuy]*)$/);
    if (regexLiteral) {
      [, pattern, flags] = regexLiteral;
    } else {
      pattern = firstLine;
      flags = "g";
    }

    let re: RegExp;
    try { re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g"); }
    catch (e) { throw new Error(`Invalid regex: ${e instanceof Error ? e.message : e}`); }

    const matches: RegExpExecArray[] = [];
    let m: RegExpExecArray | null;
    let safety = 0;
    while ((m = re.exec(text)) !== null && safety++ < 500) {
      matches.push(m);
      if (!flags.includes("g")) break;
    }

    if (matches.length === 0) {
      return { output: `Pattern: /${pattern}/${flags}\nText length: ${text.length} chars\n\n✗ No matches found.` };
    }

    const lines2 = [
      `Pattern: /${pattern}/${flags}`,
      `Matches: ${matches.length}`,
      "",
      ...matches.map((match, i) => {
        const groups = match.groups
          ? Object.entries(match.groups).map(([k, v]) => `    group[${k}]: ${JSON.stringify(v)}`).join("\n")
          : "";
        const numbered = match.slice(1).map((g, gi) => `    $${gi + 1}: ${JSON.stringify(g)}`).join("\n");
        return [
          `[${i + 1}] index ${match.index}: ${JSON.stringify(match[0])}`,
          numbered || groups ? (groups || numbered) : "",
        ].filter(Boolean).join("\n");
      }),
    ];
    return { output: lines2.join("\n") };
  },
});
