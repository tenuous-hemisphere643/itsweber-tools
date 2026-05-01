import { defineTool } from "../core";

export default defineTool({
  id: "ufw-rules",
  title: "UFW Rule Builder",
  titleDe: "UFW-Regel-Builder",
  description: "Generate UFW (Uncomplicated Firewall) commands for common server hardening scenarios.",
  descriptionDe: "UFW-Befehle für gängige Server-Härtungsszenarien generieren.",
  explanation: "Enter a scenario keyword: webserver, ssh, mail, docker, hardened, or write port rules like: allow 8080/tcp from 192.168.1.0/24",
  explanationDe: "Szenario-Schlüsselwort eingeben: webserver, ssh, mail, docker, hardened, oder eigene Regeln: allow 8080/tcp from 192.168.1.0/24",
  category: "ItsWeber Ops",
  keywords: ["ufw","firewall","ubuntu","debian","rule","port","allow","deny","iptables","hardening"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "webserver",
  example: "hardened",
  useCasesDe: ["VPS absichern","Docker-Ports freigeben","SSH-Only-Server konfigurieren"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const pre = `# UFW initialisieren\nufw --force reset\nufw default deny incoming\nufw default allow outgoing\n`;
    if (t==="webserver") return { output: `${pre}\n# Webserver\nufw allow 22/tcp\nufw allow 80/tcp\nufw allow 443/tcp\n\nufw --force enable\nufw status verbose` };
    if (t==="ssh") return { output: `${pre}\n# SSH only (Rate-Limiting)\nufw limit 22/tcp\n\nufw --force enable\nufw status verbose` };
    if (t==="mail") return { output: `${pre}\n# Mail Server\nufw allow 25/tcp\nufw allow 465/tcp\nufw allow 587/tcp\nufw allow 993/tcp\nufw allow 995/tcp\nufw allow 80/tcp\nufw allow 443/tcp\nufw limit 22/tcp\n\nufw --force enable\nufw status verbose` };
    if (t==="docker") return { output: `# Hinweis: Docker umgeht UFW via iptables — für echte Absicherung:\n# /etc/ufw/after.rules anpassen\n\n# Trotzdem nützlich für Host-Ports:\n${pre}\nufw allow 22/tcp\nufw allow 80/tcp\nufw allow 443/tcp\n\n# Docker Swarm (bei Bedarf):\n# ufw allow 2377/tcp\n# ufw allow 7946\n# ufw allow 4789/udp\n\nufw --force enable` };
    if (t==="hardened") return { output: `${pre}\n# Minimale Angriffsfläche\nufw limit 22/tcp comment 'SSH Rate-Limit'\nufw allow 80/tcp comment 'HTTP'\nufw allow 443/tcp comment 'HTTPS'\n\n# Outgoing einschränken (optional)\n# ufw default deny outgoing\n# ufw allow out 53\n# ufw allow out 80\n# ufw allow out 443\n# ufw allow out 123/udp\n\nufw logging on\nufw --force enable\nufw status numbered` };
    const m = t.match(/^(allow|deny|reject|limit)\s+([\d]+(?:\/(?:tcp|udp))?)(?:\s+from\s+(\S+))?$/);
    if (m) {
      const [,action, port, from] = m;
      const from_part = from ? ` from ${from} to any port ${port.split("/")[0]}` : ` ${port}`;
      return { output: `ufw ${action}${from_part}\nufw status verbose` };
    }
    throw new Error(`Unbekanntes Szenario: '${input}'\nVerfügbar: webserver, ssh, mail, docker, hardened\nOder: allow 8080/tcp from 10.0.0.0/8`);
  },
});
