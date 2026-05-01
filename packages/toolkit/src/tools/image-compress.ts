import { defineTool } from "../core";

export default defineTool({
  id: "image-compress",
  title: "Image Compressor",
  titleDe: "Bild-Kompressor",
  description: "Compress JPEG/PNG/WebP images by adjusting quality. Runs entirely in your browser.",
  descriptionDe: "JPEG/PNG/WebP-Bilder durch Qualitätsanpassung komprimieren. Läuft vollständig im Browser.",
  explanation: "Drag & drop an image, then optionally specify quality (1-100) and output format in the params field. Example: quality=75 format=webp",
  explanationDe: "Bild per Drag & Drop hochladen, dann optional Qualität (1-100) und Ausgabeformat im Params-Feld angeben. Beispiel: quality=75 format=webp",
  category: "Images and QR",
  keywords: ["compress","komprimieren","image","bild","quality","qualität","png","jpg","webp","tinypng","squoosh"],
  status: "ready",
  privacyMode: "browser-api",
  inputMode: "image-drop",
  placeholder: "quality=80 format=jpeg",
  example: "quality=80 format=jpeg",
  useCasesDe: ["Web-Bilder optimieren","Dateigröße reduzieren","Ladezeit verbessern"],
  run: async (input) => {
    const lines = input.trim().split("\n");
    let quality = 80;
    let format = "webp";
    let dataUrl = "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("data:image/")) {
        dataUrl = trimmed;
      } else {
        const qMatch = trimmed.match(/quality=(\d+)/i);
        const fMatch = trimmed.match(/format=(png|jpeg|jpg|webp)/i);
        if (qMatch) quality = Math.min(100, Math.max(1, parseInt(qMatch[1])));
        if (fMatch) format = fMatch[1] === "jpg" ? "jpeg" : fMatch[1];
      }
    }

    if (!dataUrl) throw new Error("Bitte ein Bild per Drag & Drop hochladen.");

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas nicht verfügbar")); return; }
        ctx.drawImage(img, 0, 0);

        const mime = `image/${format}`;
        const compressed = canvas.toDataURL(mime, quality / 100);
        const origKb = Math.round((dataUrl.length * 3) / 4 / 1024);
        const newKb = Math.round((compressed.length * 3) / 4 / 1024);
        const saved = Math.round((1 - newKb / origKb) * 100);
        const ext = format === "jpeg" ? "jpg" : format;

        resolve({
          output: [
            `Komprimiert: ${format.toUpperCase()} @ ${quality}% Qualität`,
            `Original: ~${origKb} KB`,
            `Komprimiert: ~${newKb} KB`,
            `Einsparung: ${saved > 0 ? saved : 0}%`,
            `Abmessungen: ${img.naturalWidth} × ${img.naturalHeight} px`,
            ``,
            `→ Download-Button unten klicken`,
          ].join("\n"),
          downloadUrl: compressed,
          downloadName: `compressed.${ext}`,
        });
      };
      img.onerror = () => reject(new Error("Bild konnte nicht geladen werden"));
      img.src = dataUrl;
    });
  },
});
