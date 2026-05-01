import { defineTool } from "../core";

const COUNTRY_LEN: Record<string,number> = {
  AL:28,AD:24,AT:20,AZ:28,BH:22,BE:16,BA:20,BR:29,BG:22,CR:22,HR:21,CY:28,
  CZ:24,DK:18,DO:28,EE:20,FI:18,FR:27,GE:22,DE:22,GI:23,GR:27,GT:28,HU:28,
  IS:26,IE:22,IL:23,IT:27,KZ:20,KW:30,LV:21,LB:28,LI:21,LT:20,LU:20,MT:31,
  MR:27,MU:30,MC:27,MD:24,ME:22,NL:18,NO:15,PK:24,PL:28,PT:25,RO:24,SA:24,
  RS:22,SK:24,SI:19,ES:24,SE:24,CH:21,TN:24,TR:26,AE:23,GB:22,VG:24,
};

function modStr(iban: string): number {
  let remainder = 0;
  for (const c of iban) {
    const n = c >= "0" && c <= "9" ? parseInt(c) : c.charCodeAt(0) - 55;
    remainder = (remainder * (n >= 10 ? 100 : 10) + n) % 97;
  }
  return remainder;
}

export default defineTool({
  id: "iban-validator",
  title: "IBAN Validator",
  titleDe: "IBAN-Validator",
  description: "Validate IBAN checksums and extract bank account info (country, check digits, BBAN).",
  descriptionDe: "IBAN-Prüfsummen validieren und Kontoinformationen extrahieren (Land, Prüfziffern, BBAN).",
  explanation: "Enter any IBAN to validate its checksum and extract country, check digits, and BBAN.",
  explanationDe: "Beliebige IBAN eingeben → Prüfsumme validieren, Land, Prüfziffern und BBAN extrahieren.",
  category: "Data",
  keywords: ["iban","bank","account","validate","prüfsumme","bic","sepa","konto","bankverbindung"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "DE89 3704 0044 0532 0130 00",
  example: "DE89370400440532013000",
  useCasesDe: ["Überweisungen prüfen","SEPA-Mandate validieren","Bankdaten verifizieren"],
  run: (input) => {
    const raw = input.trim().replace(/\s+/g,"").toUpperCase();
    if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(raw)) throw new Error("IBAN muss mit 2 Buchstaben (Land) + 2 Ziffern beginnen");
    const country = raw.slice(0,2);
    const check = raw.slice(2,4);
    const bban = raw.slice(4);
    const expectedLen = COUNTRY_LEN[country];
    if (expectedLen && raw.length !== expectedLen) {
      throw new Error(`Falsche Länge für ${country}: erwartet ${expectedLen} Zeichen, erhalten ${raw.length}`);
    }
    const rearranged = bban + country + check;
    const numeric = rearranged.split("").map(c=>c>="A"&&c<="Z"?String(c.charCodeAt(0)-55):c).join("");
    const valid = modStr(numeric) === 1;
    const formatted = raw.match(/.{1,4}/g)!.join(" ");
    return { output: [
      `IBAN:         ${formatted}`,
      `Prüfung:      ${valid ? "✓ Gültig" : "✗ Ungültig (Prüfziffern falsch)"}`,``,
      `Land:         ${country}`,
      `Prüfziffern:  ${check}`,
      `BBAN:         ${bban}`,
      expectedLen?`Erwartete Länge: ${expectedLen}`:"Länderlänge: nicht bekannt",
    ].join("\n") };
  },
});
