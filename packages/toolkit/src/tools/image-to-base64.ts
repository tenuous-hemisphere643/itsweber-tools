import { defineTool } from "../core";

export default defineTool({
  id: "image-to-base64",
  title: "Image ↔ Base64",
  titleDe: "Bild ↔ Base64",
  description: "Convert images to Base64 data URLs and back. Useful for embedding images in CSS or HTML.",
  descriptionDe: "Bilder zu Base64-Data-URLs konvertieren und zurück. Praktisch zum Einbetten in CSS oder HTML.",
  explanation: "Drag & drop an image to get its Base64 representation. Or paste a Data-URL / raw Base64 string with MIME type as text.",
  explanationDe: "Bild per Drag & Drop hochladen → Base64-Darstellung. Oder Data-URL bzw. MIME-Typ + Rohstring einfügen → Data-URL.",
  category: "Images and QR",
  keywords: ["base64","image","bild","data-url","encode","decode","embed","css","html","inline"],
  status: "ready",
  privacyMode: "local-only",
  inputMode: "image-drop",
  placeholder: "(Bild hochladen oder Data-URL einfügen)",
  example: "",
  useCasesDe: ["Bilder in CSS einbetten","HTML-Inline-Bilder","API-Payload mit Bildern"],
  run: (input) => {
    const trimmed = input.trim();

    if (trimmed.startsWith("data:image/")) {
      const parts = trimmed.split(",");
      if (parts.length !== 2) throw new Error("Ungültige Data-URL");
      const header = parts[0];
      const b64 = parts[1];
      const mime = header.match(/data:([^;]+)/)?.[1] ?? "unknown";
      const sizeKb = Math.round((b64.length * 3) / 4 / 1024);
      return { output: [
        `MIME-Typ: ${mime}`,
        `Größe: ~${sizeKb} KB (Base64-kodiert)`,
        `Header: ${header}`,
        ``,
        `Reiner Base64-String:`,
        b64,
      ].join("\n") };
    }

    const lines = trimmed.split("\n");
    const mimeMatch = lines[0].trim().match(/^(image\/[a-z0-9+.-]+)$/i);
    if (mimeMatch && lines.length > 1) {
      const mime = mimeMatch[1];
      const b64 = lines.slice(1).join("").replace(/\s/g, "");
      const ext = mime.split("/")[1] || "bin";
      const dataUrl = `data:${mime};base64,${b64}`;
      const sizeKb = Math.round((b64.length * 3) / 4 / 1024);
      return {
        output: [
          `MIME-Typ: ${mime}`,
          `Größe: ~${sizeKb} KB`,
          ``,
          `Data-URL (für HTML/CSS):`,
          dataUrl.slice(0, 200) + (dataUrl.length > 200 ? "…" : ""),
        ].join("\n"),
        downloadUrl: dataUrl,
        downloadName: `image.${ext}`,
      };
    }

    const b64only = trimmed.replace(/\s/g, "");
    if (/^[A-Za-z0-9+/]+=*$/.test(b64only)) {
      return { output: [
        `Raw Base64 erkannt (kein MIME-Typ).`,
        `Um eine Data-URL zu erstellen, füge in der ersten Zeile den MIME-Typ hinzu:`,
        ``,
        `  image/png`,
        `  ${b64only.slice(0, 60)}…`,
      ].join("\n") };
    }

    throw new Error("Unbekanntes Format. Erwartet: Data-URL oder MIME-Typ + Base64");
  },
});
