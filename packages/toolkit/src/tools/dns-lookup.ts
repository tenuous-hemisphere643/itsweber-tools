import { defineTool } from "../core";

export default defineTool({
  id: "dns-lookup",
  title: "DNS Lookup (DoH)",
  titleDe: "DNS Lookup (DoH)",
  description: "Look up DNS records (A, AAAA, MX, TXT, CNAME) via DNS-over-HTTPS.",
  descriptionDe: "Fragt DNS-Einträge (A, AAAA, MX, TXT, CNAME) über DNS-over-HTTPS ab.",
  explanation: "Uses Cloudflare DNS-over-HTTPS (1.1.1.1/dns-query) to resolve DNS records. Input: domain [type]. Type defaults to A. No DNS queries leave without HTTPS.",
  explanationDe: "Nutzt Cloudflare DNS-over-HTTPS (1.1.1.1/dns-query) für DNS-Abfragen. Eingabe: Domain [Typ]. Standard: A. Alle Anfragen gehen über HTTPS.",
  category: "Network",
  keywords: ["dns", "lookup", "resolve", "a", "aaaa", "mx", "txt", "cname", "nslookup", "dig", "doh"],
  status: "ready",
  privacyMode: "network-fetch",
  placeholder: "example.com A",
  example: "cloudflare.com MX",
  useCasesDe: ["DNS-Propagation prüfen", "MX-Records für Mailserver", "TXT-Records für SPF/DKIM"],
  run: async (input) => {
    const parts = input.trim().split(/\s+/);
    const domain = parts[0];
    const type = (parts[1] ?? "A").toUpperCase();
    const validTypes = ["A", "AAAA", "MX", "TXT", "CNAME", "NS", "PTR", "SOA", "CAA"];
    if (!validTypes.includes(type)) throw new Error(`Unknown type '${type}'. Supported: ${validTypes.join(", ")}`);

    const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`;
    let res: Response;
    try {
      res = await fetch(url, { headers: { accept: "application/dns-json" } });
    } catch { throw new Error("DNS query failed. Check your internet connection."); }

    if (!res.ok) throw new Error(`DNS server returned ${res.status}.`);
    const data = await res.json() as { Status: number; Answer?: Array<{ name: string; type: number; TTL: number; data: string }> };

    const STATUS_CODES: Record<number, string> = { 0: "NOERROR", 1: "FORMERR", 2: "SERVFAIL", 3: "NXDOMAIN", 5: "REFUSED" };

    if (data.Status !== 0) {
      return { output: `Status: ${STATUS_CODES[data.Status] ?? data.Status}\n\nNo records found for ${domain} (${type}).` };
    }

    const answers = data.Answer ?? [];
    if (answers.length === 0) return { output: `Status: NOERROR\n\nNo ${type} records found for ${domain}.` };

    const lines = [
      `Domain: ${domain}`,
      `Type:   ${type}`,
      `Status: NOERROR`,
      ``,
      ...answers.map((r) => `  ${r.data.padEnd(48)} TTL ${r.TTL}s`),
    ];
    return { output: lines.join("\n") };
  },
});
