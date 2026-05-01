import { defineTool } from "../core";

function formatEnv(value: string): string {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [key, ...rest] = line.split("=");
      return `${key.trim().toUpperCase()}=${rest.join("=").trim()}`;
    })
    .sort((a, b) => a.localeCompare(b))
    .join("\n");
}

export default defineTool({
  id: "env-formatter",
  title: ".env Formatter",
  titleDe: ".env-Formatierer",
  description: "Sorts and normalizes environment variable files.",
  descriptionDe: "Sortiert und normalisiert Umgebungsvariablen-Dateien.",
  explanation:
    ".env files can become messy quickly. This tool sorts keys and normalizes the format for review or documentation.",
  explanationDe:
    ".env-Dateien werden schnell unübersichtlich. Dieses Tool sortiert Schlüssel und normalisiert das Format für Review oder Dokumentation.",
  category: "ItsWeber Ops",
  keywords: ["env", "dotenv", "config"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "Paste .env content...",
  example: "PORT=8080\nAPP_NAME=ItsWeber Tools\nNODE_ENV=production",
  run: (input) => ({ output: formatEnv(input) }),
});
