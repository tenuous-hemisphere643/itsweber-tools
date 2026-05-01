import { defineTool } from "../core";

const OUI: Record<string, string> = {
  "00:50:56": "VMware","00:0c:29": "VMware (workstation)","00:15:5d": "Microsoft (Hyper-V)",
  "08:00:27": "VirtualBox","52:54:00": "QEMU/KVM","02:42": "Docker",
  "00:1a:11": "Google","3c:5a:b4": "Google","dc:a6:32": "Raspberry Pi Foundation",
  "b8:27:eb": "Raspberry Pi Foundation","e4:5f:01": "Raspberry Pi Foundation",
  "00:17:88": "Philips Hue","00:1e:c2": "Apple","00:23:12": "Apple",
  "a4:c3:f0": "Apple","f0:18:98": "Apple","00:1b:63": "Apple",
  "00:21:6b": "Cisco","00:0d:ed": "Cisco","00:13:c4": "Cisco",
  "00:26:b9": "Dell","f8:bc:12": "Dell","18:66:da": "Dell",
  "00:23:ae": "HP","70:10:6f": "HP","a0:b3:cc": "Intel",
  "8c:8d:28": "Intel","00:1b:21": "Intel","00:11:22": "Ciena",
  "00:00:5e": "IANA","ff:ff:ff": "Broadcast",
};

function normalizeOui(mac: string): string {
  return mac.replace(/[-:.]/g,":").toLowerCase().split(":").slice(0,3).join(":");
}

export default defineTool({
  id: "mac-lookup",
  title: "MAC Address Lookup",
  titleDe: "MAC-Adress-Lookup",
  description: "Identify the vendor/manufacturer from a MAC address OUI prefix.",
  descriptionDe: "Hersteller einer MAC-Adresse anhand des OUI-Präfixes ermitteln.",
  explanation: "Enter a MAC address in any format (xx:xx:xx:xx:xx:xx, xx-xx-xx, etc.). Identifies the vendor from the first 3 bytes (OUI) and shows address type and format info.",
  explanationDe: "MAC-Adresse in beliebigem Format eingeben. Zeigt Hersteller (OUI), Adresstyp und Format-Details.",
  category: "Network",
  keywords: ["mac","oui","vendor","hersteller","network","ethernet","arp","adresse"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "DC:A6:32:11:22:33",
  example: "b8:27:eb:aa:bb:cc",
  useCasesDe: ["Gerätehersteller identifizieren","ARP-Tabellen analysieren","Netzwerk-Inventar"],
  run: (input) => {
    const t = input.trim();
    const cleaned = t.replace(/[-:. ]/g,"");
    if (!/^[0-9a-fA-F]{6,12}$/.test(cleaned)) throw new Error("Ungültige MAC-Adresse");
    const oui = normalizeOui(t);
    const vendor = OUI[oui] || OUI[oui.slice(0,5)] || "Unbekannt (nicht in lokaler Datenbank)";
    const firstByte = parseInt(cleaned.slice(0,2), 16);
    const multicast = (firstByte & 1) === 1;
    const localAdmin = (firstByte & 2) === 2;
    const formatted = cleaned.match(/.{1,2}/g)!.join(":").toUpperCase();
    return { output: [
      `MAC:       ${formatted}`,
      `OUI:       ${oui.toUpperCase()}`,
      `Hersteller: ${vendor}`,``,
      `Typ:       ${multicast ? "Multicast/Broadcast" : "Unicast"}`,
      `Verwaltung: ${localAdmin ? "Lokal administriert" : "Global (IEEE)"}`,
    ].join("\n") };
  },
});
