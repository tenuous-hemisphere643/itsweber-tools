import { defineTool } from "../core";

export default defineTool({
  id: "image-convert",
  title: "Image Format Converter",
  titleDe: "Bild-Format-Konverter",
  description: "Convert images between PNG, JPEG, WebP, and AVIF formats directly in your browser.",
  descriptionDe: "Bilder zwischen PNG, JPEG, WebP und AVIF direkt im Browser konvertieren.",
  explanation: "Drag & drop an image, then specify format and quality in the params field.\nFormats: png, jpeg, webp, avif — Quality: 1–100 (for jpeg/webp)\nExample params: jpeg 90",
  explanationDe: "Bild per Drag & Drop hochladen, dann Format und Qualität im Params-Feld angeben.\nFormate: png, jpeg, webp, avif — Qualität: 1–100 (für jpeg/webp)\nBeispiel: jpeg 90",
  category: "Images and QR",
  keywords: ["image","convert","png","jpg","jpeg","webp","avif","format","konvertieren","bild"],
  status: "ready",
  privacyMode: "browser-api",
  inputMode: "image-drop",
  placeholder: "jpeg 90",
  example: "jpeg 90",
  useCasesDe: ["PNG zu JPEG konvertieren","Bild zu WebP","AVIF für Web optimieren"],
  run: async (input) => {
    const lines = input.trim().split("\n");
    const dataUrl = lines.find(l => l.trim().startsWith("data:image/"))?.trim() ?? "";
    if (!dataUrl) throw new Error("Kein Bild gefunden. Bitte ein Bild hochladen.");

    const paramLine = lines.find(l => !l.trim().startsWith("data:image/"))?.trim() ?? "";
    const parts = paramLine.toLowerCase().split(/\s+/);

    const formatAliases: Record<string, string> = { jpg: "jpeg", jpeg: "jpeg", png: "png", webp: "webp", avif: "avif" };
    const formatArg = parts.find(p => p in formatAliases);
    const qualityArg = parts.find(p => /^\d+$/.test(p));

    const format = formatAliases[formatArg ?? ""] ?? "webp";
    const quality = qualityArg ? Math.min(100, Math.max(1, parseInt(qualityArg))) / 100 : 0.85;
    const mime = `image/${format}`;
    const ext = format === "jpeg" ? "jpg" : format;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas nicht verfügbar")); return; }

        if (format === "jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);

        const result = canvas.toDataURL(mime, quality);
        const origKb = Math.round((dataUrl.length * 3) / 4 / 1024);
        const newKb = Math.round((result.length * 3) / 4 / 1024);

        resolve({
          output: [
            `Konvertiert zu: ${format.toUpperCase()} @ ${Math.round(quality * 100)}% Qualität`,
            `Abmessungen: ${img.naturalWidth} × ${img.naturalHeight} px`,
            `Original: ~${origKb} KB  →  Neu: ~${newKb} KB`,
            ``,
            `→ Download-Button unten klicken`,
          ].join("\n"),
          downloadUrl: result,
          downloadName: `converted.${ext}`,
        });
      };
      img.onerror = () => reject(new Error("Bild konnte nicht geladen werden"));
      img.src = dataUrl;
    });
  },
});
