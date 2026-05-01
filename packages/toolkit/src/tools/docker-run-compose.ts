import { defineTool } from "../core";
import { slugify } from "../shared";

function dockerRunToCompose(value: string): string {
  const tokens =
    value.match(/"[^"]+"|'[^']+'|\S+/g)?.map((token) => token.replace(/^['"]|['"]$/g, "")) ?? [];
  const image =
    [...tokens]
      .reverse()
      .find((token) => !token.startsWith("-") && token !== "docker" && token !== "run") ?? "image:tag";
  const nameIndex = tokens.findIndex((token) => token === "--name");
  const name = nameIndex >= 0 ? tokens[nameIndex + 1] : "itsweber-tools";
  const ports = tokens.flatMap((token, index) =>
    token === "-p" || token === "--publish" ? [tokens[index + 1]] : [],
  );
  const portLines = ports.length ? ports.map((port) => `      - "${port}"`).join("\n") : '      - "8080:80"';
  return [
    "services:",
    `  ${slugify(name) || "app"}:`,
    `    image: ${image}`,
    "    container_name: " + name,
    "    restart: unless-stopped",
    "    ports:",
    portLines,
  ].join("\n");
}

export default defineTool({
  id: "docker-run-compose",
  title: "Docker Run to Compose",
  titleDe: "Docker Run zu Compose",
  description: "Creates a compact compose service from a docker run command.",
  descriptionDe: "Erstellt aus einem docker-run-Befehl einen kompakten Compose-Service.",
  explanation:
    "Useful when you found a docker run example but want a maintainable docker-compose.yml for a server or Unraid setup.",
  explanationDe:
    "Praktisch, wenn du ein docker-run-Beispiel gefunden hast, aber für Server oder Unraid lieber eine wartbare docker-compose.yml möchtest.",
  category: "ItsWeber Ops",
  keywords: ["docker", "compose", "unraid"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "Paste docker run command...",
  example:
    "docker run -d --name itsweber-tools -p 8080:80 ghcr.io/itsweber-official/itsweber-tools:latest",
  run: (input) => ({ output: dockerRunToCompose(input) }),
});
