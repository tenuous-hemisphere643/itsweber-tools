import { defineTool } from "../core";

export default defineTool({
  id: "ip-range",
  title: "IP Range Expander",
  titleDe: "IP-Bereich-Expandierer",
  description: "Expand an IP range or CIDR to a list of all IP addresses.",
  descriptionDe: "Einen IP-Bereich oder CIDR zu einer Liste aller IP-Adressen expandieren.",
  explanation: "Enter a CIDR (192.168.1.0/28), a range (192.168.1.1-192.168.1.20), or two IPs separated by a dash.",
  explanationDe: "CIDR (192.168.1.0/28), Bereich (192.168.1.1-192.168.1.20) oder zwei IPs mit Bindestrich eingeben.",
  category: "Network",
  keywords: ["ip","range","cidr","expand","list","netzwerk","adressen","scan"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "192.168.1.0/28",
  example: "10.0.0.1-10.0.0.20",
  useCasesDe: ["Netzwerk-Scan vorbereiten","DHCP-Pools planen","Firewall-Regeln erstellen"],
  run: (input) => {
    const t = input.trim();
    const ipToInt = (ip: string) => ip.split(".").reduce((a,o)=>(a<<8)|parseInt(o),0)>>>0;
    const intToIp = (n: number) => [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].join(".");
    let start: number, end: number;
    if (t.includes("/")) {
      const [ip,cidrStr] = t.split("/");
      const cidr = parseInt(cidrStr);
      if (cidr > 30) throw new Error("CIDR > 30 ist für Listing zu groß (zu viele IPs)");
      const mask = cidr===0?0:(0xffffffff<<(32-cidr))>>>0;
      start = (ipToInt(ip)&mask)>>>0;
      end = (start|(~mask>>>0))>>>0;
    } else if (t.includes("-")) {
      const parts = t.split("-").map(s=>s.trim());
      start = ipToInt(parts[0]);
      end = ipToInt(parts[1]);
    } else throw new Error("Format: 192.168.1.0/28  oder  10.0.0.1-10.0.0.20");
    const count = end - start + 1;
    if (count > 1024) throw new Error(`Bereich enthält ${count} IPs (Max: 1024 für Anzeige)`);
    const ips: string[] = [];
    for (let i = start; i <= end; i++) ips.push(intToIp(i));
    return { output: [`${count} IP-Adressen:`,``,...ips].join("\n") };
  },
});
