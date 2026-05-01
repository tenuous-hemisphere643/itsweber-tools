import { defineTool } from "../core";

const KEYWORDS = new Set([
  "SELECT","FROM","WHERE","JOIN","LEFT","RIGHT","INNER","OUTER","FULL","CROSS","ON","AND","OR","NOT",
  "IN","EXISTS","BETWEEN","LIKE","IS","NULL","AS","DISTINCT","ORDER","BY","GROUP","HAVING","LIMIT",
  "OFFSET","INSERT","INTO","VALUES","UPDATE","SET","DELETE","CREATE","TABLE","INDEX","VIEW","DROP",
  "ALTER","ADD","COLUMN","PRIMARY","KEY","FOREIGN","REFERENCES","UNIQUE","DEFAULT","CONSTRAINT",
  "BEGIN","COMMIT","ROLLBACK","TRANSACTION","WITH","UNION","ALL","EXCEPT","INTERSECT","CASE","WHEN",
  "THEN","ELSE","END","COUNT","SUM","AVG","MIN","MAX","COALESCE","NULLIF","CAST","CONVERT",
]);

function formatSQL(sql: string): string {
  const tokens: string[] = [];
  let i = 0;
  const s = sql.trim();

  while (i < s.length) {
    if (s[i] === "'" || s[i] === '"') {
      const q = s[i]; let j = i + 1;
      while (j < s.length && s[j] !== q) { if (s[j] === "\\") j++; j++; }
      tokens.push(s.slice(i, j + 1)); i = j + 1;
    } else if (/\s/.test(s[i])) {
      while (i < s.length && /\s/.test(s[i])) i++;
    } else if (/[(),;]/.test(s[i])) {
      tokens.push(s[i++]);
    } else {
      let j = i;
      while (j < s.length && !/[\s(),;'"]/  .test(s[j])) j++;
      tokens.push(s.slice(i, j)); i = j;
    }
  }

  const lines: string[] = [];
  let indent = 0;
  let currentLine = "";

  const NEWLINE_BEFORE = new Set(["SELECT","FROM","WHERE","JOIN","LEFT","RIGHT","INNER","OUTER","ON","AND","OR","ORDER","GROUP","HAVING","LIMIT","OFFSET","UNION","SET","VALUES","INSERT","UPDATE","DELETE","CREATE","DROP","ALTER","WITH"]);

  function flush() {
    if (currentLine.trim()) lines.push("  ".repeat(indent) + currentLine.trim());
    currentLine = "";
  }

  for (const tok of tokens) {
    const upper = tok.toUpperCase();
    if (tok === "(") { currentLine += "("; indent++; }
    else if (tok === ")") { flush(); indent = Math.max(0, indent - 1); currentLine = ")"; }
    else if (tok === ",") { currentLine += ","; flush(); }
    else if (tok === ";") { flush(); lines.push(";"); }
    else if (KEYWORDS.has(upper) && NEWLINE_BEFORE.has(upper)) {
      flush();
      currentLine = upper + " ";
    } else if (KEYWORDS.has(upper)) {
      currentLine += upper + " ";
    } else {
      currentLine += tok + " ";
    }
  }
  flush();
  return lines.join("\n");
}

export default defineTool({
  id: "sql-formatter",
  title: "SQL Formatter",
  titleDe: "SQL-Formatter",
  description: "Format and prettify SQL queries with proper indentation.",
  descriptionDe: "Formatiert SQL-Abfragen mit korrekter Einrückung und Großschreibung.",
  explanation: "Formats SQL by uppercasing keywords, adding newlines at clause boundaries, and indenting subqueries. Works with SELECT, INSERT, UPDATE, DELETE, CREATE, and more.",
  explanationDe: "Formatiert SQL durch Großschreibung von Keywords, Zeilenumbrüche an Klauseln und Einrückung von Unterabfragen. Funktioniert mit SELECT, INSERT, UPDATE, DELETE, CREATE u.v.m.",
  category: "Development",
  keywords: ["sql", "query", "format", "prettify", "database", "datenbank", "mysql", "postgres", "sqlite"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "select * from users where active=1 and role='admin' order by created_at desc limit 10",
  example: "select u.id,u.name,u.email,count(o.id) as orders from users u left join orders o on u.id=o.user_id where u.active=1 group by u.id,u.name,u.email having count(o.id)>0 order by orders desc limit 20",
  useCasesDe: ["SQL-Abfragen lesbar machen", "Datenbankdumps analysieren", "Queries in Dokumentation einbetten"],
  run: (input) => {
    if (!input.trim()) throw new Error("Enter a SQL query.");
    return { output: formatSQL(input) };
  },
});
