import { defineTool } from "../core";

const PORTS: Record<number, [string, string]> = {
  20: ["FTP Data","TCP"], 21: ["FTP Control","TCP"], 22: ["SSH","TCP/UDP"],
  23: ["Telnet","TCP"], 25: ["SMTP","TCP"], 53: ["DNS","TCP/UDP"],
  67: ["DHCP Server","UDP"], 68: ["DHCP Client","UDP"], 69: ["TFTP","UDP"],
  80: ["HTTP","TCP"], 110: ["POP3","TCP"], 111: ["RPC","TCP/UDP"],
  119: ["NNTP","TCP"], 123: ["NTP","UDP"], 135: ["MS-RPC","TCP/UDP"],
  137: ["NetBIOS-NS","UDP"], 138: ["NetBIOS-DGM","UDP"], 139: ["NetBIOS-SSN","TCP"],
  143: ["IMAP","TCP"], 161: ["SNMP","UDP"], 162: ["SNMP Trap","UDP"],
  179: ["BGP","TCP"], 194: ["IRC","TCP"], 389: ["LDAP","TCP/UDP"],
  443: ["HTTPS","TCP"], 445: ["SMB","TCP"], 465: ["SMTPS","TCP"],
  500: ["IKE / IPsec","UDP"], 514: ["Syslog","UDP"], 587: ["SMTP Submission","TCP"],
  636: ["LDAPS","TCP"], 993: ["IMAPS","TCP"], 995: ["POP3S","TCP"],
  1080: ["SOCKS","TCP"], 1194: ["OpenVPN","TCP/UDP"], 1433: ["MS-SQL","TCP"],
  1521: ["Oracle DB","TCP"], 1883: ["MQTT","TCP"], 2049: ["NFS","TCP/UDP"],
  3306: ["MySQL/MariaDB","TCP"], 3389: ["RDP","TCP"], 5432: ["PostgreSQL","TCP"],
  5672: ["AMQP (RabbitMQ)","TCP"], 5900: ["VNC","TCP"], 6379: ["Redis","TCP"],
  6443: ["Kubernetes API","TCP"], 8080: ["HTTP-Alt / Proxy","TCP"],
  8443: ["HTTPS-Alt","TCP"], 8883: ["MQTT TLS","TCP"], 9200: ["Elasticsearch","TCP"],
  9300: ["Elasticsearch Cluster","TCP"], 9090: ["Prometheus","TCP"],
  9100: ["Node Exporter","TCP"], 27017: ["MongoDB","TCP"], 51820: ["WireGuard","UDP"],
};

export default defineTool({
  id: "port-lookup",
  title: "Port Lookup",
  titleDe: "Port-Nachschlagewerk",
  description: "Look up common TCP/UDP port numbers and their services.",
  descriptionDe: "Schlägt gängige TCP/UDP-Portnummern und deren Dienste nach.",
  explanation: "Enter a port number (e.g. 443) or a service name (e.g. ssh). Shows protocol, type, and usage.",
  explanationDe: "Portnummer (z.B. 443) oder Dienstname (z.B. ssh) eingeben. Zeigt Protokoll, Typ und Verwendung.",
  category: "Network",
  keywords: ["port","tcp","udp","service","dienst","lookup","netzwerk","firewall"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "443",
  example: "80",
  useCasesDe: ["Firewall-Regeln prüfen","Dienste identifizieren","Port-Konflikte lösen"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const num = parseInt(t);
    if (!isNaN(num)) {
      const entry = PORTS[num];
      if (!entry) return { output: `Port ${num}: Kein bekannter Dienst in der Datenbank.\n\nBereich: ${num < 1024 ? "Well-Known (0–1023)" : num < 49152 ? "Registered (1024–49151)" : "Dynamic/Ephemeral (49152–65535)"}` };
      return { output: `Port ${num}  –  ${entry[0]}\nTyp:     ${entry[1]}\nBereich: ${num < 1024 ? "Well-Known" : "Registered"}` };
    }
    const matches = Object.entries(PORTS).filter(([,v]) => v[0].toLowerCase().includes(t));
    if (!matches.length) throw new Error(`Kein Dienst gefunden für '${input}'`);
    return { output: matches.map(([p, v]) => `${String(p).padStart(5)}/  ${v[1].padEnd(7)}  ${v[0]}`).join("\n") };
  },
});
