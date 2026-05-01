import { defineTool } from "../core";

export default defineTool({
  id: "password-strength",
  title: "Password Strength Checker",
  titleDe: "Passwort-Stärke-Prüfer",
  description: "Analyze password strength, entropy, and crack time estimation without sending it anywhere.",
  descriptionDe: "Passwortstärke, Entropie und Cracking-Zeitschätzung analysieren — nichts wird versendet.",
  explanation: "Enter a password to check its strength. Shows entropy, character set size, pattern detection, and estimated crack time.",
  explanationDe: "Passwort eingeben → Stärkeanalyse. Zeigt Entropie, Zeichensatzgröße, Muster-Erkennung und geschätzte Crack-Zeit.",
  category: "Crypto",
  keywords: ["password","passwort","strength","stärke","entropy","entropy","security","crack","breach"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "meinPasswort123!",
  example: "Tr0ub4dor&3",
  useCasesDe: ["Passwort-Policies prüfen","Benutzer beraten","Sicherheit einschätzen"],
  run: (input) => {
    const p = input;
    const hasLower = /[a-z]/.test(p);
    const hasUpper = /[A-Z]/.test(p);
    const hasDigit = /\d/.test(p);
    const hasSpecial = /[^a-zA-Z0-9]/.test(p);
    const hasUnicode = p.split("").some(c => c.charCodeAt(0) > 127);
    let charsetSize = 0;
    if (hasLower) charsetSize += 26;
    if (hasUpper) charsetSize += 26;
    if (hasDigit) charsetSize += 10;
    if (hasSpecial) charsetSize += 32;
    if (hasUnicode) charsetSize += 64;
    charsetSize = Math.max(charsetSize, 1);
    const entropy = Math.log2(Math.pow(charsetSize, p.length));
    const patterns: string[] = [];
    if (/(.)\1{2,}/.test(p)) patterns.push("Wiederholungen");
    if (/012|123|234|345|456|567|678|789|890/.test(p)) patterns.push("Ziffernfolgen");
    if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(p)) patterns.push("Buchstabenfolgen");
    if (p.length < 8) patterns.push("Zu kurz");
    if (/^[a-zA-Z]+$/.test(p)) patterns.push("Nur Buchstaben");
    if (/^[0-9]+$/.test(p)) patterns.push("Nur Ziffern");
    const score = entropy < 28 ? "Sehr schwach" : entropy < 36 ? "Schwach" : entropy < 60 ? "Mittel" : entropy < 128 ? "Stark" : "Sehr stark";
    const crackAttempts = Math.pow(charsetSize, p.length);
    const attPerSec = 1e10;
    const secToCrack = crackAttempts / attPerSec;
    const fmtTime = (s: number): string => {
      if (s < 1) return "< 1 Sekunde";
      if (s < 60) return `${s.toFixed(0)} Sekunden`;
      if (s < 3600) return `${(s/60).toFixed(0)} Minuten`;
      if (s < 86400) return `${(s/3600).toFixed(0)} Stunden`;
      if (s < 31557600) return `${(s/86400).toFixed(0)} Tage`;
      if (s < 3.156e9) return `${(s/31557600).toFixed(0)} Jahre`;
      return `${(s/3.156e9).toFixed(0)} Jahrtausende`;
    };
    return { output: [
      `Länge:        ${p.length} Zeichen`,
      `Zeichensatz:  ${charsetSize} (${[hasLower?"Klein":null,hasUpper?"Groß":null,hasDigit?"Ziffern":null,hasSpecial?"Sonderz.":null].filter(Boolean).join(", ")})`,
      `Entropie:     ${entropy.toFixed(1)} Bits`,
      `Stärke:       ${score}`,
      ``,
      `Crack-Zeit:   ~${fmtTime(secToCrack)}  (bei 10 Mrd/s)`,
      ``,
      patterns.length ? `⚠ Schwächen: ${patterns.join(", ")}` : `✓ Keine offensichtlichen Muster gefunden`,
    ].join("\n") };
  },
});
