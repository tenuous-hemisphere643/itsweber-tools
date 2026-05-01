import { defineTool } from "../core";

export default defineTool({
  id: "api-status-monitor",
  title: "API Health Check Snippet",
  titleDe: "API-Health-Check-Snippet",
  description: "Generate health check scripts and monitoring snippets for HTTP APIs.",
  descriptionDe: "Health-Check-Skripte und Monitoring-Snippets für HTTP-APIs generieren.",
  explanation: "Enter a URL to get health check snippets in bash/curl, JavaScript fetch, and docker-compose healthcheck format.",
  explanationDe: "URL eingeben → Health-Check-Snippets in bash/curl, JavaScript fetch und docker-compose healthcheck Format.",
  category: "ItsWeber Ops",
  keywords: ["health","check","api","monitor","curl","uptime","docker","ping","alive"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "https://api.example.com/health",
  example: "http://localhost:3000/health",
  useCasesDe: ["Docker-Healthchecks einrichten","CI/CD-Health-Gates","Monitoring-Scripts"],
  run: (input) => {
    const url = input.trim();
    if (!url.startsWith("http")) throw new Error("URL muss mit http:// oder https:// beginnen");
    return { output: [
      `# Bash / cURL One-Liner:`,
      `curl -sf "${url}" || echo "DOWN"`,``,
      `# Bash mit Retry:`,
      `until curl -sf "${url}"; do echo "Waiting..."; sleep 5; done`,``,
      `# JavaScript (fetch):`,
      `const res = await fetch("${url}");`,
      `if (!res.ok) throw new Error(\`Health check failed: \${res.status}\`);`,``,
      `# Docker Compose healthcheck:`,
      `healthcheck:`,
      `  test: ["CMD", "curl", "-sf", "${url}"]`,
      `  interval: 30s`,
      `  timeout: 10s`,
      `  retries: 3`,
      `  start_period: 40s`,``,
      `# Kubernetes liveness probe:`,
      `livenessProbe:`,
      `  httpGet:`,
      `    path: ${new URL(url).pathname}`,
      `    port: ${new URL(url).port || (url.startsWith("https") ? 443 : 80)}`,
      `  initialDelaySeconds: 30`,
      `  periodSeconds: 10`,
    ].join("\n") };
  },
});
