import { defineTool } from "../core";

export default defineTool({
  id: "nginx-upstream",
  title: "Nginx Upstream / Load Balancer",
  titleDe: "Nginx Upstream / Load Balancer",
  description: "Generate Nginx upstream and load balancer configurations.",
  descriptionDe: "Nginx-Upstream- und Load-Balancer-Konfigurationen generieren.",
  explanation: "Enter backends (one per line, host:port format). Optionally add: method: round_robin/least_conn/ip_hash, health: true, ssl: true.",
  explanationDe: "Backends eingeben (je eine Zeile, host:port). Optional: method: round_robin/least_conn/ip_hash, health: true, ssl: true.",
  category: "ItsWeber Ops",
  keywords: ["nginx","upstream","loadbalancer","proxy","backend","round-robin","ip-hash","config"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "app1.internal:3000\napp2.internal:3000\napp3.internal:3000",
  example: "10.0.0.1:8080\n10.0.0.2:8080\nmethod: least_conn",
  useCasesDe: ["Nginx Load Balancer konfigurieren","Reverse-Proxy-Cluster","Blue-Green Deployments"],
  run: (input) => {
    const lines = input.trim().split("\n");
    const kv: Record<string,string> = {};
    const backends: string[] = [];
    for (const line of lines) {
      const l = line.trim();
      if (!l) continue;
      const m = l.match(/^(\w+):\s*(.+)$/);
      if (m) kv[m[1].toLowerCase()] = m[2].trim();
      else backends.push(l);
    }
    if (!backends.length) throw new Error("Mindestens ein Backend eingeben (host:port)");
    const method = kv.method || "round_robin";
    const health = kv.health === "true";
    const name = kv.name || "app_backend";
    const domain = kv.domain || "app.example.com";
    const upstreamLines: string[] = [];
    if (method === "least_conn") upstreamLines.push("  least_conn;");
    if (method === "ip_hash") upstreamLines.push("  ip_hash;");
    backends.forEach((b,i) => {
      const weight = kv[`weight${i+1}`] ? ` weight=${kv[`weight${i+1}`]}` : "";
      upstreamLines.push(`  server ${b}${weight};`);
    });
    if (health) {
      upstreamLines.push(`  keepalive 32;`);
    }
    return { output: [
      `upstream ${name} {`,
      ...upstreamLines,
      `}`,``,
      `server {`,
      `  listen 80;`,
      `  server_name ${domain};`,``,
      `  location / {`,
      `    proxy_pass http://${name};`,
      `    proxy_set_header Host $host;`,
      `    proxy_set_header X-Real-IP $remote_addr;`,
      `    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`,
      `    proxy_set_header X-Forwarded-Proto $scheme;`,
      health ? `    proxy_connect_timeout 5s;\n    proxy_next_upstream error timeout http_502 http_503;` : "",
      `  }`,
      `}`,
    ].filter(l=>l!=="").join("\n") };
  },
});
