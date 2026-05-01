import { defineTool } from "../core";

export default defineTool({
  id: "graphql-tools",
  title: "GraphQL Query Builder",
  titleDe: "GraphQL-Query-Builder",
  description: "Generate GraphQL queries, mutations, and fragments from field descriptions.",
  descriptionDe: "GraphQL-Queries, Mutations und Fragments aus Feldbeschreibungen generieren.",
  explanation: "Enter: type (query/mutation/subscription), operation name, and fields (one per line). Nested fields with indentation.",
  explanationDe: "Typ eingeben (query/mutation/subscription), Operationsname und Felder (je Zeile). Verschachtelte Felder mit Einrückung.",
  category: "Development",
  keywords: ["graphql","query","mutation","subscription","api","gql","schema","fields"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "query GetUser\nid\nname\nemail\n  profile\n    avatar\n    bio",
  example: "mutation CreatePost\ntitle\ncontent\nauthor { id name }",
  useCasesDe: ["GraphQL-Queries schnell erstellen","API-Anfragen strukturieren","Schema erkunden"],
  run: (input) => {
    const lines = input.trim().split("\n");
    const firstLine = lines[0].trim();
    const m = firstLine.match(/^(query|mutation|subscription)\s+(\w+)(.*)$/i);
    if (!m) throw new Error("Format: 'query OperationName' oder 'mutation CreateItem'");
    const opType = m[1].toLowerCase();
    const opName = m[2];
    const args = m[3].trim();
    const buildFields = (lines: string[], baseIndent=0): string => {
      let result = "";
      let i = 0;
      while (i < lines.length) {
        const line = lines[i];
        const indent = line.length - line.trimStart().length;
        if (indent < baseIndent) break;
        const field = line.trim();
        if (!field) { i++; continue; }
        if (i+1 < lines.length) {
          const nextIndent = lines[i+1].length - lines[i+1].trimStart().length;
          if (nextIndent > indent) {
            const sub = [];
            i++;
            while (i < lines.length && (lines[i].length - lines[i].trimStart().length) > indent) {
              sub.push(lines[i]); i++;
            }
            result += `${"  ".repeat(indent+1)}${field} {\n${buildFields(sub, indent+1)}\n${"  ".repeat(indent+1)}}\n`;
            continue;
          }
        }
        result += `${"  ".repeat(indent+1)}${field}\n`;
        i++;
      }
      return result;
    };
    const fields = buildFields(lines.slice(1));
    const query = `${opType} ${opName}${args?" "+args:""} {\n${fields}}`;
    const curlCmd = `curl -X POST https://api.example.com/graphql \\\n  -H "Content-Type: application/json" \\\n  -d '{"query": ${JSON.stringify(query)}}'`;
    return { output: [query, ``, `# cURL:`, curlCmd].join("\n") };
  },
});
