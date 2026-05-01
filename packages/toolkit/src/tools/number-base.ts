import { defineTool } from "../core";

export default defineTool({
  id: "number-base",
  title: "Number Base Converter",
  titleDe: "Zahlensystem-Konverter",
  description: "Convert numbers between binary, octal, decimal, and hexadecimal.",
  descriptionDe: "Konvertiert Zahlen zwischen Binär, Oktal, Dezimal und Hexadezimal.",
  explanation: "Converts integers between base 2 (binary), base 8 (octal), base 10 (decimal), and base 16 (hex). Prefix detection: 0b for binary, 0o for octal, 0x for hex.",
  explanationDe: "Rechnet ganzzahlige Werte zwischen Basis 2, 8, 10 und 16 um. Präfix-Erkennung: 0b = Binär, 0o = Oktal, 0x = Hex.",
  category: "Converter",
  keywords: ["binary", "octal", "hex", "decimal", "base", "binär", "oktal", "hexadezimal", "dezimal", "0b", "0x"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "255  or  0xFF  or  0b11111111",
  example: "255",
  useCasesDe: ["Bitmasken lesen", "Chmod-Werte umrechnen", "Protokoll-Dumps verstehen"],
  run: (input) => {
    const trimmed = input.trim().toLowerCase();
    let num: number;
    if (trimmed.startsWith("0b")) num = parseInt(trimmed.slice(2), 2);
    else if (trimmed.startsWith("0o")) num = parseInt(trimmed.slice(2), 8);
    else if (trimmed.startsWith("0x")) num = parseInt(trimmed.slice(2), 16);
    else num = parseInt(trimmed, 10);
    if (Number.isNaN(num)) throw new Error("Could not parse the input. Use 255, 0xFF, 0b11111111, or 0o377.");
    return {
      output: [
        `DEC (10):  ${num}`,
        `HEX (16):  0x${num.toString(16).toUpperCase()}`,
        `OCT  (8):  0o${num.toString(8)}`,
        `BIN  (2):  0b${num.toString(2)}`,
        `BIN grouped: ${num.toString(2).padStart(Math.ceil(num.toString(2).length / 4) * 4, "0").replace(/.{4}/g, "$& ").trim()}`,
      ].join("\n"),
      rawOutput: String(num),
    };
  },
});
