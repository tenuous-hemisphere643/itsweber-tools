import { defineTool } from "../core";

export default defineTool({
  id: "image-metadata",
  title: "Image Metadata Reader",
  titleDe: "Bild-Metadaten-Leser",
  description: "Read image dimensions, file size, MIME type, aspect ratio, and megapixels from an uploaded image.",
  descriptionDe: "Bild-Abmessungen, Dateigröße, MIME-Typ, Seitenverhältnis und Megapixel aus einem hochgeladenen Bild auslesen.",
  explanation: "Drag & drop an image to see all metadata.",
  explanationDe: "Bild per Drag & Drop hochladen → alle Metadaten anzeigen.",
  category: "Images and QR",
  keywords: ["metadata","metadaten","image","bild","dimensions","abmessungen","filesize","exif","info","analyse"],
  status: "ready",
  privacyMode: "browser-api",
  inputMode: "image-drop",
  placeholder: "(Bild hochladen)",
  example: "(Bild hochladen)",
  useCasesDe: ["Bild-Dimensionen prüfen","Dateigröße vor Upload","Seitenverhältnis berechnen"],
  run: async (input) => {
    const trimmed = input.trim();
    if (!trimmed.startsWith("data:image/")) throw new Error("Erwartet: data:image/...");

    const mimeMatch = trimmed.match(/^data:([^;]+);base64,/);
    const mime = mimeMatch?.[1] ?? "unknown";
    const b64 = trimmed.split(",")[1] ?? "";
    const sizeBytes = Math.round((b64.length * 3) / 4);
    const sizeKb = (sizeBytes / 1024).toFixed(1);
    const sizeMb = (sizeBytes / 1024 / 1024).toFixed(2);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
        const g = gcd(w, h);
        const ratio = `${w/g}:${h/g}`;
        const mp = ((w * h) / 1_000_000).toFixed(2);
        const ext = mime.split("/")[1]?.toUpperCase() ?? "?";
        const orientation = w > h ? "Landscape" : w < h ? "Portrait" : "Square";

        resolve({ output: [
          `Format:        ${ext} (${mime})`,
          `Breite:        ${w} px`,
          `Höhe:          ${h} px`,
          `Seitenverhältnis: ${ratio}`,
          `Megapixel:     ${mp} MP`,
          `Orientierung:  ${orientation}`,
          `Dateigröße:    ${sizeKb} KB (${sizeMb} MB)`,
          `Base64-Länge:  ${b64.length} Zeichen`,
        ].join("\n") });
      };
      img.onerror = () => reject(new Error("Bild konnte nicht geladen werden"));
      img.src = trimmed;
    });
  },
});
