import { defineTool } from "../core";

export default defineTool({
  id: "image-color-picker",
  title: "Image Color Extractor",
  titleDe: "Bild-Farben-Extraktor",
  description: "Extract the dominant color palette from any image. Runs entirely in your browser.",
  descriptionDe: "Die dominante Farbpalette aus einem beliebigen Bild extrahieren. Läuft vollständig im Browser.",
  explanation: "Drag & drop an image. Optionally specify number of colors in the params field (default: 8). Example: 6",
  explanationDe: "Bild per Drag & Drop hochladen. Optional Anzahl Farben im Params-Feld angeben (Standard: 8). Beispiel: 6",
  category: "Images and QR",
  keywords: ["color","farbe","palette","extract","dominant","image","bild","hex","rgb","eyedropper","design"],
  status: "ready",
  privacyMode: "browser-api",
  inputMode: "image-drop",
  placeholder: "6",
  example: "6",
  useCasesDe: ["Markenfarben aus Logo extrahieren","Farbpalette für Design","Dominant-Farbe ermitteln"],
  run: async (input) => {
    const lines = input.trim().split("\n");
    const countLine = lines.find(l => /^\d+$/.test(l.trim()));
    const count = countLine ? Math.min(20, Math.max(1, parseInt(countLine))) : 8;
    const dataUrl = lines.find(l => l.trim().startsWith("data:image/"))?.trim() ?? "";
    if (!dataUrl) throw new Error("Keine Data-URL gefunden");

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 100;
        const scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.max(1, Math.round(img.naturalWidth * scale));
        const h = Math.max(1, Math.round(img.naturalHeight * scale));

        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas nicht verfügbar")); return; }
        ctx.drawImage(img, 0, 0, w, h);

        const data = ctx.getImageData(0, 0, w, h).data;
        const buckets: Record<string, number> = {};
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3]! < 128) continue; // skip transparent
          const r = Math.round((data[i]!) / 32) * 32;
          const g = Math.round((data[i + 1]!) / 32) * 32;
          const b = Math.round((data[i + 2]!) / 32) * 32;
          const key = `${r},${g},${b}`;
          buckets[key] = (buckets[key] ?? 0) + 1;
        }

        const sorted = Object.entries(buckets)
          .sort((a, b) => b[1] - a[1])
          .slice(0, count);

        const toHex = (n: number) => n.toString(16).padStart(2, "0");
        const lines = sorted.map(([rgb, cnt], i) => {
          const [r, g, b] = rgb.split(",").map(Number);
          const hex = `#${toHex(r!)}${toHex(g!)}${toHex(b!)}`;
          const pct = Math.round(cnt / (w * h) * 100);
          const bar = "█".repeat(Math.round(pct / 2));
          return `${String(i+1).padStart(2)}. ${hex}  ${String(pct).padStart(3)}%  ${bar}`;
        });

        resolve({ output: [
          `Dominante Farben (${count}) — ${w}×${h}px Sample:`,
          ``,
          ...lines,
          ``,
          `CSS-Variablen:`,
          sorted.map(([rgb], i) => {
            const [r, g, b] = rgb.split(",").map(Number);
            return `  --color-${i+1}: #${toHex(r!)}${toHex(g!)}${toHex(b!)};`;
          }).join("\n"),
        ].join("\n") });
      };
      img.onerror = () => reject(new Error("Bild konnte nicht geladen werden"));
      img.src = dataUrl;
    });
  },
});
