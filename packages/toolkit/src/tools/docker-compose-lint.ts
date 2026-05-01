import { defineTool } from "../core";

const KNOWN_TOP_KEYS = new Set(["version", "services", "networks", "volumes", "configs", "secrets"]);
const SERVICE_KEYS = new Set(["image","build","container_name","ports","volumes","environment","env_file","depends_on","networks","restart","command","entrypoint","labels","healthcheck","deploy","logging","expose","extra_hosts","user","working_dir","hostname","dns","cap_add","cap_drop","devices","privileged","read_only","stdin_open","tty","ulimits","stop_grace_period","stop_signal","profiles","platform","pull_policy","mem_limit","cpus"]);

export default defineTool({
  id: "docker-compose-lint",
  title: "Docker Compose Linter",
  titleDe: "Docker Compose Linter",
  description: "Lint a Docker Compose YAML for common mistakes and best-practice warnings.",
  descriptionDe: "Prüft ein Docker-Compose-YAML auf häufige Fehler und Best-Practice-Warnungen.",
  explanation: "Checks Docker Compose files for unknown top-level keys, services without images, missing restart policies, privileged mode, and other common issues.",
  explanationDe: "Prüft Compose-Dateien auf unbekannte Top-Level-Keys, Services ohne Image, fehlende Restart-Policy, Privileged-Mode und weitere häufige Probleme.",
  category: "ItsWeber Ops",
  keywords: ["docker", "compose", "docker-compose", "lint", "yaml", "validate", "container", "ops"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "version: '3.8'\nservices:\n  web:\n    image: nginx:alpine\n    ports:\n      - '80:80'",
  example: "version: '3.8'\nservices:\n  web:\n    image: nginx:alpine\n    ports:\n      - '80:80'\n    restart: unless-stopped\n  db:\n    image: postgres:15\n    environment:\n      POSTGRES_PASSWORD: secret\n    volumes:\n      - pgdata:/var/lib/postgresql/data\nvolumes:\n  pgdata:",
  useCasesDe: ["Compose-Dateien vor Deployment prüfen", "Best Practices für Unraid-Stacks", "Häufige Fehler vermeiden"],
  run: (input) => {
    const warnings: string[] = [];
    const infos: string[] = [];
    const errors: string[] = [];

    const lines = input.split("\n");
    let inServices = false;
    let currentService = "";
    const services: Record<string, Record<string, boolean>> = {};

    for (const line of lines) {
      const trimmed = line.trimStart();
      const indent = line.length - trimmed.length;

      if (trimmed.startsWith("services:")) { inServices = true; continue; }
      if (inServices && indent === 2 && !trimmed.startsWith("-") && trimmed.endsWith(":")) {
        currentService = trimmed.slice(0, -1);
        services[currentService] = {};
      }
      if (currentService && indent === 4) {
        const key = trimmed.split(":")[0].trim();
        if (key) services[currentService][key] = true;
        if (!SERVICE_KEYS.has(key) && key && !trimmed.startsWith("-")) {
          warnings.push(`Service '${currentService}': unknown key '${key}'`);
        }
      }
    }

    for (const [svc, keys] of Object.entries(services)) {
      if (!keys["image"] && !keys["build"]) errors.push(`Service '${svc}': missing 'image' or 'build'`);
      if (!keys["restart"]) warnings.push(`Service '${svc}': no 'restart' policy (suggest: unless-stopped)`);
      if (keys["privileged"]) warnings.push(`Service '${svc}': runs privileged — security risk`);
      if (keys["environment"] && !keys["env_file"]) infos.push(`Service '${svc}': env vars inline — consider using env_file for secrets`);
    }

    const topKeys = lines.filter((l) => !l.startsWith(" ") && l.includes(":")).map((l) => l.split(":")[0].trim());
    for (const k of topKeys) {
      if (k && !KNOWN_TOP_KEYS.has(k)) warnings.push(`Unknown top-level key: '${k}'`);
    }

    const serviceCount = Object.keys(services).length;
    const allLines = [
      `Services found: ${serviceCount} (${Object.keys(services).join(", ") || "none"})`,
      ``,
      ...errors.map((e) => `✗ ERROR:   ${e}`),
      ...warnings.map((w) => `⚠ WARNING: ${w}`),
      ...infos.map((i) => `· INFO:    ${i}`),
      ...(errors.length + warnings.length + infos.length === 0 ? [`✓ No issues found.`] : []),
    ];

    return { output: allLines.join("\n") };
  },
});
