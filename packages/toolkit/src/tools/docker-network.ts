import { defineTool } from "../core";

export default defineTool({
  id: "docker-network",
  title: "Docker Network Helper",
  titleDe: "Docker-Netzwerk-Helfer",
  description: "Generate Docker network commands and explain network types and topology.",
  descriptionDe: "Docker-Netzwerk-Befehle generieren und Netzwerktypen und Topologie erklären.",
  explanation: "Enter a network type or command: bridge, overlay, host, macvlan, inspect, create, list, cleanup.",
  explanationDe: "Netzwerktyp oder Befehl eingeben: bridge, overlay, host, macvlan, inspect, create, list, cleanup.",
  category: "ItsWeber Ops",
  keywords: ["docker","network","bridge","overlay","swarm","container","subnet","dns"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "bridge",
  example: "create",
  useCasesDe: ["Docker-Netzwerke verstehen","Container vernetzen","Isolierung konfigurieren"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const recipes: Record<string,string[]> = {
      bridge: [
        `# Standard-Bridge-Netzwerk (Standard für docker run):`,
        `docker network create mynet`,``,
        `# Container verbinden:`,
        `docker run --network mynet --name app1 myimage`,``,
        `# Vorteil: Container kommunizieren per Name (DNS)`,
        `# myapp1 kann http://app2:8080 direkt ansprechen`,
      ],
      overlay: [
        `# Overlay (Docker Swarm, multi-node):`,
        `docker network create --driver overlay --attachable myoverlay`,``,
        `# Swarm-Service damit verbinden:`,
        `docker service create --network myoverlay --name app myimage`,``,
        `# Overlay läuft über VXLAN (port 4789/UDP)`,
        `# Benötigt Swarm-Modus: docker swarm init`,
      ],
      host: [
        `# Host-Netzwerk (keine Isolation):`,
        `docker run --network host nginx`,``,
        `# Container nutzt direkt den Host-Netzwerk-Stack`,
        `# Kein Port-Mapping nötig — aber auch keine Isolation`,
        `# Nur Linux; auf Mac/Windows simuliert`,
      ],
      macvlan: [
        `# MacVLAN (Container bekommt eigene MAC + IP im LAN):`,
        `docker network create -d macvlan \\`,
        `  --subnet=192.168.1.0/24 \\`,
        `  --gateway=192.168.1.1 \\`,
        `  -o parent=eth0 \\`,
        `  macvlan_net`,``,
        `# Container erscheint als physisches Gerät im Netz`,
        `# Gut für: IoT, Legacy-Apps, DHCP-Zuweisung`,
      ],
      list: [
        `docker network ls`,
        `docker network ls --filter driver=bridge`,
        `docker network ls --format "table {{.ID}}\\t{{.Name}}\\t{{.Driver}}"`,
      ],
      inspect: [
        `docker network inspect mynet`,
        `docker network inspect bridge -f "{{range .Containers}}{{.Name}} {{.IPv4Address}}{{end}}"`,
      ],
      create: [
        `# Bridge mit fester Subnet:`,
        `docker network create --driver bridge --subnet 172.20.0.0/16 --gateway 172.20.0.1 mynet`,``,
        `# Intern (kein Zugriff nach außen):`,
        `docker network create --internal isolated_net`,``,
        `# Mit IPv6:`,
        `docker network create --ipv6 --subnet fd00::/64 dualstack_net`,
      ],
      cleanup: [
        `# Alle ungenutzten Netzwerke entfernen:`,
        `docker network prune`,``,
        `# Spezifisches Netzwerk entfernen:`,
        `docker network rm mynet`,``,
        `# Container aus Netzwerk trennen:`,
        `docker network disconnect mynet container_name`,
      ],
    };
    const result = recipes[t];
    if (!result) throw new Error(`Unbekannt: '${input}'.\nVerfügbar: bridge, overlay, host, macvlan, list, inspect, create, cleanup`);
    return { output: result.join("\n") };
  },
});
