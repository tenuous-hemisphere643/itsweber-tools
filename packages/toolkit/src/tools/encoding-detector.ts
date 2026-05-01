import { defineTool } from "../core";

export default defineTool({
  id: "encoding-detector",
  title: "Encoding Detector",
  titleDe: "Codierungs-Detektor",
  description: "Detect if text is Base64, hex, binary, JWT, URL-encoded, HTML entities, or plain text.",
  descriptionDe: "Erkennt ob Text Base64, Hex, Binär, JWT, URL-kodiert, HTML-Entities oder Klartext ist.",
  explanation: "Paste any encoded string to detect its encoding and decode it.",
  explanationDe: "Kodierten String einfügen → Codierung erkennen und dekodieren.",
  category: "Converter",
  keywords: ["encoding","detect","base64","hex","jwt","url","decode","identify","erkennen"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "SGVsbG8gV29ybGQ=",
  example: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0In0.signature",
  useCasesDe: ["Unbekannte Kodierung identifizieren","Encoded Strings schnell dekodieren","Datenformate erkennen"],
  run: (input) => {
    const t = input.trim();
    const results: string[] = [];
    if (/^[A-Za-z0-9+/]+=*$/.test(t) && t.length % 4 === 0 && t.length >= 4) {
      try { results.push(`Base64: ${atob(t)}`); } catch { /* skip */ }
    }
    if (/^[0-9a-fA-F]+$/.test(t) && t.length % 2 === 0) {
      try {
        const bytes = t.match(/.{2}/g)!.map(b=>parseInt(b,16));
        const str = bytes.map(b=>String.fromCharCode(b)).join("");
        results.push(`Hex: ${str}`);
      } catch { /* skip */ }
    }
    if (t.split(".").length === 3 && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$/.test(t)) {
      try {
        const [h,p] = t.split(".");
        const decode = (s: string) => atob(s.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(s.length/4)*4,"="));
        results.push(`JWT:\n  Header:  ${decode(h)}\n  Payload: ${decode(p)}`);
      } catch { /* skip */ }
    }
    if (/%[0-9A-Fa-f]{2}/.test(t)) {
      results.push(`URL-encoded: ${decodeURIComponent(t)}`);
    }
    if (/&[a-zA-Z]+;|&#\d+;/.test(t)) {
      const decoded = t
        .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&nbsp;/g, " ")
        .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)));
      results.push(`HTML-Entities: ${decoded}`);
    }
    if (/^[01\s]+$/.test(t) && t.replace(/\s/g,"").length % 8 === 0) {
      try {
        const bits = t.replace(/\s/g,"");
        const str = bits.match(/.{8}/g)!.map(b=>String.fromCharCode(parseInt(b,2))).join("");
        results.push(`Binär: ${str}`);
      } catch { /* skip */ }
    }
    if (!results.length) return { output: `Keine bekannte Kodierung erkannt.\n\nEingabe: "${t.slice(0,100)}${t.length>100?"...":""}"` };
    const firstLine = results[0]!.split(":").slice(1).join(":").trim();
    return { output: results.join("\n\n"), rawOutput: firstLine };
  },
});
