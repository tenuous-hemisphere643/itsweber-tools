import { defineTool } from "../core";

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

export default defineTool({
  id: "aspect-ratio",
  title: "Aspect Ratio Calculator",
  titleDe: "Seitenverhältnis-Rechner",
  description: "Calculate aspect ratios and find missing dimensions.",
  descriptionDe: "Berechnet Seitenverhältnisse und ermittelt fehlende Dimensionen.",
  explanation: "Enter 'WxH' to get the ratio, or 'WxH at W2' to calculate the missing dimension while maintaining the ratio.",
  explanationDe: "WxH eingeben → Verhältnis. WxH bei W2 eingeben → fehlende Dimension bei gleichem Verhältnis.",
  category: "Measurement",
  keywords: ["aspect","ratio","seitenverhältnis","width","height","dimension","resolution","auflösung","4k","16:9"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "1920x1080  oder  1920x1080 bei 1280",
  example: "1920x1080",
  useCasesDe: ["Videoauflösungen berechnen","Banner-Dimensionen ableiten","Responsive Bilder skalieren"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const atMatch = t.match(/^(\d+)x(\d+)\s+(?:at|bei)\s+(\d+)$/);
    if (atMatch) {
      const [,w,h,w2] = atMatch.map(Number);
      const h2 = Math.round((w2 * h) / w);
      const g = gcd(w,h);
      return { output: [`Original:  ${w} × ${h}  (${w/g}:${h/g})`,`Skaliert:  ${w2} × ${h2}  (${(w2/h2).toFixed(4)}:1)`].join("\n") };
    }
    const m = t.match(/^(\d+)x(\d+)$/);
    if (!m) throw new Error("Format: 1920x1080 oder 1920x1080 bei 1280");
    const [,w,h] = m.map(Number);
    const g = gcd(w,h);
    const r = w/h;
    const presets: [number,string][] = [[16/9,"16:9 (Widescreen)"],[4/3,"4:3 (Standard)"],[21/9,"21:9 (Ultrawide)"],[1,"1:1 (Quadrat)"],[3/2,"3:2 (DSLR)"],[9/16,"9:16 (Hochformat)"]];
    const nearest = presets.sort((a,b)=>Math.abs(a[0]-r)-Math.abs(b[0]-r))[0];
    return { output: [
      `Auflösung:  ${w} × ${h}`,
      `Verhältnis: ${w/g}:${h/g}`,
      `Dezimal:    ${r.toFixed(4)}:1`,
      `Nächstes Standardformat: ${nearest[1]}`,
      ``,
      `Skalierungen (gleicher Ratio):`,
      `  480p:  ${Math.round(480*r)} × 480`,
      `  720p:  ${Math.round(720*r)} × 720`,
      `  1080p: ${Math.round(1080*r)} × 1080`,
      `  1440p: ${Math.round(1440*r)} × 1440`,
      `  4K:    ${Math.round(2160*r)} × 2160`,
    ].join("\n") };
  },
});
