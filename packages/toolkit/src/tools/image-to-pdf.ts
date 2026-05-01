import { defineTool } from "../core";

export default defineTool({
  id: "image-to-pdf",
  title: "Image to PDF",
  titleDe: "Bild zu PDF",
  description: "Convert PNG, JPEG, or WebP images to a PDF file. Runs entirely in your browser using jsPDF.",
  descriptionDe: "PNG-, JPEG- oder WebP-Bilder in eine PDF-Datei konvertieren. Läuft vollständig im Browser mit jsPDF.",
  explanation: "Drag & drop an image. Optionally specify orientation in the params field: portrait or landscape.",
  explanationDe: "Bild per Drag & Drop hochladen. Optional Ausrichtung im Params-Feld angeben: portrait oder landscape.",
  category: "Images and QR",
  keywords: ["pdf","image","bild","png","jpeg","convert","konvertieren","download","jspdf","dokument"],
  status: "ready",
  privacyMode: "browser-api",
  inputMode: "image-drop",
  placeholder: "portrait",
  example: "portrait",
  useCasesDe: ["Bild als PDF speichern","Screenshot zu Dokument","Fotos archivieren"],
  run: async (input) => {
    const lines = input.trim().split("\n");
    const orientLine = lines.find(l => /^(portrait|landscape)$/i.test(l.trim()));
    const orientation = (orientLine?.trim().toLowerCase() === "landscape") ? "landscape" : "portrait";
    const dataUrl = lines.find(l => l.trim().startsWith("data:image/"))?.trim() ?? "";
    if (!dataUrl) throw new Error("Kein Bild gefunden. Bitte ein Bild per Drag & Drop hochladen.");

    const mimeMatch = dataUrl.match(/^data:([^;]+);base64,/);
    const mime = mimeMatch?.[1] ?? "image/png";
    const supportedMimes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!supportedMimes.some(m => mime.startsWith(m.split("/")[1] ?? "") || mime === m)) {
      // allow through, jsPDF handles it
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const { jsPDF } = await import("jspdf");
          const w = img.naturalWidth;
          const h = img.naturalHeight;

          const pdfW = orientation === "landscape" ? 297 : 210;
          const pdfH = orientation === "landscape" ? 210 : 297;

          const ratio = Math.min(pdfW / w, pdfH / h);
          const imgW = w * ratio;
          const imgH = h * ratio;
          const x = (pdfW - imgW) / 2;
          const y = (pdfH - imgH) / 2;

          const imgFormat = mime.includes("jpeg") || mime.includes("jpg") ? "JPEG" : "PNG";
          const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });
          doc.addImage(dataUrl, imgFormat, x, y, imgW, imgH);

          const pdfDataUri = doc.output("datauristring");

          resolve({
            output: [
              `PDF erstellt (A4, ${orientation})`,
              `Bildgröße: ${w} × ${h} px`,
              `Skaliert auf: ${imgW.toFixed(1)} × ${imgH.toFixed(1)} mm`,
              ``,
              `→ Download-Button unten klicken`,
            ].join("\n"),
            downloadUrl: pdfDataUri,
            downloadName: "image.pdf",
          });
        } catch (err) {
          reject(new Error(`PDF-Fehler: ${err instanceof Error ? err.message : String(err)}`));
        }
      };
      img.onerror = () => reject(new Error("Bild konnte nicht geladen werden"));
      img.src = dataUrl;
    });
  },
});
