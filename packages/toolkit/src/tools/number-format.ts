import { defineTool } from "../core";

export default defineTool({
  id: "number-format",
  title: "Number Formatter",
  titleDe: "Zahlen-Formatierer",
  description: "Format numbers with thousands separators, currencies, and scientific notation for different locales.",
  descriptionDe: "Zahlen mit Tausendertrenner, Währungen und wissenschaftlicher Notation für verschiedene Sprachen formatieren.",
  explanation: "Enter a number. Optionally add locale: de, en, fr, ch. Shows formatted output in multiple styles.",
  explanationDe: "Zahl eingeben. Optional Locale anhängen: de, en, fr, ch. Zeigt Ausgaben in verschiedenen Stilen.",
  category: "Math",
  keywords: ["number","format","zahl","currency","decimal","thousand","locale","formatieren","währung"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "1234567.89",
  example: "1234567.89 de",
  useCasesDe: ["Zahlen für Reports formatieren","Währungsbeträge darstellen","Internationale Formate vergleichen"],
  run: (input) => {
    const parts = input.trim().split(/\s+/);
    const numStr = parts[0].replace(/[,]/g,".").replace(/[^0-9.\-e]/g,"");
    const locale = parts[1]?.toLowerCase() || "de";
    const n = parseFloat(numStr);
    if (isNaN(n)) throw new Error("Ungültige Zahl");
    const localeMap: Record<string,string> = { de:"de-DE", en:"en-US", fr:"fr-FR", ch:"de-CH", at:"de-AT" };
    const loc = localeMap[locale] || locale;
    const fmtDe = new Intl.NumberFormat("de-DE").format(n);
    const fmtEn = new Intl.NumberFormat("en-US").format(n);
    const fmtFr = new Intl.NumberFormat("fr-FR").format(n);
    const fmtCh = new Intl.NumberFormat("de-CH").format(n);
    const fmtSci = n.toExponential(4);
    const fmtFixed2 = n.toFixed(2);
    const fmtEur = new Intl.NumberFormat(loc,{style:"currency",currency:"EUR"}).format(n);
    const fmtUsd = new Intl.NumberFormat(loc,{style:"currency",currency:"USD"}).format(n);
    return { output: [
      `Eingabe:     ${n}`,``,
      `Deutsch:     ${fmtDe}`,
      `Englisch:    ${fmtEn}`,
      `Französisch: ${fmtFr}`,
      `Schweizer:   ${fmtCh}`,
      ``,
      `2 Dezimalst: ${fmtFixed2}`,
      `Wissensch.:  ${fmtSci}`,
      ``,
      `EUR:         ${fmtEur}`,
      `USD:         ${fmtUsd}`,
    ].join("\n") };
  },
});
