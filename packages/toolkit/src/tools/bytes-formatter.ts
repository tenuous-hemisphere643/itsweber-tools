import { defineTool } from "../core";

const UNITS_SI  = ["B", "KB", "MB", "GB", "TB", "PB"];
const UNITS_IEC = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"];

function format(bytes: number, base: number, units: string[]): string {
  if (bytes < base) return `${bytes} ${units[0]}`;
  let i = 0;
  let val = bytes;
  while (val >= base && i < units.length - 1) { val /= base; i++; }
  return `${val.toFixed(2)} ${units[i]}`;
}

export default defineTool({
  id: "bytes-formatter",
  title: "Bytes / Size Formatter",
  titleDe: "Bytes / Größen-Formatter",
  description: "Format byte counts into human-readable sizes (SI and IEC).",
  descriptionDe: "Formatiert Byte-Angaben in lesbare Größen (SI und IEC/Binär).",
  explanation: "Converts raw byte numbers to KB/MB/GB (SI, base 1000) and KiB/MiB/GiB (IEC, base 1024). Useful for comparing storage metrics.",
  explanationDe: "Rechnet Bytes in KB/MB/GB (SI, Basis 1000) und KiB/MiB/GiB (IEC, Basis 1024) um. Wichtig beim Vergleich von Speicherangaben.",
  category: "Converter",
  keywords: ["bytes", "kb", "mb", "gb", "size", "storage", "speicher", "größe", "kib", "mib"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "1073741824",
  example: "1073741824",
  useCasesDe: ["Docker-Image-Größen einschätzen", "Backup-Volumen prüfen", "Speicherkapazitäten dokumentieren"],
  run: (input) => {
    const trimmed = input.trim().replace(/[_,]/g, "");
    const bytes = Number(trimmed);
    if (Number.isNaN(bytes) || bytes < 0) throw new Error("Enter a non-negative number of bytes.");
    return {
      output: [
        `SI  (÷1000):  ${format(bytes, 1000, UNITS_SI)}`,
        `IEC (÷1024):  ${format(bytes, 1024, UNITS_IEC)}`,
        `Bytes:        ${bytes.toLocaleString("en")} B`,
        `Bits:         ${(bytes * 8).toLocaleString("en")} bit`,
      ].join("\n"),
    };
  },
});
