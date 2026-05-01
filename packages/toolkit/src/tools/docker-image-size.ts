import { defineTool } from "../core";

export default defineTool({
  id: "docker-image-size",
  title: "Docker Image Size Optimizer",
  titleDe: "Docker-Image-Größen-Optimierer",
  description: "Analyze Dockerfile for size-optimization opportunities and best practices.",
  descriptionDe: "Dockerfile auf Größenoptimierungsmöglichkeiten und Best Practices analysieren.",
  explanation: "Paste a Dockerfile to get optimization suggestions: multi-stage, layer merging, cache ordering, unnecessary files.",
  explanationDe: "Dockerfile einfügen → Optimierungsvorschläge: Multi-Stage, Layer-Zusammenführen, Cache-Reihenfolge, unnötige Dateien.",
  category: "ItsWeber Ops",
  keywords: ["docker","image","size","optimize","layer","dockerfile","multi-stage","cache","build"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "FROM ubuntu:latest\nRUN apt-get update\nRUN apt-get install -y curl\nCOPY . .\nRUN npm install",
  example: "FROM node:18\nWORKDIR /app\nCOPY . .\nRUN npm install && npm run build",
  useCasesDe: ["CI/CD-Images optimieren","Build-Zeit verkürzen","Sicherheit verbessern"],
  run: (input) => {
    const lines = input.trim().split("\n").filter(l=>l.trim()&&!l.trim().startsWith("#"));
    const tips: string[] = [];
    const warns: string[] = [];
    const froms = lines.filter(l=>l.trim().toUpperCase().startsWith("FROM"));
    const isMultiStage = froms.length > 1;
    const runs = lines.filter(l=>l.trim().toUpperCase().startsWith("RUN"));
    const consecutiveRuns = runs.length > 1;
    if (froms.some(l=>/ubuntu:latest|debian:latest|node:latest/i.test(l))) warns.push("':latest'-Tag vermeiden — führt zu nicht-reproduzierbaren Builds");
    if (froms.some(l=>/^FROM ubuntu|^FROM debian/i.test(l.trim())) && !isMultiStage) tips.push("Alpine oder Slim-Variante verwenden: 'ubuntu' → 'ubuntu:22.04-slim' oder 'alpine'");
    if (consecutiveRuns && !isMultiStage) tips.push(`${runs.length} separate RUN-Befehle → zu einem zusammenführen mit '&&' (weniger Layer, kleineres Image)`);
    if (!isMultiStage && lines.some(l=>/npm install|pip install|go build|mvn package/i.test(l))) tips.push("Multi-Stage-Build verwenden: Build-Dependencies im Builder-Stage, nur Runtime im finalen Image");
    if (lines.some(l=>/apt-get install/i.test(l)) && !lines.some(l=>/--no-install-recommends/i.test(l))) tips.push("'apt-get install --no-install-recommends' verwenden (spart ~30-50% bei vielen Paketen)");
    if (lines.some(l=>/apt-get/i.test(l)) && !lines.some(l=>/apt-get clean|rm.*apt/i.test(l))) tips.push("Nach apt-get: '&& apt-get clean && rm -rf /var/lib/apt/lists/*' hinzufügen");
    if (!lines.some(l=>l.trim().toUpperCase().startsWith(".DOCKERIGNORE")) && lines.some(l=>/COPY \. /i.test(l))) tips.push(".dockerignore hinzufügen: node_modules, .git, *.log, .env ausschließen");
    const copyIdx = lines.findIndex(l=>l.trim().toUpperCase().startsWith("COPY"));
    const runIdx = lines.findIndex(l=>l.trim().toUpperCase().startsWith("RUN"));
    if (copyIdx !== -1 && runIdx !== -1 && copyIdx < runIdx) tips.push("Reihenfolge: Zuerst nur package.json COPY+RUN install, dann COPY . . (besseres Layer-Caching)");
    if (lines.some(l=>/USER root/i.test(l))) warns.push("Nicht als root laufen — USER-Direktive mit Nicht-Root-User verwenden");
    if (!lines.some(l=>l.trim().toUpperCase().startsWith("USER"))) tips.push("Sicherheit: 'USER nonroot' oder eigenen User erstellen");
    const out: string[] = [];
    if (warns.length) { out.push(`⚠ Warnungen (${warns.length}):`,...warns.map(w=>`  → ${w}`),``); }
    if (tips.length) { out.push(`💡 Optimierungsvorschläge (${tips.length}):`,...tips.map(t=>`  → ${t}`),``); }
    out.push(`Statistik:  ${froms.length} Stage(s), ${runs.length} RUN-Layer, ${lines.length} Zeilen gesamt`);
    if (isMultiStage) out.push(`✓ Multi-Stage-Build erkannt`);
    if (!warns.length && !tips.length) out.push(`✓ Keine offensichtlichen Probleme gefunden`);
    return { output: out.join("\n") };
  },
});
