import { defineTool } from "../core";
import { intToIp, ipToInt } from "../shared";

function cidr(value: string): string {
  const match = value.trim().match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})$/);
  if (!match) {
    throw new Error("Use CIDR notation, for example 192.168.178.42/24.");
  }
  const ip = ipToInt(match[1]);
  const prefix = Number.parseInt(match[2], 10);
  if (prefix < 0 || prefix > 32) {
    throw new Error("CIDR prefix must be between 0 and 32.");
  }
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = ip & mask;
  const broadcast = network | (~mask >>> 0);
  const usableHosts = prefix >= 31 ? 0 : Math.max(0, broadcast - network - 1);
  return [
    `Input: ${match[1]}/${prefix}`,
    `Netmask: ${intToIp(mask)}`,
    `Network: ${intToIp(network)}`,
    `Broadcast: ${intToIp(broadcast)}`,
    `First host: ${prefix >= 31 ? "n/a" : intToIp(network + 1)}`,
    `Last host: ${prefix >= 31 ? "n/a" : intToIp(broadcast - 1)}`,
    `Usable hosts: ${usableHosts}`,
  ].join("\n");
}

export default defineTool({
  id: "cidr-calculator",
  title: "IPv4 CIDR Calculator",
  titleDe: "IPv4-CIDR-Rechner",
  description: "Calculates network, broadcast, and usable host range.",
  descriptionDe: "Berechnet Netzwerk, Broadcast und nutzbaren Hostbereich.",
  explanation:
    "CIDR notation describes IP networks such as 192.168.178.0/24. This tool helps plan subnets and troubleshoot routing.",
  explanationDe:
    "CIDR beschreibt IP-Netze wie 192.168.178.0/24. Dieses Tool hilft beim Planen von Subnetzen und bei Routing-Fehlern.",
  category: "Network",
  keywords: ["cidr", "subnet", "ipv4"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "192.168.178.42/24",
  example: "192.168.178.42/24",
  run: (input) => ({ output: cidr(input) }),
});
