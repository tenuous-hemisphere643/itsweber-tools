import { defineTool } from "../core";

function parseYaml(text: string): unknown {
  const lines = text.split("\n");
  const root: Record<string, unknown> = {};
  const stack: Array<{obj: Record<string,unknown>|unknown[], indent: number, key: string}> = [];
  let current: Record<string,unknown>|unknown[] = root;
  for (let i=0; i<lines.length; i++) {
    const raw = lines[i];
    if (!raw.trim() || raw.trim().startsWith("#")) continue;
    const indent = raw.length - raw.trimStart().length;
    const line = raw.trim();
    while (stack.length && stack[stack.length-1].indent >= indent) stack.pop();
    if (stack.length) current = stack[stack.length-1].obj as Record<string,unknown>;
    if (line.startsWith("- ")) {
      const val = line.slice(2).trim();
      if (Array.isArray(current)) {
        (current as Array<unknown>).push(val.startsWith("{") ? {} : val);
      }
      continue;
    }
    const m = line.match(/^([^:]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    const val = m[2].trim();
    if (!val) {
      const next = lines[i+1];
      if (next&&next.trim().startsWith("- ")) {
        const arr: unknown[] = [];
        (current as Record<string,unknown>)[key] = arr;
        stack.push({obj:arr as unknown[], indent, key});
      } else {
        const obj: Record<string,unknown> = {};
        (current as Record<string,unknown>)[key] = obj;
        stack.push({obj, indent, key});
      }
    } else {
      let parsed: unknown = val;
      if (val==="true") parsed=true;
      else if (val==="false") parsed=false;
      else if (val==="null"||val==="~") parsed=null;
      else if (!isNaN(Number(val))) parsed=Number(val);
      else if ((val.startsWith('"')&&val.endsWith('"'))||(val.startsWith("'")&&val.endsWith("'"))) parsed=val.slice(1,-1);
      (current as Record<string,unknown>)[key] = parsed;
    }
  }
  return root;
}

export default defineTool({
  id: "yaml-validator",
  title: "YAML Validator",
  titleDe: "YAML-Validator",
  description: "Validate YAML syntax and show structure statistics.",
  descriptionDe: "YAML-Syntax validieren und Strukturstatistiken anzeigen.",
  explanation: "Paste YAML to validate syntax and see key count, nesting depth, and structure overview.",
  explanationDe: "YAML einfügen → Syntax validieren, Schlüsselanzahl, Verschachtelungstiefe und Struktur-Übersicht.",
  category: "Development",
  keywords: ["yaml","validate","lint","config","docker","kubernetes","k8s","ansible"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "name: ItsWeber\nversion: 2.0\nfeatures:\n  - tools\n  - docker",
  example: "services:\n  app:\n    image: nginx:alpine\n    ports:\n      - \"80:80\"",
  useCasesDe: ["Docker-Compose validieren","K8s-Manifests prüfen","Ansible-Playbooks kontrollieren"],
  run: (input) => {
    try {
      const parsed = parseYaml(input);
      const countKeys = (obj: unknown, depth=0): [number,number] => {
        if (typeof obj !== "object" || !obj) return [0,depth];
        let keys=0, maxDepth=depth;
        for (const v of Object.values(obj as object)) {
          keys++;
          const [k,d] = countKeys(v, depth+1);
          keys+=k; maxDepth=Math.max(maxDepth,d);
        }
        return [keys,maxDepth];
      };
      const [keys,depth] = countKeys(parsed);
      const lineCount = input.trim().split("\n").length;
      return { output: [
        `✓ YAML ist gültig`,``,
        `Zeilen:          ${lineCount}`,
        `Schlüssel:       ${keys}`,
        `Verschachtelung: ${depth} Ebenen`,
        ``,
        `Vorschau (erste 5 Top-Level-Keys):`,
        ...Object.keys(parsed as object).slice(0,5).map(k=>`  ${k}: ${JSON.stringify((parsed as Record<string,unknown>)[k]).slice(0,60)}`),
      ].join("\n") };
    } catch(e) {
      throw new Error(`YAML-Fehler: ${(e as Error).message}`);
    }
  },
});
