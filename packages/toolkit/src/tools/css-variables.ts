import { defineTool } from "../core";

export default defineTool({
  id: "css-variables",
  title: "CSS Custom Properties Generator",
  titleDe: "CSS-Custom-Properties-Generator",
  description: "Convert design tokens (colors, spacing, fonts) to CSS custom property declarations.",
  descriptionDe: "Design-Tokens (Farben, Abstände, Schriften) in CSS-Custom-Properties-Deklarationen konvertieren.",
  explanation: "Enter key:value pairs, one per line. Groups by prefix. Optional prefix on first line: '--prefix'.",
  explanationDe: "Schlüssel:Wert-Paare eingeben, je eine Zeile. Gruppiert nach Präfix. Optionaler Präfix in erster Zeile: '--prefix'.",
  category: "Web",
  keywords: ["css","variables","custom","properties","design","tokens","theme","color","spacing"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "color-primary: #1d6a73\ncolor-secondary: #b08d57\nspacing-xs: 4px\nspacing-sm: 8px\nfont-base: 16px",
  example: "brand-primary: #1d6a73\nbrand-secondary: #b08d57\nspace-1: 4px\nspace-2: 8px",
  useCasesDe: ["Design-System-Tokens generieren","Thema-Variablen erstellen","Token-Migration vorbereiten"],
  run: (input) => {
    const lines = input.trim().split("\n");
    let prefix = "--";
    let start = 0;
    if (lines[0]?.trim().startsWith("--")) { prefix = lines[0].trim(); start = 1; }
    const pairs: [string,string][] = [];
    for (const line of lines.slice(start)) {
      const i = line.indexOf(":");
      if (i < 0) continue;
      const k = line.slice(0,i).trim().replace(/\s+/g,"-").replace(/[^a-zA-Z0-9-]/g,"");
      const v = line.slice(i+1).trim();
      if (k && v) pairs.push([k,v]);
    }
    if (!pairs.length) throw new Error("Keine Schlüssel:Wert-Paare gefunden");
    const groups: Record<string,[string,string][]> = {};
    pairs.forEach(([k,v])=>{ const g=k.split("-")[0]; if(!groups[g])groups[g]=[]; groups[g].push([k,v]); });
    const out = [`:root {`];
    for (const [group,items] of Object.entries(groups)) {
      if (Object.keys(groups).length > 1) out.push(`  /* ${group} */`);
      items.forEach(([k,v])=>out.push(`  ${prefix}-${k}: ${v};`));
      if (Object.keys(groups).length > 1) out.push("");
    }
    out.push(`}`);
    return { output: out.join("\n") };
  },
});
