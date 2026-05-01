import { defineTool } from "../core";

export default defineTool({
  id: "ip-geolocation",
  title: "IP Geolocation Lookup",
  titleDe: "IP-Geolocation-Abfrage",
  description: "Look up approximate geolocation for an IP address using a free public API.",
  descriptionDe: "Ungefähren Standort einer IP-Adresse über eine öffentliche API abrufen.",
  explanation: "Enter an IPv4 address to look up approximate country, city, ISP, and timezone. Uses ip-api.com (free, no key needed).",
  explanationDe: "IPv4-Adresse eingeben → ungefähres Land, Stadt, ISP und Zeitzone. Nutzt ip-api.com (kostenlos, kein API-Key).",
  category: "Network",
  keywords: ["ip","geolocation","lookup","country","city","isp","location","dns","trace"],
  status: "ready",
  privacyMode: "network-fetch",
  placeholder: "8.8.8.8",
  example: "1.1.1.1",
  useCasesDe: ["IP-Herkunft prüfen","ISP identifizieren","Zeitzone einer IP bestimmen"],
  run: async (input) => {
    const ip = input.trim();
    if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) throw new Error("Gültige IPv4-Adresse eingeben (z.B. 8.8.8.8)");
    const res = await fetch(`https://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
    if (!res.ok) throw new Error(`API-Fehler: ${res.status}`);
    const d = await res.json() as Record<string,string>;
    if (d.status === "fail") throw new Error(d.message || "Abfrage fehlgeschlagen");
    return { output: [
      `IP:         ${d.query}`,
      `Land:       ${d.country} (${d.countryCode})`,
      `Region:     ${d.regionName} (${d.region})`,
      `Stadt:      ${d.city} ${d.zip}`,
      `Koordinaten: ${d.lat}, ${d.lon}`,
      `Zeitzone:   ${d.timezone}`,
      `ISP:        ${d.isp}`,
      `Org:        ${d.org}`,
      `AS:         ${d.as}`,
      ``,
      `Quelle: ip-api.com (Genauigkeit: Stadt-Ebene, nicht exakt)`,
    ].join("\n") };
  },
});
