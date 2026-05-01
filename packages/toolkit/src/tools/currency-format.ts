import { defineTool } from "../core";

export default defineTool({
  id: "currency-format",
  title: "Currency Formatter",
  titleDe: "Währungs-Formatierer",
  description: "Format amounts in multiple currencies with proper symbols, separators, and locale conventions.",
  descriptionDe: "Beträge in mehreren Währungen mit korrekten Symbolen, Trennzeichen und lokalen Konventionen formatieren.",
  explanation: "Enter a number or amount. Optionally specify currencies: '1234.56 EUR USD GBP CHF'.",
  explanationDe: "Zahl oder Betrag eingeben. Optional Währungen angeben: '1234.56 EUR USD GBP CHF'.",
  category: "Converter",
  keywords: ["currency","währung","format","money","geld","eur","usd","gbp","locale","symbol"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "1234.56",
  example: "9999.99 EUR USD GBP CHF JPY",
  useCasesDe: ["Preise lokalisieren","Internationale Rechnungen","Währungssymbole korrekt setzen"],
  run: (input) => {
    const parts = input.trim().split(/\s+/);
    const numStr = parts[0].replace(",",".");
    const n = parseFloat(numStr);
    if (isNaN(n)) throw new Error("Ungültige Zahl");
    const CURRENCIES: [string,string,string][] = [
      ["EUR","de-DE","Euro"],["USD","en-US","US-Dollar"],["GBP","en-GB","Britisches Pfund"],
      ["CHF","de-CH","Schweizer Franken"],["JPY","ja-JP","Japanischer Yen"],
      ["CAD","en-CA","Kanadischer Dollar"],["AUD","en-AU","Australischer Dollar"],
      ["CNY","zh-CN","Chinesischer Yuan"],["INR","en-IN","Indische Rupie"],
      ["BRL","pt-BR","Brasilianischer Real"],["NOK","nb-NO","Norwegische Krone"],
      ["SEK","sv-SE","Schwedische Krone"],["DKK","da-DK","Dänische Krone"],
      ["PLN","pl-PL","Polnischer Zloty"],["CZK","cs-CZ","Tschechische Krone"],
    ];
    const requested = parts.slice(1).map(s=>s.toUpperCase()).filter(s=>s.length===3);
    const toShow = requested.length ? CURRENCIES.filter(([c])=>requested.includes(c)) : CURRENCIES.slice(0,8);
    if (!toShow.length) throw new Error(`Unbekannte Währungen: ${requested.join(", ")}`);
    const lines = toShow.map(([code,locale,name])=>{
      try {
        const fmt = new Intl.NumberFormat(locale,{style:"currency",currency:code}).format(n);
        return `${code.padEnd(5)}  ${fmt.padEnd(20)}  ${name}`;
      } catch { return `${code.padEnd(5)}  (Fehler)`; }
    });
    return { output: [`Betrag: ${n.toLocaleString("de-DE")}`,``,...lines].join("\n") };
  },
});
