import { defineTool } from "../core";
import { textEncoder } from "../shared";

function base64url(data: Uint8Array | string): string {
  const bytes = typeof data === "string" ? textEncoder.encode(data) : data;
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export default defineTool({
  id: "jwt-generator",
  title: "JWT Generator (HS256)",
  titleDe: "JWT Generator (HS256)",
  description: "Generate a signed HS256 JWT from payload and secret.",
  descriptionDe: "Erzeugt ein signiertes HS256-JWT aus Payload und Secret.",
  explanation: "Input: first line = HMAC secret, remaining lines = JSON payload. Generates a valid HS256 JWT token using the Web Crypto API. Never leaves the browser.",
  explanationDe: "Eingabe: erste Zeile = HMAC-Secret, restliche Zeilen = JSON-Payload. Erzeugt ein gültiges HS256-JWT über die Web Crypto API. Verlässt nie den Browser.",
  category: "Crypto",
  keywords: ["jwt", "token", "hs256", "hmac", "generate", "auth", "bearer", "sign", "signieren"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "my-secret\n{\n  \"sub\": \"user123\",\n  \"role\": \"admin\"\n}",
  example: "my-secret-key\n{\n  \"sub\": \"user-42\",\n  \"name\": \"ItsWeber\",\n  \"role\": \"admin\"\n}",
  useCasesDe: ["Test-Tokens für APIs erzeugen", "JWT-Authentifizierung entwickeln", "Token-Payload validieren"],
  run: async (input) => {
    const newline = input.indexOf("\n");
    if (newline === -1) throw new Error("First line = secret, remaining lines = JSON payload.");
    const secret = input.slice(0, newline).trim();
    const payloadRaw = input.slice(newline + 1).trim();
    let payload: object;
    try { payload = JSON.parse(payloadRaw); } catch { throw new Error("Payload must be valid JSON."); }

    const now = Math.floor(Date.now() / 1000);
    const fullPayload = { iat: now, exp: now + 3600, ...payload };

    const header = { alg: "HS256", typ: "JWT" };
    const headerB64 = base64url(JSON.stringify(header));
    const payloadB64 = base64url(JSON.stringify(fullPayload));
    const signingInput = `${headerB64}.${payloadB64}`;

    const key = await crypto.subtle.importKey("raw", textEncoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", key, textEncoder.encode(signingInput));
    const token = `${signingInput}.${base64url(new Uint8Array(sig))}`;

    return {
      output: [
        `── Token ──`,
        token,
        ``,
        `── Header ──`,
        JSON.stringify(header, null, 2),
        ``,
        `── Payload ──`,
        JSON.stringify(fullPayload, null, 2),
        ``,
        `iat: ${new Date(fullPayload.iat * 1000).toISOString()}`,
        `exp: ${new Date(fullPayload.exp * 1000).toISOString()} (+1h)`,
        ``,
        `Method: Web Crypto API · HMAC-SHA256 · local-only`,
      ].join("\n"),
    };
  },
});
