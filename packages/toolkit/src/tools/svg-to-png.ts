import { defineTool } from "../core";

export default defineTool({
  id: "svg-to-png",
  title: "SVG to PNG",
  titleDe: "SVG zu PNG",
  description: "Convert SVG code to a PNG image at any resolution. Runs in your browser.",
  descriptionDe: "SVG-Code in ein PNG-Bild in beliebiger Auflösung konvertieren. Läuft im Browser.",
  explanation: "First line: optional scale factor (e.g. 2 for 2x). Then paste SVG code.\nExample: 2\n<svg ...>...</svg>",
  explanationDe: "Erste Zeile: optionaler Skalierungsfaktor (z.B. 2 für 2x). Dann SVG-Code einfügen.\nBeispiel: 2\n<svg ...>...</svg>",
  category: "Images and QR",
  keywords: ["svg","png","convert","konvertieren","vector","vektor","export","rasterize","bild","image"],
  status: "ready",
  privacyMode: "browser-api",
  placeholder: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\">...</svg>",
  example: "2\n<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"><circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"#1a7a8a\"/></svg>",
  useCasesDe: ["SVG-Icons als PNG exportieren","Vektor zu Raster","Logo-Varianten erstellen"],
  run: async (input) => {
    const lines = input.trim().split("\n");
    let scale = 1;
    let svgStr = input.trim();

    const firstLine = lines[0].trim();
    if (/^\d+(\.\d+)?$/.test(firstLine) && !firstLine.startsWith("<")) {
      scale = parseFloat(firstLine);
      if (scale < 0.1 || scale > 10) throw new Error("Skalierung muss zwischen 0.1 und 10 liegen");
      svgStr = lines.slice(1).join("\n").trim();
    }

    if (!svgStr.toLowerCase().includes("<svg")) throw new Error("Kein SVG-Code gefunden");

    const wMatch = svgStr.match(/width=["']?(\d+(?:\.\d+)?)/i);
    const hMatch = svgStr.match(/height=["']?(\d+(?:\.\d+)?)/i);
    const vbMatch = svgStr.match(/viewBox=["']?([\d.\s-]+)/i);

    let svgW = wMatch ? parseFloat(wMatch[1]) : null;
    let svgH = hMatch ? parseFloat(hMatch[1]) : null;

    if (!svgW || !svgH) {
      if (vbMatch) {
        const vb = vbMatch[1].trim().split(/\s+/);
        svgW = parseFloat(vb[2] ?? "100");
        svgH = parseFloat(vb[3] ?? "100");
      } else {
        svgW = 100; svgH = 100;
      }
    }

    const canvasW = Math.round(svgW * scale);
    const canvasH = Math.round(svgH * scale);

    if (canvasW > 8000 || canvasH > 8000) throw new Error("Zu groß (max. 8000 px)");

    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = canvasW; canvas.height = canvasH;
        const ctx = canvas.getContext("2d");
        if (!ctx) { URL.revokeObjectURL(url); reject(new Error("Canvas nicht verfügbar")); return; }
        ctx.drawImage(img, 0, 0, canvasW, canvasH);
        URL.revokeObjectURL(url);
        const dataUrl = canvas.toDataURL("image/png");
        resolve({
          output: [
            `SVG → PNG konvertiert`,
            `SVG-Größe: ${svgW} × ${svgH}`,
            `PNG-Größe: ${canvasW} × ${canvasH} px (${scale}x)`,
            ``,
            `→ Download-Button unten klicken`,
          ].join("\n"),
          downloadUrl: dataUrl,
          downloadName: "exported.png",
        });
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("SVG konnte nicht gerendert werden")); };
      img.src = url;
    });
  },
});
