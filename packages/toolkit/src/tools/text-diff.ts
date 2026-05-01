import { defineTool } from "../core";

function lcs(a: string[], b: string[]): number[][] {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp;
}

function diff(a: string[], b: string[]): Array<{ op: "=" | "+" | "-"; line: string }> {
  const dp = lcs(a, b);
  const result: Array<{ op: "=" | "+" | "-"; line: string }> = [];
  let i = a.length, j = b.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) { result.unshift({ op: "=", line: a[i - 1] }); i--; j--; }
    else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) { result.unshift({ op: "+", line: b[j - 1] }); j--; }
    else { result.unshift({ op: "-", line: a[i - 1] }); i--; }
  }
  return result;
}

export default defineTool({
  id: "text-diff",
  title: "Text Diff",
  titleDe: "Text-Diff",
  description: "Compare two text blocks line by line — shows added, removed, unchanged lines.",
  descriptionDe: "Vergleicht zwei Textblöcke zeilenweise — zeigt hinzugefügte, entfernte und unveränderte Zeilen.",
  explanation: "Performs a line-level diff between two texts separated by '---'. Uses LCS (longest common subsequence) algorithm. + = added, - = removed, = = unchanged.",
  explanationDe: "Vergleicht zwei durch '---' getrennte Texte zeilenweise. Nutzt LCS-Algorithmus. + = hinzugefügt, - = entfernt, = = unverändert.",
  category: "Development",
  keywords: ["diff", "compare", "text", "lines", "vergleich", "änderungen", "changes", "lcs"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "First text block\n---\nSecond text block",
  example: "server {\n    listen 80;\n    server_name old.example.com;\n}\n---\nserver {\n    listen 80;\n    listen 443 ssl;\n    server_name new.example.com;\n}",
  useCasesDe: ["Konfig-Änderungen dokumentieren", "Merge-Konflikte verstehen", "Textvarianten vergleichen"],
  run: (input) => {
    const sep = input.indexOf("\n---\n");
    if (sep === -1) throw new Error("Separate the two texts with a line containing only '---'.");
    const aLines = input.slice(0, sep).split("\n");
    const bLines = input.slice(sep + 5).split("\n");
    const result = diff(aLines, bLines);
    const added   = result.filter((r) => r.op === "+").length;
    const removed = result.filter((r) => r.op === "-").length;
    const equal   = result.filter((r) => r.op === "=").length;
    const lines = [
      `+${added} added  -${removed} removed  =${equal} unchanged`,
      "",
      ...result.map((r) => `${r.op === "=" ? " " : r.op} ${r.line}`),
    ];
    return { output: lines.join("\n") };
  },
});
