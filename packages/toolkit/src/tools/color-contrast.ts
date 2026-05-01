import { defineTool } from "../core";

function hexToRgb(hex: string): [number,number,number] {
  const h = hex.replace("#","");
  const full = h.length===3?h.split("").map(c=>c+c).join(""):h;
  return [parseInt(full.slice(0,2),16),parseInt(full.slice(2,4),16),parseInt(full.slice(4,6),16)];
}
function relLum(r: number, g: number, b: number): number {
  const c = (v: number) => { const n=v/255; return n<=0.04045?n/12.92:Math.pow((n+0.055)/1.055,2.4); };
  return 0.2126*c(r)+0.7152*c(g)+0.0722*c(b);
}
function contrast(l1: number, l2: number): number {
  const lighter=Math.max(l1,l2), darker=Math.min(l1,l2);
  return (lighter+0.05)/(darker+0.05);
}

export default defineTool({
  id: "color-contrast",
  title: "Color Contrast Checker",
  titleDe: "Farb-Kontrast-Prüfer",
  description: "Check WCAG 2.1 contrast ratio between two colors for accessibility compliance.",
  descriptionDe: "WCAG 2.1 Kontrastverhältnis zwischen zwei Farben für Barrierefreiheit prüfen.",
  explanation: "Enter two hex colors separated by a newline or space, e.g. #1d6a73 #ffffff",
  explanationDe: "Zwei Hex-Farben durch Zeilenumbruch oder Leerzeichen trennen, z.B. #1d6a73 #ffffff",
  category: "Web",
  keywords: ["color","contrast","wcag","accessibility","a11y","barrierefreiheit","farbe","rgb","hex"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "#1d6a73\n#ffffff",
  example: "#1d6a73 #f5f0e8",
  useCasesDe: ["WCAG-Konformität prüfen","Text-Lesbarkeit sicherstellen","UI-Designs validieren"],
  run: (input) => {
    const colors = input.trim().split(/[\s\n]+/).filter(s=>/^#?[0-9a-fA-F]{3,6}$/.test(s));
    if (colors.length < 2) throw new Error("Zwei Hex-Farben eingeben, z.B. #1d6a73 #ffffff");
    const [c1,c2] = colors;
    const [r1,g1,b1] = hexToRgb(c1);
    const [r2,g2,b2] = hexToRgb(c2);
    const l1 = relLum(r1,g1,b1);
    const l2 = relLum(r2,g2,b2);
    const ratio = contrast(l1,l2);
    const r = Math.round(ratio*100)/100;
    const aa_normal = ratio >= 4.5;
    const aa_large = ratio >= 3;
    const aaa_normal = ratio >= 7;
    const aaa_large = ratio >= 4.5;
    return { output: [
      `Farbe 1:  ${c1.toUpperCase()} → rgb(${r1}, ${g1}, ${b1})`,
      `Farbe 2:  ${c2.toUpperCase()} → rgb(${r2}, ${g2}, ${b2})`,``,
      `Kontrast: ${r}:1`,``,
      `WCAG AA:`,
      `  Normaler Text (≥4.5:1):  ${aa_normal?"✓ Bestanden":"✗ Nicht bestanden"}`,
      `  Großer Text   (≥3.0:1):  ${aa_large?"✓ Bestanden":"✗ Nicht bestanden"}`,``,
      `WCAG AAA:`,
      `  Normaler Text (≥7.0:1):  ${aaa_normal?"✓ Bestanden":"✗ Nicht bestanden"}`,
      `  Großer Text   (≥4.5:1):  ${aaa_large?"✓ Bestanden":"✗ Nicht bestanden"}`,
    ].join("\n") };
  },
});
