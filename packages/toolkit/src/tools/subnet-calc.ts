import { defineTool } from "../core";

function ipToInt(ip: string): number {
  return ip.split(".").reduce((acc, o) => (acc << 8) | parseInt(o), 0) >>> 0;
}
function intToIp(n: number): string {
  return [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].join(".");
}
function cidrToMask(cidr: number): number {
  return cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
}

export default defineTool({
  id: "subnet-calc",
  title: "Subnet Calculator",
  titleDe: "Subnetz-Rechner",
  description: "Calculate network address, broadcast, host range, and usable hosts for any CIDR notation.",
  descriptionDe: "Berechnet Netzwerkadresse, Broadcast, Host-Bereich und nutzbare Hosts für CIDR-Notationen.",
  explanation: "Enter an IP address with CIDR prefix, e.g. 192.168.1.50/24. Shows network, broadcast, first/last host, subnet mask, wildcard mask, and host count.",
  explanationDe: "IP-Adresse mit CIDR-Präfix eingeben, z.B. 192.168.1.50/24. Zeigt Netzwerk, Broadcast, erster/letzter Host, Subnetzmaske, Wildcard und Host-Anzahl.",
  category: "Network",
  keywords: ["subnet","cidr","network","ip","mask","broadcast","host","netzwerk","subnetz"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "192.168.1.50/24",
  example: "10.0.0.1/22",
  useCasesDe: ["Netzwerkplanung","VLAN-Segmentierung","Firewall-Regeln vorbereiten"],
  run: (input) => {
    const t = input.trim();
    const m = t.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/);
    if (!m) throw new Error("Format: 192.168.1.0/24");
    const ip = m[1];
    const cidr = parseInt(m[2]);
    if (cidr > 32) throw new Error("CIDR muss ≤ 32 sein");
    const parts = ip.split(".").map(Number);
    if (parts.some(p => p > 255)) throw new Error("Ungültige IP-Adresse");
    const ipInt = ipToInt(ip);
    const mask = cidrToMask(cidr);
    const net = (ipInt & mask) >>> 0;
    const bc = (net | (~mask >>> 0)) >>> 0;
    const first = cidr < 31 ? (net + 1) >>> 0 : net;
    const last  = cidr < 31 ? (bc  - 1) >>> 0 : bc;
    const hosts = cidr >= 31 ? Math.pow(2, 32 - cidr) : Math.pow(2, 32 - cidr) - 2;
    const wildcard = intToIp(~mask >>> 0);
    const cls = parts[0] < 128 ? "A" : parts[0] < 192 ? "B" : parts[0] < 224 ? "C" : "D/E";
    const priv = (parts[0]===10) || (parts[0]===172&&parts[1]>=16&&parts[1]<=31) || (parts[0]===192&&parts[1]===168);
    return { output: [
      `Eingabe:        ${t}`,``,
      `Netzwerk:       ${intToIp(net)}/${cidr}`,
      `Subnetzmaske:   ${intToIp(mask)}`,
      `Wildcard:       ${wildcard}`,
      `Broadcast:      ${intToIp(bc)}`,
      `Erster Host:    ${intToIp(first)}`,
      `Letzter Host:   ${intToIp(last)}`,
      `Nutzbare Hosts: ${hosts.toLocaleString("de-DE")}`,
      ``,
      `Klasse:         ${cls}`,
      `Privat:         ${priv ? "Ja (RFC 1918)" : "Nein (öffentlich)"}`,
      `Binary Mask:    ${intToIp(mask).split(".").map(o=>o.padStart(3)).join(".")}`,
    ].join("\n") };
  },
});
