import { defineTool } from "../core";

export default defineTool({
  id: "image-flip-rotate",
  title: "Image Flip & Rotate",
  titleDe: "Bild Spiegeln & Drehen",
  description: "Flip or rotate images horizontally, vertically, or by degree. Runs in your browser.",
  descriptionDe: "Bilder horizontal, vertikal spiegeln oder um Grad drehen. Läuft im Browser.",
  explanation: "Drag & drop an image, then in the params field enter operation: fliph, flipv, rotate90, rotate180, rotate270.",
  explanationDe: "Bild per Drag & Drop hochladen, dann im Params-Feld Operation eingeben: fliph, flipv, rotate90, rotate180, rotate270.",
  category: "Images and QR",
  keywords: ["flip","rotate","drehen","spiegeln","mirror","horizontal","vertical","image","bild","transform"],
  status: "ready",
  privacyMode: "browser-api",
  inputMode: "image-drop",
  placeholder: "rotate90",
  example: "fliph",
  useCasesDe: ["Foto-Orientierung korrigieren","Spiegelbilder erstellen","Bilder transformieren"],
  run: async (input) => {
    const lines = input.trim().split("\n");
    const op = lines[0].trim().toLowerCase();
    const dataUrl = lines.find(l => l.trim().startsWith("data:image/"))?.trim() ?? "";
    if (!dataUrl) throw new Error("Keine Data-URL gefunden");

    const validOps = ["fliph", "flipv", "rotate90", "rotate180", "rotate270"];
    if (!validOps.includes(op)) throw new Error(`Operation muss sein: ${validOps.join(", ")}`);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const iw = img.naturalWidth, ih = img.naturalHeight;
        const isRotate90or270 = op === "rotate90" || op === "rotate270";
        const cw = isRotate90or270 ? ih : iw;
        const ch = isRotate90or270 ? iw : ih;

        const canvas = document.createElement("canvas");
        canvas.width = cw; canvas.height = ch;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas nicht verfügbar")); return; }

        ctx.save();
        if (op === "fliph") {
          ctx.translate(cw, 0); ctx.scale(-1, 1);
        } else if (op === "flipv") {
          ctx.translate(0, ch); ctx.scale(1, -1);
        } else if (op === "rotate90") {
          ctx.translate(cw, 0); ctx.rotate(Math.PI / 2);
        } else if (op === "rotate180") {
          ctx.translate(cw, ch); ctx.rotate(Math.PI);
        } else if (op === "rotate270") {
          ctx.translate(0, ch); ctx.rotate(-Math.PI / 2);
        }
        ctx.drawImage(img, 0, 0);
        ctx.restore();

        const origMime = dataUrl.split(";")[0]?.replace("data:", "") || "image/png";
        const result = canvas.toDataURL(origMime, 0.92);
        const ext = origMime.includes("jpeg") ? "jpg" : "png";
        const opLabels: Record<string,string> = { fliph:"Horizontal gespiegelt", flipv:"Vertikal gespiegelt", rotate90:"90° gedreht", rotate180:"180° gedreht", rotate270:"270° gedreht" };

        resolve({
          output: [
            `${opLabels[op]}`,
            `Original: ${iw} × ${ih} px`,
            `Ergebnis: ${cw} × ${ch} px`,
            ``,
            `→ Download-Button unten klicken`,
          ].join("\n"),
          downloadUrl: result,
          downloadName: `${op}.${ext}`,
        });
      };
      img.onerror = () => reject(new Error("Bild konnte nicht geladen werden"));
      img.src = dataUrl;
    });
  },
});
