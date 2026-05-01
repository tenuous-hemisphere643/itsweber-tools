import { defineTool } from "../core";

export default defineTool({
  id: "unit-currency-rate",
  title: "Currency Rate Calculator",
  titleDe: "Währungsrechner",
  description: "Calculate currency conversions using manually entered exchange rates.",
  descriptionDe: "Währungsumrechnungen mit manuell eingegebenen Wechselkursen berechnen.",
  explanation: "Format: amount FROM to TO at RATE. E.g. '100 EUR to USD at 1.08'. Or: '100 EUR to USD' to see what rate you need to enter.",
  explanationDe: "Format: Betrag VON nach ZU bei KURS. Z.B. '100 EUR to USD at 1.08'. Oder: '100 EUR to USD' für Hinweis.",
  category: "Converter",
  keywords: ["currency","währung","exchange","rate","usd","eur","convert","rechner"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "100 EUR to USD at 1.08",
  example: "250 USD to EUR at 0.925",
  useCasesDe: ["Reisekosten umrechnen","Rechnungen in Fremdwährung","Budget in lokale Währung"],
  run: (input) => {
    const t = input.trim();
    const m = t.match(/^([\d.,]+)\s+([A-Z]{3})\s+to\s+([A-Z]{3})\s+at\s+([\d.,]+)$/i);
    if (!m) {
      const mSimple = t.match(/^([\d.,]+)\s+([A-Z]{3})\s+to\s+([A-Z]{3})$/i);
      if (mSimple) {
        return { output: [
          `Kurs benötigt für ${mSimple[2]} → ${mSimple[3]}`,
          `Aktuellen Kurs bei google.de/search?q=${mSimple[2]}+${mSimple[3]}+Kurs prüfen`,
          ``,
          `Dann eingeben:`,
          `${mSimple[1]} ${mSimple[2].toUpperCase()} to ${mSimple[3].toUpperCase()} at KURS`,
        ].join("\n") };
      }
      throw new Error("Format: 100 EUR to USD at 1.08");
    }
    const amount = parseFloat(m[1].replace(",","."));
    const from = m[2].toUpperCase();
    const to = m[3].toUpperCase();
    const rate = parseFloat(m[4].replace(",","."));
    const result = amount * rate;
    const f = (n: number) => n.toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2});
    return { output: [
      `${f(amount)} ${from}  =  ${f(result)} ${to}`,
      ``,
      `Kurs:       1 ${from} = ${rate} ${to}`,
      `Gegenkurs:  1 ${to} = ${(1/rate).toFixed(6)} ${from}`,
      ``,
      `Weitere Beträge bei diesem Kurs:`,
      `  10 ${from}   = ${f(10*rate)} ${to}`,
      `  100 ${from}  = ${f(100*rate)} ${to}`,
      `  1000 ${from} = ${f(1000*rate)} ${to}`,
    ].join("\n") };
  },
});
