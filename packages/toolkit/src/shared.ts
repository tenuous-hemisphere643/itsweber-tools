export const textEncoder = new TextEncoder();

const DIACRITICS = /[̀-ͯ]/g;

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(DIACRITICS, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function words(value: string): string[] {
  return value
    .normalize("NFKD")
    .replace(DIACRITICS, "")
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function ipToInt(ip: string): number {
  const parts = ip.split(".").map((part) => Number.parseInt(part, 10));
  if (parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) {
    throw new Error("Invalid IPv4 address.");
  }
  return parts.reduce((sum, part) => ((sum << 8) + part) >>> 0, 0);
}

export function intToIp(value: number): string {
  return [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join(".");
}

export function base64UrlDecode(value: string): string {
  const padded = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  return decodeURIComponent(escape(atob(padded)));
}

export function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (char) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return entities[char];
  });
}
