import { defineTool } from "../core";

export default defineTool({
  id: "placeholder-image",
  title: "Placeholder Image Generator",
  titleDe: "Platzhalter-Bild-Generator",
  description: "Generate custom placeholder images with configurable size, color, and text.",
  descriptionDe: "Benutzerdefinierte Platzhalter-Bilder mit konfigurierbarer Größe, Farbe und Text generieren.",
  explanation: "Format: width height bg-color text-color \"label\"\nExample: 800 400 #1a7a8a #ffffff \"Hero Banner\"\nOmit label to show dimensions automatically.",
  explanationDe: "Format: Breite Höhe Hintergrundfarbe Textfarbe \"Beschriftung\"\nBeispiel: 800 400 #1a7a8a #ffffff \"Hero Banner\"\nOhne Label werden Abmessungen angezeigt.",
  category: "Images and QR",
  keywords: ["placeholder","platzhalter","dummy","image","bild","mockup","wireframe","design","generate"],
  status: "ready",
  privacyMode: "browser-api",
  placeholder: "800 400",
  example: "800 400 #1a2b3c #ffffff \"Hero Image\"",
  useCasesDe: ["Wireframe-Mockups","Dummy-Bilder für Entwicklung","Layout-Tests"],
  run: async (input) => {
    const trimmed = input.trim();
    const labelMatch = trimmed.match(/"([^"]*)"/) ;
    const label = labelMatch?.[1] ?? null;
    const rest = trimmed.replace(/"[^"]*"/, "").trim();
    const parts = rest.split(/\s+/);

    const w = parseInt(parts[0] ?? "400");
    const h = parseInt(parts[1] ?? parts[0] ?? "300");
    const bg = parts[2] ?? "#cccccc";
    const fg = parts[3] ?? "#666666";

    if (isNaN(w) || isNaN(h) || w < 1 || h < 1 || w > 4000 || h > 4000) {
      throw new Error("Ungültige Größe (1–4000 px)");
    }

    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas nicht verfügbar")); return; }

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        const text = label ?? `${w} × ${h}`;
        const fontSize = Math.max(12, Math.min(w / 10, h / 5, 48));
        ctx.fillStyle = fg;
        ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, w / 2, h / 2);

        if (!label) {
          const subFont = Math.max(10, fontSize * 0.5);
          ctx.font = `${subFont}px system-ui, sans-serif`;
          ctx.fillStyle = fg + "99";
          ctx.fillText("placeholder", w / 2, h / 2 + fontSize * 0.9);
        }

        const dataUrl = canvas.toDataURL("image/png");
        resolve({
          output: [
            `Platzhalter generiert: ${w} × ${h} px`,
            `Hintergrund: ${bg}`,
            `Text: ${fg} — "${text}"`,
            ``,
            `→ Download-Button unten klicken`,
          ].join("\n"),
          downloadUrl: dataUrl,
          downloadName: `placeholder-${w}x${h}.png`,
        });
      } catch (err) {
        reject(err);
      }
    });
  },
});
