import { defineTool } from "../core";

export default defineTool({
  id: "qr-generator",
  title: "QR Code Generator",
  titleDe: "QR-Code-Generator",
  description: "Generate QR codes for URLs, text, Wi-Fi credentials, or vCards.",
  descriptionDe: "QR-Codes für URLs, Text, WLAN-Zugangsdaten oder vCards generieren.",
  explanation: "Enter a URL or text to generate a QR code. Prefix with 'wifi:' for Wi-Fi format: wifi: MyNetwork | WPA | MyPassword. For vCard: vcard: Name | email | phone.",
  explanationDe: "URL oder Text eingeben. Präfix 'wifi:' für WLAN: wifi: Netzwerk | WPA | Passwort. Für vCard: vcard: Name | E-Mail | Telefon.",
  category: "Web",
  keywords: ["qr","code","generator","wifi","url","vcard","barcode","scan","link"],
  status: "ready",
  privacyMode: "network-fetch",
  placeholder: "https://itsweber.de",
  example: "https://itsweber.de",
  useCasesDe: ["WLAN-QR-Code für Gäste","URL-QR für Druckmedien","vCard zum Scannen"],
  run: (input) => {
    const t = input.trim();
    let content = t;
    if (t.toLowerCase().startsWith("wifi:")) {
      const [, rest] = t.split(":");
      const parts = rest.split("|").map(s=>s.trim());
      if (parts.length < 3) throw new Error("Format: wifi: Netzwerk | WPA | Passwort");
      content = `WIFI:T:${parts[1]};S:${parts[0]};P:${parts[2]};;`;
    } else if (t.toLowerCase().startsWith("vcard:")) {
      const [, rest] = t.split(":");
      const parts = rest.split("|").map(s=>s.trim());
      if (parts.length < 2) throw new Error("Format: vcard: Name | email | telefon");
      content = `BEGIN:VCARD\nVERSION:3.0\nFN:${parts[0]}\nEMAIL:${parts[1]||""}\nTEL:${parts[2]||""}\nEND:VCARD`;
    }
    const encoded = encodeURIComponent(content);
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}`;
    return {
      output: [
        `QR-Code für:`,
        content.length > 80 ? content.slice(0,77)+"..." : content,
        ``,
        `Vorschau-URL (externe API):`,
        apiUrl,
        ``,
        `Tipp: URL in Browser öffnen oder Img-Tag nutzen:`,
        `<img src="${apiUrl}" alt="QR Code">`,
      ].join("\n"),
    };
  },
});
