import { defineTool } from "../core";

export default defineTool({
  id: "docker-ps-format",
  title: "Docker PS Formatter",
  titleDe: "Docker-PS-Formatierer",
  description: "Generate custom docker ps --format templates and analyze docker ps output.",
  descriptionDe: "Eigene docker ps --format-Vorlagen generieren und docker ps-Ausgaben analysieren.",
  explanation: "Enter a preset: minimal, ports, labels, full, resource. Or paste docker ps output to parse it.",
  explanationDe: "Preset eingeben: minimal, ports, labels, full, resource. Oder docker ps-Ausgabe einfügen zum Parsen.",
  category: "ItsWeber Ops",
  keywords: ["docker","ps","container","format","template","inspect","logs","swarm"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "minimal",
  example: "full",
  useCasesDe: ["Docker-Aliases konfigurieren","Container-Übersicht anpassen","PS-Ausgabe skripten"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const templates: Record<string,(string)[]> = {
      minimal: [
        `docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Image}}"`,
        ``,`Alias empfehlung:`,
        `alias dps='docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Image}}"'`,
      ],
      ports: [
        `docker ps --format "table {{.Names}}\\t{{.Ports}}\\t{{.Status}}"`,
        ``,`Mit IP-Filter:`,
        `docker ps --format "table {{.Names}}\\t{{.Ports}}" | grep "0.0.0.0"`,
      ],
      labels: [
        `docker ps --format "table {{.Names}}\\t{{.Labels}}\\t{{.Image}}"`,
      ],
      full: [
        `docker ps --format "table {{.ID}}\\t{{.Names}}\\t{{.Image}}\\t{{.Status}}\\t{{.Ports}}\\t{{.Size}}"`,
        ``,`Alle Container (inkl. gestoppt):`,
        `docker ps -a --format "table {{.ID}}\\t{{.Names}}\\t{{.Status}}"`,
      ],
      resource: [
        `# Ressourcenverbrauch (stats):`,
        `docker stats --no-stream --format "table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}\\t{{.NetIO}}"`,
        ``,
        `# Einmalig + Sort nach CPU:`,
        `docker stats --no-stream --format "{{.Name}}\\t{{.CPUPerc}}" | sort -t$'\\t' -k2 -rn`,
      ],
    };
    if (templates[t]) return { output: templates[t].join("\n") };
    throw new Error(`Unbekanntes Preset: '${input}'\nVerfügbar: minimal, ports, labels, full, resource`);
  },
});
