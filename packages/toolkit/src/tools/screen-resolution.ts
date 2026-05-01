import { defineTool } from "../core";

const RESOLUTIONS: [string,number,number,string][] = [
  ["720p HD",1280,720,"TV, ältere Monitore"],
  ["1080p Full HD",1920,1080,"Standard-Monitor"],
  ["1440p QHD",2560,1440,"Gaming, hohe Dichte"],
  ["4K UHD",3840,2160,"Profi-Monitor, TV"],
  ["8K UHD",7680,4320,"High-End"],
  ["1366×768",1366,768,"Laptop (verbreitet)"],
  ["1536×864",1536,864,"Laptop 15\""],
  ["1920×1200",1920,1200,"16:10 Monitor"],
  ["2560×1080",2560,1080,"Ultrawide 21:9"],
  ["3440×1440",3440,1440,"Ultrawide QHD"],
  ["iPhone SE",375,667,"iOS klein"],
  ["iPhone 14 Pro",393,852,"iOS Standard 2023"],
  ["iPhone Plus",430,932,"iOS groß"],
  ["Pixel 7",412,915,"Android"],
  ["iPad Air",820,1180,"Tablet"],
  ["iPad Pro 12.9",1024,1366,"Tablet groß"],
  ["MacBook Air 13",1280,800,"Retina ×2 = 2560×1600"],
  ["MacBook Pro 14",1512,982,"Retina ×2"],
  ["MacBook Pro 16",1728,1117,"Retina ×2"],
];

export default defineTool({
  id: "screen-resolution",
  title: "Screen Resolution Info",
  titleDe: "Bildschirmauflösungs-Info",
  description: "Look up common screen resolutions, pixel densities, and aspect ratios.",
  descriptionDe: "Gängige Bildschirmauflösungen, Pixeldichten und Seitenverhältnisse nachschlagen.",
  explanation: "Enter a resolution (e.g. '1920x1080') or a name (e.g. '4k', 'iphone', 'retina'). Or 'all' for list.",
  explanationDe: "Auflösung eingeben (z.B. '1920x1080') oder Name (z.B. '4k', 'iphone'). Oder 'all' für Liste.",
  category: "Measurement",
  keywords: ["resolution","auflösung","screen","display","pixel","dpi","responsive","viewport","device"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "1920x1080",
  example: "iphone",
  useCasesDe: ["Responsive Design testen","Media Queries schreiben","Device-Mockups erstellen"],
  run: (input) => {
    const t = input.trim().toLowerCase().replace(/\s+/g,"");
    if (t==="all") return { output: RESOLUTIONS.map(([n,w,h,d])=>`${n.padEnd(22)}  ${String(w).padStart(4)}×${String(h).padEnd(5)}  ${d}`).join("\n") };
    const m = t.match(/^(\d+)[x×](\d+)$/);
    if (m) {
      const w=parseInt(m[1]), h=parseInt(m[2]);
      const gcd = (a:number,b:number): number => b===0?a:gcd(b,a%b);
      const g = gcd(w,h); const ratio = `${w/g}:${h/g}`;
      const pixels = w*h;
      const nearest = RESOLUTIONS.map(([n,rw,rh])=>({n,dist:Math.abs(rw-w)+Math.abs(rh-h)})).sort((a,b)=>a.dist-b.dist)[0];
      return { output: [
        `${w}×${h}`,
        `Pixel gesamt:  ${pixels.toLocaleString("de-DE")}`,
        `Seitenverhältnis: ${ratio}`,
        `Megapixel:     ${(pixels/1e6).toFixed(2)} MP`,
        ``,
        `Ähnlichste bekannte Auflösung: ${nearest.n}`,
      ].join("\n") };
    }
    const matches = RESOLUTIONS.filter(([n])=>n.toLowerCase().includes(t));
    if (!matches.length) throw new Error(`Keine Auflösung für '${input}' gefunden. 'all' für Liste.`);
    return { output: matches.map(([n,w,h,d])=>`${n}\n  ${w}×${h}  –  ${d}`).join("\n\n") };
  },
});
