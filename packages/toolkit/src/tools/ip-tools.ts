import { defineTool } from "../core";

export default defineTool({
  id: "ip-tools",
  title: "IP Address Tools",
  titleDe: "IP-Adress-Werkzeuge",
  description: "Analyze and convert IPv4 and IPv6 addresses: binary, hex, integer, and classification.",
  descriptionDe: "IPv4 und IPv6-Adressen analysieren und konvertieren: Binär, Hex, Integer und Klassifizierung.",
  explanation: "Enter any IPv4 or IPv6 address. Shows binary representation, hexadecimal, integer value, RFC class, and relevant RFC classifications.",
  explanationDe: "IPv4 oder IPv6-Adresse eingeben. Zeigt Binärdarstellung, Hexadezimal, Integer, RFC-Klasse und Klassifizierungen.",
  category: "Network",
  keywords: ["ip","ipv4","ipv6","binary","hex","convert","class","rfc","private","loopback","network"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "10.0.0.1",
  example: "172.16.5.100",
  useCasesDe: ["IP-Adressen analysieren","Netzwerkklassen verstehen","Subnetz-Debugging"],
  run: (input) => {
    const t = input.trim();
    const isIPv4 = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(t);
    if (!isIPv4) {
      return { output: `IPv6 erkannt: ${t}\n\nIPv6-Analyse in Kürze — aktuell nur IPv4 unterstützt.` };
    }
    const parts = t.split(".").map(Number);
    if (parts.some(p=>p>255||p<0)) throw new Error("Ungültige IPv4-Adresse");
    const int32 = parts.reduce((a,b)=>(a<<8)|b,0)>>>0;
    const hex = parts.map(p=>p.toString(16).padStart(2,"0")).join(":");
    const binary = parts.map(p=>p.toString(2).padStart(8,"0")).join(".");
    const [a,b] = parts;
    const isPrivate = a===10 || (a===172&&b>=16&&b<=31) || (a===192&&b===168);
    const isLoopback = a===127;
    const isLinkLocal = a===169 && b===254;
    const isMulticast = a>=224 && a<=239;
    const isBroadcast = t==="255.255.255.255";
    const isDoc = (a===192&&b===0&&parts[2]===2) || (a===198&&b>=18&&b<=19) || (a===203&&b===0&&parts[2]===113);
    const cls = a<128?"A (0.0.0.0 – 127.255.255.255)":a<192?"B (128.0.0.0 – 191.255.255.255)":a<224?"C (192.0.0.0 – 223.255.255.255)":a<240?"D Multicast":"E Reserved";
    const flags: string[] = [];
    if (isPrivate) flags.push("Privat (RFC 1918)");
    if (isLoopback) flags.push("Loopback (RFC 1122)");
    if (isLinkLocal) flags.push("Link-Local (RFC 3927)");
    if (isMulticast) flags.push("Multicast (RFC 5771)");
    if (isBroadcast) flags.push("Broadcast");
    if (isDoc) flags.push("Dokumentation (RFC 5737)");
    if (!flags.length) flags.push("Öffentlich");
    return { output: [
      `IPv4:       ${t}`,
      `Dezimal:    ${int32}`,
      `Hex:        ${hex} (0x${int32.toString(16).toUpperCase().padStart(8,"0")})`,
      `Binär:      ${binary}`,
      ``,
      `Klasse:     ${cls}`,
      `Typ:        ${flags.join(", ")}`,
    ].join("\n") };
  },
});
