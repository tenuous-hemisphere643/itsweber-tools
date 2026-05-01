import { defineTool } from "../core";

const LOWER  = "abcdefghijklmnopqrstuvwxyz";
const UPPER  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?";

function secure(charset: string, length: number): string {
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (v) => charset[v % charset.length]).join("");
}

export default defineTool({
  id: "password-generator",
  title: "Password Generator",
  titleDe: "Passwort-Generator",
  description: "Generate cryptographically secure passwords using the Web Crypto API.",
  descriptionDe: "Erzeugt kryptografisch sichere Passwörter über die Web Crypto API.",
  explanation: "Uses crypto.getRandomValues() to generate passwords. Input format: 'length [options]'. Options: L=lower, U=upper, D=digits, S=symbols. Default (no flags): LUD. Add S explicitly for symbols.",
  explanationDe: "Nutzt crypto.getRandomValues(). Eingabe: 'Länge [Optionen]'. Optionen: L=Kleinbuchstaben, U=Großbuchstaben, D=Ziffern, S=Sonderzeichen. Standard ohne Flags: LUD. S explizit angeben für Sonderzeichen.",
  category: "Crypto",
  keywords: ["password", "passwort", "generator", "random", "secure", "crypto", "secret"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "20  or  32 LUD  or  16 S",
  example: "24",
  useCasesDe: ["Sichere Passwörter für Services erstellen", "API-Secrets generieren", "Temporäre Zugangsdaten erzeugen"],
  run: (input) => {
    const parts = input.trim().toUpperCase().split(/\s+/);
    const length = parseInt(parts[0], 10);
    if (Number.isNaN(length) || length < 4 || length > 256) throw new Error("Length must be between 4 and 256.");

    const flags = parts.slice(1).join("");
    const useLower  = !flags || flags.includes("L");
    const useUpper  = !flags || flags.includes("U");
    const useDigits = !flags || flags.includes("D");
    const useSymbols = flags.includes("S");

    let charset = "";
    if (useLower)  charset += LOWER;
    if (useUpper)  charset += UPPER;
    if (useDigits) charset += DIGITS;
    if (useSymbols) charset += SYMBOLS;
    if (!charset) throw new Error("Select at least one character class (L, U, D, S).");

    const pw1 = secure(charset, length);
    const pw2 = secure(charset, length);
    const pw3 = secure(charset, length);

    const entropy = Math.log2(charset.length) * length;

    return {
      output: [
        `[1] ${pw1}`,
        `[2] ${pw2}`,
        `[3] ${pw3}`,
        "",
        `Charset:  ${charset.length} chars  (L:${useLower?1:0} U:${useUpper?1:0} D:${useDigits?1:0} S:${useSymbols?1:0})`,
        `Entropy:  ~${entropy.toFixed(1)} bit`,
        `Method:   Web Crypto API · crypto.getRandomValues()`,
      ].join("\n"),
    };
  },
});
