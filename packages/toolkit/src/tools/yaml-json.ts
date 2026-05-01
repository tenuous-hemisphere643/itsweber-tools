import { defineTool } from "../core";

// ── JSON → YAML ──

function toYaml(obj: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (obj === null) return "null";
  if (typeof obj === "boolean" || typeof obj === "number") return String(obj);
  if (typeof obj === "string") {
    if (/[\n:#{}&*!|>'"%@`]/.test(obj) || obj.trim() !== obj || obj === "") {
      return `"${obj.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return obj.map((item) => {
      const val = toYaml(item, indent + 1);
      const multiline = typeof item === "object" && item !== null && !Array.isArray(item);
      return multiline ? `${pad}-\n${val}` : `${pad}- ${val}`;
    }).join("\n");
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    return entries.map(([k, v]) => {
      const isComplex = typeof v === "object" && v !== null;
      const val = toYaml(v, indent + 1);
      return isComplex ? `${pad}${k}:\n${val}` : `${pad}${k}: ${val}`;
    }).join("\n");
  }
  return String(obj);
}

// ── YAML → JSON ──

function parseYaml(yaml: string): unknown {
  const lines = yaml.split("\n");
  const root: Record<string, unknown> = {};
  const stack: Array<{ obj: Record<string, unknown> | unknown[]; indent: number; key?: string }> = [
    { obj: root, indent: -1 },
  ];

  function top() { return stack[stack.length - 1]; }

  function scalar(s: string): unknown {
    if (s === "null" || s === "~") return null;
    if (s === "true") return true;
    if (s === "false") return false;
    if (/^-?\d+$/.test(s)) return parseInt(s, 10);
    if (/^-?\d+\.\d+$/.test(s)) return parseFloat(s);
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1);
    return s;
  }

  for (const rawLine of lines) {
    const stripped = rawLine.replace(/#.*$/, "").trimEnd();
    if (!stripped.trim()) continue;
    const indent = stripped.length - stripped.trimStart().length;
    const trimmed = stripped.trimStart();

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
    const parent = top();

    if (trimmed.startsWith("- ")) {
      const val = scalar(trimmed.slice(2).trim());
      if (!Array.isArray(parent.obj)) {
        const arr: unknown[] = [];
        if (parent.key !== undefined) {
          (stack[stack.length - 2]?.obj as Record<string, unknown>)[parent.key] = arr;
        }
        stack.push({ obj: arr, indent });
        arr.push(val);
      } else {
        (parent.obj as unknown[]).push(val);
      }
    } else if (trimmed.includes(":")) {
      const colonIdx = trimmed.indexOf(":");
      const key = trimmed.slice(0, colonIdx).trim();
      const rest = trimmed.slice(colonIdx + 1).trim();
      if (!rest) {
        const newObj: Record<string, unknown> = {};
        if (!Array.isArray(parent.obj)) (parent.obj as Record<string, unknown>)[key] = newObj;
        stack.push({ obj: newObj, indent, key });
      } else {
        if (!Array.isArray(parent.obj)) (parent.obj as Record<string, unknown>)[key] = scalar(rest);
      }
    }
  }
  return root;
}

// ── Auto-detect ──

function isLikelyJson(s: string): boolean {
  const t = s.trim();
  return t.startsWith("{") || t.startsWith("[");
}

export default defineTool({
  id: "yaml-json",
  title: "YAML ↔ JSON Converter",
  titleDe: "YAML ↔ JSON Konverter",
  description: "Convert YAML to JSON or JSON to YAML — direction is auto-detected.",
  descriptionDe: "Wandelt YAML in JSON oder JSON in YAML — Richtung wird automatisch erkannt.",
  explanation:
    "Paste JSON (starting with { or [) to get YAML. Paste YAML to get JSON. Direction is auto-detected. Useful for Kubernetes manifests, Docker Compose, Ansible, and config files.",
  explanationDe:
    "JSON einfügen (beginnt mit { oder [) → YAML. YAML einfügen → JSON. Richtung wird automatisch erkannt. Nützlich für Kubernetes-Manifeste, Docker Compose, Ansible und Konfigurationsdateien.",
  category: "Converter",
  keywords: ["yaml", "yml", "json", "convert", "konvertieren", "kubernetes", "k8s", "docker", "compose", "ansible", "config"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "JSON oder YAML einfügen — Richtung wird erkannt",
  example: "name: itsweber-tools\nimage: nginx:alpine\nport: 8080\nenvironment:\n  NODE_ENV: production",
  useCasesDe: [
    "K8s-Manifeste und Docker-Compose konvertieren",
    "JSON-API-Antworten als YAML strukturieren",
    "Ansible-Variablen umwandeln",
  ],
  run: (input) => {
    const trimmed = input.trim();
    if (isLikelyJson(trimmed)) {
      let parsed: unknown;
      try { parsed = JSON.parse(trimmed); } catch { throw new Error("Ungültiges JSON."); }
      return {
        output: [`Modus:   JSON → YAML`, ``, toYaml(parsed)].join("\n"),
      };
    }
    try {
      const parsed = parseYaml(trimmed);
      return {
        output: [`Modus:   YAML → JSON`, ``, JSON.stringify(parsed, null, 2)].join("\n"),
      };
    } catch (e) {
      throw new Error(`YAML-Parse-Fehler: ${e instanceof Error ? e.message : e}`);
    }
  },
});
