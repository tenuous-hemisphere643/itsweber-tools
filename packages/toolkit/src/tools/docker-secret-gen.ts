import { defineTool } from "../core";

export default defineTool({
  id: "docker-secret-gen",
  title: "Docker Secret Generator",
  titleDe: "Docker-Secret-Generator",
  description: "Generate Docker Swarm secrets and Compose secret declarations.",
  descriptionDe: "Docker-Swarm-Secrets und Compose-Secret-Deklarationen generieren.",
  explanation: "Enter secret names (one per line) to get Docker Swarm CLI commands and Compose YAML snippets.",
  explanationDe: "Secret-Namen eingeben (je eine Zeile) → Docker-Swarm-CLI-Befehle und Compose-YAML-Snippets.",
  category: "ItsWeber Ops",
  keywords: ["docker","secret","swarm","compose","security","password","token","credential"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "db_password\napi_key\njwt_secret",
  example: "db_password\nredis_password",
  useCasesDe: ["Swarm-Secrets einrichten","Compose-Secret-Config erstellen","Sichere Credentials verwalten"],
  run: (input) => {
    const secrets = input.trim().split("\n").map(s=>s.trim()).filter(Boolean);
    if (!secrets.length) throw new Error("Mindestens einen Secret-Namen eingeben");
    const cli = secrets.map(s=>[
      `# ${s}:`,
      `echo "$(openssl rand -base64 32)" | docker secret create ${s} -`,
      `# oder aus Datei:`,
      `docker secret create ${s} /path/to/${s}.txt`,
    ].join("\n"));
    const composeSecrets = secrets.map(s=>`  ${s}:\n    external: true`).join("\n");
    const serviceSecrets = secrets.map(s=>`      - ${s}`).join("\n");
    const serviceUse = secrets.map(s=>`      ${s.toUpperCase()}: /run/secrets/${s}`).join("\n");
    return { output: [
      `# ── CLI: Secrets erstellen ──────────────────────`,
      cli.join("\n\n"),``,
      `# ── Liste & Verwalten ───────────────────────────`,
      `docker secret ls`,
      `docker secret inspect ${secrets[0]}`,
      `docker secret rm ${secrets[0]}`,``,
      `# ── docker-compose.yml ──────────────────────────`,
      `version: "3.9"`,
      `services:`,
      `  app:`,
      `    image: myapp`,
      `    secrets:`,
      serviceSecrets,
      `    environment:`,
      serviceUse,``,
      `secrets:`,
      composeSecrets,
    ].join("\n") };
  },
});
