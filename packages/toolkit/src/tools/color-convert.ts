import { defineTool } from "../core";

function hexToRgb(hex: string): [number,number,number] {
  const h = hex.replace("#","");
  const full = h.length===3 ? h.split("").map(c=>c+c).join("") : h;
  return [parseInt(full.slice(0,2),16), parseInt(full.slice(2,4),16), parseInt(full.slice(4,6),16)];
}
function rgbToHsl(r: number, g: number, b: number): [number,number,number] {
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h=0, s=0; const l=(max+min)/2;
  if (max!==min) {
    const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min);
    if (max===r) h=((g-b)/d+(g<b?6:0))/6;
    else if (max===g) h=((b-r)/d+2)/6;
    else h=((r-g)/d+4)/6;
  }
  return [Math.round(h*360), Math.round(s*100), Math.round(l*100)];
}
function rgbToHwb(r: number, g: number, b: number): [number,number,number] {
  const [h] = rgbToHsl(r,g,b);
  const w = Math.min(r,g,b)/255*100;
  const bk = (1-Math.max(r,g,b)/255)*100;
  return [h, Math.round(w), Math.round(bk)];
}
function hslToRgb(h: number, s: number, l: number): [number,number,number] {
  h/=360; s/=100; l/=100;
  if (s===0) { const v=Math.round(l*255); return [v,v,v]; }
  const q=l<0.5?l*(1+s):l+s-l*s, p=2*l-q;
  const hue=(h: number)=>{ let v=h; if(v<0)v+=1; if(v>1)v-=1; if(v<1/6)return p+(q-p)*6*v; if(v<1/2)return q; if(v<2/3)return p+(q-p)*(2/3-v)*6; return p; };
  return [Math.round(hue(h+1/3)*255), Math.round(hue(h)*255), Math.round(hue(h-1/3)*255)];
}
function toHex(r: number, g: number, b: number): string {
  return "#"+[r,g,b].map(v=>v.toString(16).padStart(2,"0")).join("");
}

export default defineTool({
  id: "color-convert",
  title: "Color Converter",
  titleDe: "Farb-Konverter",
  description: "Convert colors between HEX, RGB, HSL, HWB, and CSS named colors.",
  descriptionDe: "Farben zwischen HEX, RGB, HSL, HWB und CSS-Farbnamen konvertieren.",
  explanation: "Enter a color in any format: #ff6600, rgb(255,102,0), hsl(24,100%,50%). Shows all formats plus contrast ratio against white/black.",
  explanationDe: "Farbe in beliebigem Format eingeben: #ff6600, rgb(255,102,0), hsl(24,100%,50%). Zeigt alle Formate plus Kontrastverhältnis.",
  category: "Converter",
  keywords: ["color","farbe","hex","rgb","hsl","hwb","css","convert","konvertieren","palette"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "#1d6a73",
  example: "hsl(186, 58%, 28%)",
  useCasesDe: ["CSS-Farben umrechnen","Design-Tokens erstellen","Barrierefreiheit-Kontrast prüfen"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    let r=0,g=0,b=0;
    if (t.startsWith("#")) {
      [r,g,b] = hexToRgb(t);
    } else if (t.startsWith("rgb")) {
      const m = t.match(/(\d+),\s*(\d+),\s*(\d+)/);
      if (!m) throw new Error("Format: rgb(r, g, b)");
      [r,g,b] = [parseInt(m[1]),parseInt(m[2]),parseInt(m[3])];
    } else if (t.startsWith("hsl")) {
      const m = t.match(/([\d.]+)[,°\s]+([\d.]+)%?,\s*([\d.]+)%?/);
      if (!m) throw new Error("Format: hsl(h, s%, l%)");
      [r,g,b] = hslToRgb(parseFloat(m[1]),parseFloat(m[2]),parseFloat(m[3]));
    } else throw new Error("Erkannte Formate: #rrggbb, rgb(r,g,b), hsl(h,s%,l%)");
    const [h,s,l] = rgbToHsl(r,g,b);
    const [hw,ww,bkw] = rgbToHwb(r,g,b);
    const lum = (c: number) => { const v=c/255; return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4); };
    const relLum = 0.2126*lum(r)+0.7152*lum(g)+0.0722*lum(b);
    const contrastW = Math.round(((1.05)/(relLum+0.05))*10)/10;
    const contrastB = Math.round(((relLum+0.05)/0.05)*10)/10;
    return { output: [
      `HEX:       ${toHex(r,g,b).toUpperCase()}`,
      `RGB:       rgb(${r}, ${g}, ${b})`,
      `HSL:       hsl(${h}, ${s}%, ${l}%)`,
      `HWB:       hwb(${hw} ${ww}% ${bkw}%)`,
      ``,
      `Kontrast zu Weiß: ${contrastW}:1  ${contrastW>=4.5?"✓ WCAG AA":"✗"}`,
      `Kontrast zu Schwarz: ${contrastB}:1  ${contrastB>=4.5?"✓ WCAG AA":"✗"}`,
    ].join("\n") };
  },
});
