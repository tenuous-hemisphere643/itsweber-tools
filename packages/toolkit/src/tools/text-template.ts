import { defineTool } from "../core";

export default defineTool({
  id: "text-template",
  title: "Text Template Engine",
  titleDe: "Text-Template-Engine",
  description: "Simple mustache-style template substitution — replace {{placeholders}} with values.",
  descriptionDe: "Einfache Mustache-Vorlagenersetzung — {{Platzhalter}} mit Werten ersetzen.",
  explanation: "First block: your template with {{variables}}. Separator: --- on its own line. Second block: variable=value pairs, one per line.",
  explanationDe: "Erster Block: Vorlage mit {{Variablen}}. Trennzeichen: --- auf eigener Zeile. Zweiter Block: Variable=Wert-Paare, je eine Zeile.",
  category: "Text",
  keywords: ["template","vorlage","mustache","replace","variable","substitute","text","email","brief"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "Hallo {{name}},\nDeine Bestellung {{order_id}} ist {{status}}.\n---\nname=Alice\norder_id=#12345\nstatus=versandt",
  example: "Hallo {{name}},\nWillkommen bei {{company}}!\n---\nname=Mani\ncompany=ItsWeber",
  useCasesDe: ["E-Mail-Vorlagen befüllen","Dokumente automatisch ausfüllen","Config-Templates testen"],
  run: (input) => {
    const sepIdx = input.indexOf("\n---\n");
    if (sepIdx === -1) throw new Error("Trennzeichen '---' auf eigener Zeile fehlt");
    const template = input.slice(0, sepIdx);
    const varBlock = input.slice(sepIdx+5);
    const vars: Record<string,string> = {};
    for (const line of varBlock.split("\n")) {
      const eq = line.indexOf("=");
      if (eq > 0) { vars[line.slice(0,eq).trim()] = line.slice(eq+1); }
    }
    let result = template;
    for (const [k,v] of Object.entries(vars)) {
      result = result.replace(new RegExp(`\\{\\{\\s*${k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*\\}}`, "g"), v);
    }
    const remaining = [...result.matchAll(/\{\{(\w+)\}\}/g)].map(m=>m[1]);
    const out = [`Ergebnis:`,``,result];
    if (remaining.length) out.push(``, `⚠ Nicht ersetzt: ${[...new Set(remaining)].join(", ")}`);
    return { output: out.join("\n") };
  },
});
