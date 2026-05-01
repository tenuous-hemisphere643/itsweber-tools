import { defineTool } from "../core";

export default defineTool({
  id: "css-unit-convert",
  title: "CSS Unit Converter",
  titleDe: "CSS-Einheiten-Konverter",
  description: "Convert between px, rem, em, pt, vw, vh and percentage for responsive CSS.",
  descriptionDe: "Konvertiert zwischen px, rem, em, pt, vw, vh und Prozent für responsives CSS.",
  explanation: "Enter a value with unit, e.g. '16px' or '1rem'. Optionally add base font size and viewport: '16px base:16 vw:1440'. Defaults: base 16px, viewport 1440×900.",
  explanationDe: "Wert mit Einheit eingeben, z.B. '16px' oder '1rem'. Optional base und Viewport: '16px base:16 vw:1440'. Standard: 16px, 1440×900.",
  category: "Web",
  keywords: ["css","px","rem","em","vw","vh","unit","einheit","convert","responsive","font"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "16px",
  example: "24px base:16 vw:1440",
  useCasesDe: ["px zu rem für Barrierefreiheit","vw-Werte für Fluid Typography","Print-Layouts in pt"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const mBase = t.match(/base:(\d+)/); const mVw = t.match(/vw:(\d+)/); const mVh = t.match(/vh:(\d+)/);
    const base = mBase ? parseInt(mBase[1]) : 16;
    const vw = mVw ? parseInt(mVw[1]) : 1440;
    const vh = mVh ? parseInt(mVh[1]) : 900;
    const clean = t.replace(/base:\d+/,"").replace(/vw:\d+/,"").replace(/vh:\d+/,"").trim();
    const m = clean.match(/^([\d.]+)(px|rem|em|pt|vw|vh|%)$/);
    if (!m) throw new Error("Format: '16px' oder '1.5rem'. Einheiten: px, rem, em, pt, vw, vh, %");
    const val = parseFloat(m[1]);
    const unit = m[2];
    let px: number;
    switch(unit) {
      case "px": px=val; break;
      case "rem": case "em": px=val*base; break;
      case "pt": px=val*(96/72); break;
      case "vw": px=val/100*vw; break;
      case "vh": px=val/100*vh; break;
      case "%": px=val/100*base; break;
      default: px=val;
    }
    const f = (n: number) => parseFloat(n.toPrecision(4)).toString();
    return { output: [
      `${val}${unit} =`,``,
      `  px:     ${f(px)}`,
      `  rem:    ${f(px/base)}   (base: ${base}px)`,
      `  em:     ${f(px/base)}   (base: ${base}px)`,
      `  pt:     ${f(px*72/96)}`,
      `  vw:     ${f(px/vw*100)}%  (vw: ${vw}px)`,
      `  vh:     ${f(px/vh*100)}%  (vh: ${vh}px)`,
    ].join("\n") };
  },
});
