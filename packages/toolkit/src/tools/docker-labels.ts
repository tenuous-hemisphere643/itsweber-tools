import { defineTool } from "../core";

export default defineTool({
  id: "docker-labels",
  title: "Docker Label Generator",
  titleDe: "Docker-Label-Generator",
  description: "Generate Docker OCI standard labels for images, Traefik routing labels, and Unraid templates.",
  descriptionDe: "Docker-OCI-Standard-Labels für Images, Traefik-Routing-Labels und Unraid-Templates generieren.",
  explanation: "Enter a preset: oci, traefik, unraid. Or enter custom key:value pairs with a type prefix.",
  explanationDe: "Preset eingeben: oci, traefik, unraid. Oder eigene Schlüssel:Wert-Paare mit Typ-Präfix.",
  category: "ItsWeber Ops",
  keywords: ["docker","label","oci","traefik","unraid","metadata","image","container"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "oci",
  example: "traefik",
  useCasesDe: ["OCI-konforme Images erstellen","Traefik-Routing konfigurieren","Unraid-Labels setzen"],
  run: (input) => {
    const lines = input.trim().split("\n");
    const cmd = lines[0].trim().toLowerCase();
    const kv: Record<string,string> = {};
    lines.slice(1).forEach(l=>{ const i=l.indexOf(":"); if(i>0) kv[l.slice(0,i).trim().toLowerCase()]=l.slice(i+1).trim(); });
    const name = kv.name || "myapp";
    const domain = kv.domain || "app.example.com";
    if (cmd==="oci") return { output: [
      `# Dockerfile LABEL (OCI-Standard):`,
      `LABEL org.opencontainers.image.title="${kv.title||name}"`,
      `LABEL org.opencontainers.image.description="${kv.description||"A Docker image"}"`,
      `LABEL org.opencontainers.image.version="${kv.version||"1.0.0"}"`,
      `LABEL org.opencontainers.image.created="${new Date().toISOString()}"`,
      `LABEL org.opencontainers.image.authors="${kv.author||"maintainer@example.com"}"`,
      `LABEL org.opencontainers.image.source="${kv.source||"https://github.com/user/repo"}"`,
      `LABEL org.opencontainers.image.licenses="${kv.license||"MIT"}"`,
    ].join("\n") };
    if (cmd==="traefik") return { output: [
      `# Docker Compose labels (Traefik v2):`,
      `labels:`,
      `  - "traefik.enable=true"`,
      `  - "traefik.http.routers.${name}.rule=Host(\`${domain}\`)"`,
      `  - "traefik.http.routers.${name}.entrypoints=websecure"`,
      `  - "traefik.http.routers.${name}.tls.certresolver=letsencrypt"`,
      `  - "traefik.http.services.${name}.loadbalancer.server.port=${kv.port||"3000"}"`,
      kv.middleware ? `  - "traefik.http.routers.${name}.middlewares=${kv.middleware}"` : "",
      `  # Authentifizierung (optional):`,
      `  # - "traefik.http.middlewares.${name}-auth.basicauth.users=user:$$2y$$12$$hash"`,
    ].filter(l=>l!=="").join("\n") };
    if (cmd==="unraid") return { output: [
      `# Unraid-spezifische Labels:`,
      `LABEL net.unraid.docker.icon="${kv.icon||"https://example.com/icon.png"}"`,
      `LABEL net.unraid.docker.webui="http://[IP]:[PORT:${kv.port||"3000"}]/"`,
      `LABEL net.unraid.docker.support="${kv.support||"https://forums.unraid.net"}"`,
      `LABEL net.unraid.docker.project="${kv.project||"https://github.com/user/project"}"`,
      `LABEL net.unraid.docker.overview="${kv.overview||"Beschreibung des Containers"}"`,
      `LABEL net.unraid.docker.category="${kv.category||"Productivity:"}"`,
    ].join("\n") };
    throw new Error(`Unbekannt: '${cmd}'.\nErlaubt: oci, traefik, unraid`);
  },
});
