import { defineTool } from "../core";

export default defineTool({
  id: "image-resize",
  title: "Image Resizer",
  titleDe: "Bild-Größenänderung",
  description: "Resize images to specific dimensions or by percentage. Runs in your browser.",
  descriptionDe: "Bilder auf bestimmte Abmessungen oder prozentual skalieren. Läuft im Browser.",
  explanation: "Drag & drop an image, then in the params field enter target size: width height (or width% for percentage). Example: 800 600 or 50%",
  explanationDe: "Bild per Drag & Drop hochladen, dann im Params-Feld Zielgröße eingeben: Breite Höhe (oder Breite% für Prozent). Beispiel: 800 600 oder 50%",
  category: "Images and QR",
  keywords: ["resize","skalieren","scale","image","bild","width","height","prozent","pixel","dimensions"],
  status: "ready",
  privacyMode: "browser-api",
  inputMode: "image-drop",
  placeholder: "800 600",
  example: "200 200",
  useCasesDe: ["Bilder für Web skalieren","Thumbnails erstellen","Profilbilder anpassen"],
  run: async (input) => {
    const lines = input.trim().split("\n");
    const sizeLine = lines.find(l => !l.trim().startsWith("data:image/"))?.trim() ?? lines[0]?.trim() ?? "";
    const dataUrl = lines.find(l => l.trim().startsWith("data:image/"))?.trim() ?? "";
    if (!dataUrl) throw new Error("Kein Bild gefunden. Bitte ein Bild hochladen und optional Zielgröße im Params-Feld angeben (z.B. '800 600' oder '50%').");

    let targetW: number | null = null;
    let targetH: number | null = null;
    let percent: number | null = null;

    const pctMatch = sizeLine.match(/^(\d+(?:\.\d+)?)%$/);
    const dimMatch = sizeLine.match(/^(\d+)\s+(\d+)$/);
    const wMatch = sizeLine.match(/^(\d+)$/);

    if (pctMatch) percent = parseFloat(pctMatch[1]);
    else if (dimMatch) { targetW = parseInt(dimMatch[1]); targetH = parseInt(dimMatch[2]); }
    else if (wMatch) targetW = parseInt(wMatch[1]);
    else throw new Error("Ungültiges Format. Beispiel: '800 600' oder '50%'");

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const origW = img.naturalWidth;
        const origH = img.naturalHeight;
        let newW: number, newH: number;

        if (percent !== null) {
          newW = Math.round(origW * percent / 100);
          newH = Math.round(origH * percent / 100);
        } else if (targetW !== null && targetH !== null) {
          newW = targetW; newH = targetH;
        } else if (targetW !== null) {
          newW = targetW; newH = Math.round(origH * targetW / origW);
        } else {
          reject(new Error("Größe konnte nicht berechnet werden")); return;
        }

        if (newW < 1 || newH < 1 || newW > 8000 || newH > 8000) {
          reject(new Error("Ungültige Zielgröße (1–8000 px)")); return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = newW; canvas.height = newH;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas nicht verfügbar")); return; }
        ctx.drawImage(img, 0, 0, newW, newH);

        const origMime = dataUrl.split(";")[0].replace("data:", "") || "image/png";
        const result = canvas.toDataURL(origMime, 0.9);
        const ext = origMime.includes("jpeg") ? "jpg" : origMime.split("/")[1] || "png";

        resolve({
          output: [
            `Original: ${origW} × ${origH} px`,
            `Neu:      ${newW} × ${newH} px`,
            `Skalierung: ${Math.round(newW/origW*100)}%`,
            ``,
            `→ Download-Button unten klicken`,
          ].join("\n"),
          downloadUrl: result,
          downloadName: `resized.${ext}`,
        });
      };
      img.onerror = () => reject(new Error("Bild konnte nicht geladen werden"));
      img.src = dataUrl;
    });
  },
});
