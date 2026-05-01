import { defineTool } from "../core";

export default defineTool({
  id: "power-calc",
  title: "Power & Electricity Calculator",
  titleDe: "Strom & Leistungs-Rechner",
  description: "Calculate power consumption, electricity costs, and Ohm's law.",
  descriptionDe: "Stromverbrauch, Stromkosten und Ohmsches Gesetz berechnen.",
  explanation: "Commands: 'cost W hours [price]' for electricity cost, 'ohm V I' or 'ohm V R' or 'ohm I R' for Ohm's law.",
  explanationDe: "Befehle: 'cost W Stunden [Preis]' für Stromkosten, 'ohm V I' oder 'ohm V R' oder 'ohm I R' für Ohmsches Gesetz.",
  category: "Math",
  keywords: ["power","watt","electricity","cost","ohm","voltage","current","resistance","strom","elektrizität"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "cost 100 8",
  example: "cost 2000 24 0.30",
  useCasesDe: ["Stromkosten berechnen","Server-Betriebskosten","Elektronik-Schaltungen"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const parts = t.split(/\s+/);
    const cmd = parts[0];
    if (cmd==="cost") {
      const watts = parseFloat(parts[1]);
      const hours = parseFloat(parts[2]);
      const pricePerKwh = parseFloat(parts[3] || "0.32");
      if (isNaN(watts)||isNaN(hours)) throw new Error("Format: cost WATT STUNDEN [PREIS/kWh]");
      const kwh = watts / 1000 * hours;
      const costEur = kwh * pricePerKwh;
      const dailyKwh = watts / 1000 * 24;
      const monthlyKwh = dailyKwh * 30;
      const yearlyKwh = dailyKwh * 365;
      return { output: [
        `${watts} W für ${hours} Stunden:`,
        `  Verbrauch:   ${kwh.toFixed(3)} kWh`,
        `  Kosten:      ${costEur.toFixed(4)} € (bei ${pricePerKwh} €/kWh)`,``,
        `Hochrechnung bei Dauerbetrieb:`,
        `  Pro Tag:     ${dailyKwh.toFixed(2)} kWh = ${(dailyKwh*pricePerKwh).toFixed(2)} €`,
        `  Pro Monat:   ${monthlyKwh.toFixed(1)} kWh = ${(monthlyKwh*pricePerKwh).toFixed(2)} €`,
        `  Pro Jahr:    ${yearlyKwh.toFixed(0)} kWh = ${(yearlyKwh*pricePerKwh).toFixed(2)} €`,
      ].join("\n") };
    }
    if (cmd==="ohm") {
      const [,a,b] = parts;
      if (!a||!b) throw new Error("Format: ohm V I  |  ohm V R  |  ohm I R\n(zwei von drei: Spannung V, Strom I [A], Widerstand R [Ω])");
      const parseVal = (s: string): [number,string] => {
        const m = s.match(/^([\d.]+)(v|a|r|Ω|ohm)?$/);
        return m ? [parseFloat(m[1]), m[2]||""] : [parseFloat(s), ""];
      };
      const [va] = parseVal(a);
      const [vb] = parseVal(b);
      if (isNaN(va)||isNaN(vb)) throw new Error("Ungültige Werte");
      const [v,i,r] = [va, vb, va/vb];
      return { output: [
        `Ohmsches Gesetz: U = I × R`,``,
        `Eingabe:    ${va} und ${vb}`,
        `U (Volt):   ${v.toFixed(3)} V`,
        `I (Ampere): ${i.toFixed(3)} A`,
        `R (Ohm):    ${r.toFixed(3)} Ω`,
        `P (Watt):   ${(v*i).toFixed(3)} W`,
      ].join("\n") };
    }
    throw new Error("Befehle: cost WATT STUNDEN [PREIS] | ohm V I");
  },
});
