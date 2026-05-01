import { defineTool } from "../core";

export default defineTool({
  id: "container-healthcheck",
  title: "Container Healthcheck Builder",
  titleDe: "Container-Healthcheck-Builder",
  description: "Generate HEALTHCHECK instructions for Dockerfiles and healthcheck sections for Docker Compose.",
  descriptionDe: "HEALTHCHECK-Instruktionen für Dockerfiles und healthcheck-Sektionen für Docker Compose generieren.",
  explanation: "Enter a check type: http, tcp, cmd, postgres, redis, mysql, mongo, rabbit. Optional params: port, path, user, pass.",
  explanationDe: "Check-Typ eingeben: http, tcp, cmd, postgres, redis, mysql, mongo, rabbit. Optional: port, path, user, pass.",
  category: "ItsWeber Ops",
  keywords: ["docker","healthcheck","health","dockerfile","compose","check","monitor","alive"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "http",
  example: "postgres",
  useCasesDe: ["Dockerfile-Healthchecks","Compose-Monitoring","Service-Abhängigkeiten"],
  run: (input) => {
    const lines = input.trim().split("\n");
    const kv: Record<string,string> = {};
    let type = lines[0].trim().toLowerCase();
    for (const line of lines.slice(1)) {
      const i = line.indexOf(":");
      if (i > 0) kv[line.slice(0,i).trim().toLowerCase()] = line.slice(i+1).trim();
    }
    const port = kv.port;
    const path = kv.path || "/health";
    const interval = kv.interval || "30s";
    const timeout = kv.timeout || "10s";
    const retries = kv.retries || "3";
    const start = kv.start_period || "40s";
    const mkDockerfile = (cmd: string) => `HEALTHCHECK --interval=${interval} --timeout=${timeout} --start-period=${start} --retries=${retries} \\\n  CMD ${cmd}`;
    const mkCompose = (cmd: string) => `healthcheck:\n  test: ${JSON.stringify(cmd.split(" ").flatMap(s=>s.includes(" ")?s.split(" "):[s]))}\n  interval: ${interval}\n  timeout: ${timeout}\n  retries: ${retries}\n  start_period: ${start}`;
    let checkCmd = "";
    switch(type) {
      case "http": checkCmd = `curl -sf http://localhost:${port||3000}${path} || exit 1`; break;
      case "tcp": checkCmd = `nc -z localhost ${port||8080} || exit 1`; break;
      case "postgres": checkCmd = `pg_isready -U ${kv.user||"postgres"} -d ${kv.db||"postgres"}`; break;
      case "redis": checkCmd = `redis-cli ping | grep -q PONG`; break;
      case "mysql": checkCmd = `mysqladmin ping -u${kv.user||"root"} -p${kv.pass||"password"} --silent`; break;
      case "mongo": checkCmd = `mongosh --eval 'db.adminCommand("ping")'`; break;
      case "rabbit": checkCmd = `rabbitmq-diagnostics -q ping`; break;
      case "cmd": checkCmd = kv.cmd || "echo ok"; break;
      default: type = "http"; checkCmd = `curl -sf http://localhost:${port||3000}${path} || exit 1`;
    }
    return { output: [
      `# Dockerfile:`,mkDockerfile(checkCmd),``,
      `# Docker Compose:`,mkCompose(checkCmd),
    ].join("\n") };
  },
});
