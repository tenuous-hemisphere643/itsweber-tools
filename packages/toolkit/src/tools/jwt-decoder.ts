import { defineTool } from "../core";

function b64url(s: string): string {
  s = s.replace(/-/g,"+").replace(/_/g,"/");
  while (s.length % 4) s += "=";
  return atob(s);
}

export default defineTool({
  id: "jwt-decoder",
  title: "JWT Decoder",
  titleDe: "JWT-Decoder",
  description: "Decode and inspect JWT header, payload, and signature — without verifying.",
  descriptionDe: "JWT-Header, Payload und Signatur dekodieren und prüfen — ohne Signaturverifikation.",
  explanation: "Paste any JWT token to decode its header and payload. Expiry, issued-at, and subject are highlighted. Does NOT verify the signature.",
  explanationDe: "JWT einfügen → Header und Payload werden dekodiert. Ablaufzeit, Ausstellungszeitpunkt und Subject werden hervorgehoben. Signatur wird NICHT verifiziert.",
  category: "Crypto",
  keywords: ["jwt","json","web","token","decode","auth","header","payload","bearer","oauth"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwibmFtZSI6IkFsaWNlIiwiaWF0IjoxNzAxMDAwMDAwLCJleHAiOjE3MDEwODY0MDB9.sig",
  useCasesDe: ["Auth-Tokens debuggen","Claims prüfen","Ablaufzeit analysieren"],
  run: (input) => {
    const parts = input.trim().split(".");
    if (parts.length < 2) throw new Error("Kein gültiges JWT (mindestens 2 Teile benötigt)");
    let header: Record<string, unknown>, payload: Record<string, unknown>;
    try { header = JSON.parse(b64url(parts[0])); } catch { throw new Error("Header konnte nicht dekodiert werden"); }
    try { payload = JSON.parse(b64url(parts[1])); } catch { throw new Error("Payload konnte nicht dekodiert werden"); }
    const now = Math.floor(Date.now()/1000);
    const lines: string[] = [
      `── Header ──────────────────────────────`,
      JSON.stringify(header, null, 2),``,
      `── Payload ─────────────────────────────`,
      JSON.stringify(payload, null, 2),``,
      `── Analyse ─────────────────────────────`,
    ];
    if (payload.sub) lines.push(`Subject (sub):  ${payload.sub}`);
    if (payload.iss) lines.push(`Issuer (iss):   ${payload.iss}`);
    if (payload.aud) lines.push(`Audience (aud): ${payload.aud}`);
    if (payload.iat) lines.push(`Ausgestellt:    ${new Date((payload.iat as number)*1000).toISOString()}`);
    if (payload.exp) {
      const expired = (payload.exp as number) < now;
      lines.push(`Ablauf:         ${new Date((payload.exp as number)*1000).toISOString()} ${expired?"⚠ ABGELAUFEN":"✓ gültig"}`);
      if (!expired) lines.push(`Noch gültig:    ${Math.floor(((payload.exp as number)-now)/60)} Minuten`);
    }
    if (payload.nbf) lines.push(`Nicht vor:      ${new Date((payload.nbf as number)*1000).toISOString()}`);
    lines.push(``);
    lines.push(`Algo:           ${(header.alg as string) ?? "unbekannt"}`);
    lines.push(`Signatur:       ${parts.length === 3 ? "vorhanden (NICHT verifiziert)" : "fehlt"}`);
    return { output: lines.join("\n") };
  },
});
