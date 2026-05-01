import { defineTool } from "../core";
import { ipToInt, intToIp } from "../shared";

export default defineTool({
  id: "ip-info",
  title: "IP Address Info",
  titleDe: "IP-Adressen Info",
  description: "Analyze an IPv4 address — class, private/public, binary, hex.",
  descriptionDe: "Analysiert eine IPv4-Adresse — Klasse, Privat/Öffentlich, Binär, Hex.",
  explanation: "Shows class (A/B/C/D/E), private/public status, binary representation, hex, integer value, and reverse DNS lookup format for any IPv4 address.",
  explanationDe: "Zeigt Klasse (A/B/C/D/E), Privat/Öffentlich-Status, Binärdarstellung, Hex, Integer-Wert und Reverse-DNS-Format für jede IPv4-Adresse.",
  category: "Network",
  keywords: ["ip", "ipv4", "address", "network", "private", "public", "binary", "netzwerk", "adresse"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "192.168.1.1",
  example: "192.168.1.100",
  useCasesDe: ["Netzwerk-Debugging", "Firewall-Regeln analysieren", "IP-Klassen in Schulungen erklären"],
  run: (input) => {
    const trimmed = input.trim();
    const int = ipToInt(trimmed);
    const parts = trimmed.split(".").map(Number);

    const isPrivate =
      (parts[0] === 10) ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168) ||
      (parts[0] === 127) ||
      (parts[0] === 169 && parts[1] === 254);

    const isLoopback = parts[0] === 127;
    const isLinkLocal = parts[0] === 169 && parts[1] === 254;

    let ipClass: string;
    if (parts[0] < 128)       ipClass = "A";
    else if (parts[0] < 192)  ipClass = "B";
    else if (parts[0] < 224)  ipClass = "C";
    else if (parts[0] < 240)  ipClass = "D (Multicast)";
    else                      ipClass = "E (Reserved)";

    const binary = parts.map((p) => p.toString(2).padStart(8, "0")).join(".");
    const hex = "0x" + parts.map((p) => p.toString(16).padStart(2, "0").toUpperCase()).join("");
    const reverseDns = [...parts].reverse().join(".") + ".in-addr.arpa";

    const flags = [
      isLoopback ? "loopback" : null,
      isLinkLocal ? "link-local" : null,
      isPrivate && !isLoopback ? "private" : !isPrivate ? "public" : null,
    ].filter(Boolean).join(", ");

    return {
      output: [
        `IP:         ${intToIp(int)}`,
        `Class:      ${ipClass}`,
        `Flags:      ${flags || "—"}`,
        `Binary:     ${binary}`,
        `Hex:        ${hex}`,
        `Integer:    ${int}`,
        `Reverse:    ${reverseDns}`,
      ].join("\n"),
    };
  },
});
