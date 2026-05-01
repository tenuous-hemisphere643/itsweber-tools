import { defineTool } from "../core";

export default defineTool({
  id: "favicon-gen",
  title: "Favicon Generator",
  titleDe: "Favicon-Generator",
  description: "Generate HTML link tags for favicons in all required sizes from an uploaded image.",
  descriptionDe: "HTML-Link-Tags für Favicons in allen benötigten Größen aus einem hochgeladenen Bild generieren.",
  explanation: "Drag & drop a square PNG image to get ready-to-use HTML link tags for all favicon sizes.",
  explanationDe: "Quadratisches PNG-Bild per Drag & Drop hochladen → HTML-Link-Tags für alle Favicon-Größen.",
  category: "Images and QR",
  keywords: ["favicon","icon","html","link","tag","png","apple-touch","manifest","browser","tab"],
  status: "ready",
  privacyMode: "browser-api",
  inputMode: "image-drop",
  placeholder: "(Bild hochladen)",
  example: "(Bild hochladen)",
  useCasesDe: ["Favicon für Website erstellen","Apple Touch Icon","PWA-Manifest-Icons"],
  run: async (input) => {
    const trimmed = input.trim();
    if (!trimmed.startsWith("data:image/")) throw new Error("Erwartet: data:image/...");

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const sizes = [16, 32, 48, 64, 96, 128, 180, 192, 256, 512];
        const resized: Record<number, string> = {};

        for (const size of sizes) {
          const canvas = document.createElement("canvas");
          canvas.width = size; canvas.height = size;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, size, size);
            resized[size] = canvas.toDataURL("image/png");
          }
        }

        const html = [
          `<!-- Favicon HTML Tags -->`,
          `<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">`,
          `<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">`,
          `<link rel="icon" type="image/png" sizes="48x48" href="favicon-48x48.png">`,
          `<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">`,
          `<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">`,
          `<link rel="icon" type="image/png" sizes="512x512" href="icon-512.png">`,
          ``,
          `<!-- Web App Manifest (manifest.json): -->`,
          `{`,
          `  "icons": [`,
          `    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png" },`,
          `    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png" }`,
          `  ]`,
          `}`,
          ``,
          `Generierte Größen: ${sizes.join(", ")} px`,
          `→ Download-Button: 32×32 Favicon`,
        ].join("\n");

        resolve({
          output: html,
          downloadUrl: resized[32],
          downloadName: "favicon-32x32.png",
        });
      };
      img.onerror = () => reject(new Error("Bild konnte nicht geladen werden"));
      img.src = trimmed;
    });
  },
});
