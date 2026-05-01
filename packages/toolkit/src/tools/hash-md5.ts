import { defineTool } from "../core";
import { textEncoder } from "../shared";

function rotateLeft(x: number, n: number) { return (x << n) | (x >>> (32 - n)); }
function addUnsigned(a: number, b: number) { return (a + b) | 0; }

function md5(input: string): string {
  const msg = textEncoder.encode(input);
  const len = msg.length;
  const bitLen = len * 8;
  const padded = new Uint8Array(len + 64 - ((len + 8) % 64) + 8);
  padded.set(msg);
  padded[len] = 0x80;
  new DataView(padded.buffer).setUint32(padded.length - 8, bitLen & 0xFFFFFFFF, true);
  new DataView(padded.buffer).setUint32(padded.length - 4, Math.floor(bitLen / 0x100000000), true);

  const T = Array.from({ length: 64 }, (_, i) => Math.floor(2 ** 32 * Math.abs(Math.sin(i + 1))) | 0);
  const S = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
  let [a, b, c, d] = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476];
  const view = new DataView(padded.buffer);

  for (let i = 0; i < padded.length; i += 64) {
    const M = Array.from({ length: 16 }, (_, j) => view.getInt32(i + j * 4, true));
    let [A, B, C, D] = [a, b, c, d];
    for (let j = 0; j < 64; j++) {
      let F: number, g: number;
      if (j < 16)      { F = (B & C) | (~B & D); g = j; }
      else if (j < 32) { F = (D & B) | (~D & C); g = (5 * j + 1) % 16; }
      else if (j < 48) { F = B ^ C ^ D;           g = (3 * j + 5) % 16; }
      else             { F = C ^ (B | ~D);         g = (7 * j) % 16; }
      const temp = D; D = C; C = B;
      B = addUnsigned(B, rotateLeft(addUnsigned(addUnsigned(A, F), addUnsigned(M[g], T[j])), S[j]));
      A = temp;
    }
    a = addUnsigned(a, A); b = addUnsigned(b, B); c = addUnsigned(c, C); d = addUnsigned(d, D);
  }
  return [a, b, c, d].map((n) => new Uint8Array(new Int32Array([n]).buffer).reduce((s, v) => s + v.toString(16).padStart(2, "0"), "")).join("");
}

export default defineTool({
  id: "hash-md5",
  title: "MD5 Hash",
  titleDe: "MD5-Hash",
  description: "Generate an MD5 hash of any text input.",
  descriptionDe: "Erzeugt einen MD5-Hash aus beliebigem Text.",
  explanation: "MD5 produces a 128-bit (32 hex char) hash. It is NOT cryptographically secure — use for checksums and legacy compatibility only.",
  explanationDe: "MD5 erzeugt einen 128-Bit (32 Hex-Zeichen) Hash. Nicht kryptografisch sicher — nur für Checksummen und Legacy-Kompatibilität verwenden.",
  category: "Crypto",
  keywords: ["md5", "hash", "checksum", "prüfsumme", "digest", "legacy"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "Text to hash...",
  example: "ItsWeber Tools",
  useCasesDe: ["Legacy-Checksummen erzeugen", "Datei-Integrität prüfen", "Passwort-Altlasten analysieren"],
  run: (input) => ({
    output: [
      `MD5:     ${md5(input)}`,
      `Length:  32 hex chars (128 bit)`,
      `⚠ MD5 is NOT cryptographically secure. Use SHA-256 for security.`,
    ].join("\n"),
  }),
});
