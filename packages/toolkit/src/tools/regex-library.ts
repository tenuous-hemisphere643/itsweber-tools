import { defineTool } from "../core";

const PATTERNS: Record<string,[string,string,string]> = {
  email:     ["E-Mail", `/^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$/`, "alice@example.com"],
  url:       ["URL (HTTP/HTTPS)", `/^https?:\\/\\/([\\w\\-]+\\.)+[\\w]{2,}(\\/[^\\s]*)?$/i`, "https://itsweber.de/tools"],
  ipv4:      ["IPv4-Adresse", `/^(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$/`, "192.168.1.1"],
  ipv6:      ["IPv6-Adresse", `/^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/`, "2001:db8::1"],
  phone_de:  ["Deutsche Telefonnummer", `/^(\\+49|0)[\\s\\-]?[1-9]\\d{1,4}[\\s\\-]?\\d{3,10}$/`, "+49 30 12345678"],
  iban:      ["IBAN", `/^[A-Z]{2}\\d{2}[A-Z0-9]{1,30}$/`, "DE89370400440532013000"],
  date_iso:  ["ISO-Datum (YYYY-MM-DD)", `/^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$/`, "2024-12-31"],
  date_de:   ["Deutsches Datum (DD.MM.YYYY)", `/^(0[1-9]|[12]\\d|3[01])\\.(0[1-9]|1[0-2])\\.\\d{4}$/`, "31.12.2024"],
  hex_color: ["Hex-Farbe", `/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/`, "#1d6a73"],
  slug:      ["URL-Slug", `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`, "my-blog-post"],
  semver:    ["Semantic Version", `/^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:[-+][\\w.]+)?$/`, "1.2.3-beta.1"],
  zip_de:    ["Deutsche PLZ", `/^\\d{5}$/`, "10115"],
  credit:    ["Kreditkarte (grob)", `/^4[0-9]{12}(?:[0-9]{3})?$|^5[1-5]\\d{14}$|^3[47]\\d{13}$/`, "4111111111111111"],
  uuid:      ["UUID v4", `/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i`, "550e8400-e29b-41d4-a716-446655440000"],
  jwt:       ["JWT Token", `/^[A-Za-z0-9_\\-]+\\.[A-Za-z0-9_\\-]+\\.[A-Za-z0-9_\\-]*$/`, "eyJ..."],
};

export default defineTool({
  id: "regex-library",
  title: "Regex Library",
  titleDe: "Regex-Bibliothek",
  description: "Browse and test common regex patterns for email, URL, IP, dates, phone, IBAN, and more.",
  descriptionDe: "Häufige Regex-Muster für E-Mail, URL, IP, Datum, Telefon, IBAN und mehr durchsuchen und testen.",
  explanation: "Enter a pattern name to get its regex (e.g. 'email', 'ipv4'). Optionally add a test value: 'email alice@example.com'. Enter 'all' for list.",
  explanationDe: "Mustername eingeben (z.B. 'email', 'ipv4'). Optional Testwert: 'email alice@example.com'. 'all' für alle anzeigen.",
  category: "Development",
  keywords: ["regex","pattern","muster","email","url","ip","validate","library","bibliothek","regexp"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "email",
  example: "email alice@example.com",
  useCasesDe: ["Regex-Muster schnell nachschlagen","Formulareingaben validieren","Regex lernen"],
  run: (input) => {
    const t = input.trim();
    if (t.toLowerCase()==="all") {
      return { output: Object.entries(PATTERNS).map(([k,[name,pat]])=>`${k.padEnd(12)}  ${name}\n              ${pat}`).join("\n\n") };
    }
    const [key, ...testParts] = t.split(/\s+/);
    const testVal = testParts.join(" ");
    const entry = PATTERNS[key.toLowerCase()];
    if (!entry) throw new Error(`Unbekanntes Muster '${key}'.\nVerfügbar: ${Object.keys(PATTERNS).join(", ")}\nOder 'all' für alle.`);
    const [name, pattern, example] = entry;
    const lines = [`${name}:`,``,`Regex:   ${pattern}`,`Beispiel: ${example}`];
    if (testVal) {
      const regexStr = pattern.replace(/^\/|\/[gimsuy]*$/g,"");
      const flags = pattern.match(/\/([gimsuy]*)$/)?.[1]||"";
      try {
        const re = new RegExp(regexStr, flags);
        lines.push(``,`Test: "${testVal}" → ${re.test(testVal)?"✓ Match":"✗ Kein Match"}`);
      } catch { lines.push(`(Regex-Fehler beim Testen)`); }
    }
    return { output: lines.join("\n") };
  },
});
