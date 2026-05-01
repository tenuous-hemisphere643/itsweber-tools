import { defineTool } from "../core";

// Pure JS EAN-13 and Code-128 barcode generator (no external dependency)
function calcEan13Check(digits: string): number {
  const d = digits.slice(0, 12).split("").map(Number);
  const sum = d.reduce((acc, v, i) => acc + v * (i % 2 === 0 ? 1 : 3), 0);
  return (10 - (sum % 10)) % 10;
}

function drawBarcode(bars: string, canvas: HTMLCanvasElement, text: string) {
  const W = 2, H = 80, PAD = 10;
  canvas.width = bars.length * W + PAD * 2;
  canvas.height = H + 30;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000000";
  for (let i = 0; i < bars.length; i++) {
    if (bars[i] === "1") ctx.fillRect(PAD + i * W, 5, W, H);
  }
  ctx.font = "13px monospace";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, H + 22);
}

// EAN-13 encoding tables
const EAN13_L: Record<string, string> = {
  "0":"0001101","1":"0011001","2":"0010011","3":"0111101","4":"0100011",
  "5":"0110001","6":"0101111","7":"0111011","8":"0110111","9":"0001011",
};
const EAN13_G: Record<string, string> = {
  "0":"0100111","1":"0110011","2":"0011011","3":"0100001","4":"0011101",
  "5":"0111001","6":"0000101","7":"0010001","8":"0001001","9":"0010111",
};
const EAN13_R: Record<string, string> = {
  "0":"1110010","1":"1100110","2":"1101100","3":"1000010","4":"1011100",
  "5":"1001110","6":"1010000","7":"1000100","8":"1001000","9":"1110100",
};
const EAN13_PARITY = ["LLLLLL","LLGLGG","LLGGLG","LLGGGL","LGLLGG","LGGLLG","LGGGLL","LGLGLG","LGLGGL","LGGLGL"];

function encodeEan13(digits: string): string {
  const first = digits[0]!;
  const parity = EAN13_PARITY[parseInt(first)]!;
  let bars = "101";
  for (let i = 1; i <= 6; i++) {
    const d = digits[i]!;
    bars += parity[i-1] === "L" ? EAN13_L[d]! : EAN13_G[d]!;
  }
  bars += "01010";
  for (let i = 7; i <= 12; i++) bars += EAN13_R[digits[i]!]!;
  bars += "101";
  return bars;
}

// Code-128B encoding (printable ASCII 32–127)
const CODE128_TABLE: string[] = [
  "11011001100","11001101100","11001100110","10010011000","10010001100","10001001100",
  "10011001000","10011000100","10001100100","11001001000","11001000100","11000100100",
  "10110011100","10011011100","10011001110","10111001100","10011101100","10011100110",
  "11001110010","11001011100","11001001110","11011100100","11001110100","11101101110",
  "11101001100","11100101100","11100100110","11101100100","11100110100","11100110010",
  "11011011000","11011000110","11000110110","10100011000","10001011000","10001000110",
  "10110001000","10001101000","10001100010","11010001000","11000101000","11000100010",
  "10110111000","10110001110","10001101110","10111011000","10111000110","10001110110",
  "11101110110","11010001110","11000101110","11011101000","11011100010","11011101110",
  "11101011000","11101000110","11100010110","11101101000","11101100010","11100011010",
  "11101111010","11001000010","11110001010","10100110000","10100001100","10010110000",
  "10010000110","10000101100","10000100110","10110010000","10110000100","10011010000",
  "10011000010","10000110100","10000110010","11000010010","11001010000","11110111010",
  "11000010100","10001111010","10100111100","10010111100","10010011110","10111100100",
  "10011110100","10011110010","11110100100","11110010100","11110010010","11011011110",
  "11011110110","11110110110","10101111000","10100011110","10001011110","10111101000",
  "10111100010","11110101000","11110100010","10111011110","10111101110","11101011110",
  "11110101110","11010000100","11010010000","11010011100","1100011101011",
];

function encodeCode128(text: string): string {
  // Start B = index 104
  const startB = 104;
  let checksum = startB;
  let bars = CODE128_TABLE[startB]!;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i) - 32;
    if (code < 0 || code > 94) throw new Error(`Ungültiges Zeichen: '${text[i]}'`);
    checksum += code * (i + 1);
    bars += CODE128_TABLE[code]!;
  }
  bars += CODE128_TABLE[checksum % 103]!;
  bars += "1100011101011"; // Stop
  return bars;
}

export default defineTool({
  id: "barcode-gen",
  title: "Barcode Generator",
  titleDe: "Barcode-Generator",
  description: "Generate EAN-13 or Code-128 barcodes as downloadable PNG images. No external service needed.",
  descriptionDe: "EAN-13- oder Code-128-Barcodes als herunterladbare PNG-Bilder generieren. Kein externer Dienst nötig.",
  explanation: "Format: type value\nEAN-13: ean13 401234567890 (12 digits, check digit auto-calculated)\nCode-128: code128 Hello-World",
  explanationDe: "Format: Typ Wert\nEAN-13: ean13 401234567890 (12 Ziffern, Prüfziffer automatisch)\nCode-128: code128 Hello-World",
  category: "Images and QR",
  keywords: ["barcode","ean13","code128","scan","generate","label","produkt","retail","logistik"],
  status: "ready",
  privacyMode: "browser-api",
  placeholder: "ean13 401234567890",
  example: "ean13 401234567890",
  useCasesDe: ["Produktbarcodes erstellen","Versandetiketten","Lagerverwaltung"],
  run: async (input) => {
    const parts = input.trim().split(/\s+/);
    const type = parts[0]?.toLowerCase();
    const value = parts.slice(1).join(" ");

    if (!type || !value) throw new Error("Format: ean13 <12Ziffern> oder code128 <Text>");

    let bars: string;
    let displayText: string;

    if (type === "ean13") {
      const digits = value.replace(/\D/g, "").slice(0, 12).padEnd(12, "0");
      const check = calcEan13Check(digits);
      const full = digits + check;
      bars = encodeEan13(full);
      displayText = full;
    } else if (type === "code128") {
      bars = encodeCode128(value);
      displayText = value;
    } else {
      throw new Error("Typ muss 'ean13' oder 'code128' sein");
    }

    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement("canvas");
        drawBarcode(bars, canvas, displayText);
        const dataUrl = canvas.toDataURL("image/png");
        resolve({
          output: [
            `${type.toUpperCase()} Barcode generiert`,
            `Wert: ${displayText}`,
            `Balken: ${bars.length}`,
            ``,
            `→ Download-Button unten klicken`,
          ].join("\n"),
          downloadUrl: dataUrl,
          downloadName: `barcode-${type}-${displayText.replace(/[^a-z0-9]/gi, "_")}.png`,
        });
      } catch (err) {
        reject(err);
      }
    });
  },
});
