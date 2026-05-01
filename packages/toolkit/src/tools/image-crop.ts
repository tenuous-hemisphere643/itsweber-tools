import { defineTool } from "../core";

export default defineTool({
  id: "image-crop",
  title: "Image Cropper",
  titleDe: "Bild-Zuschneiden",
  description: "Crop an image to specific coordinates or preset aspect ratios. Runs in your browser.",
  descriptionDe: "Bild auf bestimmte Koordinaten oder voreingestellte Seitenverhältnisse zuschneiden. Läuft im Browser.",
  explanation: "Drag & drop an image, then enter in the params field: x y width height (pixel coordinates) OR a ratio like 16:9 / 1:1 / 4:3.",
  explanationDe: "Bild per Drag & Drop hochladen, dann im Params-Feld eingeben: x y Breite Höhe (Pixel) ODER Verhältnis wie 16:9 / 1:1 / 4:3.",
  category: "Images and QR",
  keywords: ["crop","zuschneiden","trim","cut","aspect-ratio","image","bild","square","16:9","1:1"],
  status: "ready",
  privacyMode: "browser-api",
  inputMode: "image-drop",
  placeholder: "16:9",
  example: "1:1",
  useCasesDe: ["Social-Media-Formate","Profilbilder zuschneiden","Banner erstellen"],
  run: async (input) => {
    const lines = input.trim().split("\n");
    const paramLine = lines[0].trim();
    const dataUrl = lines.find(l => l.trim().startsWith("data:image/"))?.trim() ?? "";
    if (!dataUrl) throw new Error("Keine Data-URL gefunden");

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const iw = img.naturalWidth, ih = img.naturalHeight;
        let cx = 0, cy = 0, cw = iw, ch = ih;

        const ratioMatch = paramLine.match(/^(\d+):(\d+)$/);
        const coordMatch = paramLine.match(/^(\d+)\s+(\d+)\s+(\d+)\s+(\d+)$/);

        if (ratioMatch) {
          const rw = parseInt(ratioMatch[1]!), rh = parseInt(ratioMatch[2]!);
          const targetRatio = rw / rh;
          const currentRatio = iw / ih;
          if (targetRatio > currentRatio) {
            cw = iw; ch = Math.round(iw / targetRatio);
            cy = Math.round((ih - ch) / 2);
          } else {
            ch = ih; cw = Math.round(ih * targetRatio);
            cx = Math.round((iw - cw) / 2);
          }
        } else if (coordMatch) {
          cx = parseInt(coordMatch[1]!); cy = parseInt(coordMatch[2]!);
          cw = parseInt(coordMatch[3]!); ch = parseInt(coordMatch[4]!);
        } else {
          reject(new Error("Format: '16:9' oder 'x y width height'")); return;
        }

        if (cx < 0 || cy < 0 || cx + cw > iw || cy + ch > ih) {
          reject(new Error(`Koordinaten außerhalb des Bildes (${iw}×${ih})`)); return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = cw; canvas.height = ch;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas nicht verfügbar")); return; }
        ctx.drawImage(img, cx, cy, cw, ch, 0, 0, cw, ch);

        const origMime = dataUrl.split(";")[0]?.replace("data:", "") || "image/png";
        const result = canvas.toDataURL(origMime, 0.92);
        const ext = origMime.includes("jpeg") ? "jpg" : "png";

        resolve({
          output: [
            `Zugeschnitten: ${cw} × ${ch} px`,
            `Position: x=${cx}, y=${cy}`,
            `Original: ${iw} × ${ih} px`,
            ``,
            `→ Download-Button unten klicken`,
          ].join("\n"),
          downloadUrl: result,
          downloadName: `cropped.${ext}`,
        });
      };
      img.onerror = () => reject(new Error("Bild konnte nicht geladen werden"));
      img.src = dataUrl;
    });
  },
});
