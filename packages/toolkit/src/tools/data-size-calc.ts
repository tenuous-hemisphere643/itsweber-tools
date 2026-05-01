import { defineTool } from "../core";

export default defineTool({
  id: "data-size-calc",
  title: "Data Transfer Calculator",
  titleDe: "Datentransfer-Rechner",
  description: "Calculate transfer time for a file size at a given bandwidth.",
  descriptionDe: "Berechnet die Transferdauer für eine Dateigröße bei gegebener Bandbreite.",
  explanation: "Enter file size and bandwidth (e.g. '10 GB at 100 Mbit/s'). Calculates transfer time and shows throughput in multiple units.",
  explanationDe: "Dateigröße und Bandbreite eingeben (z.B. '10 GB bei 100 Mbit/s'). Berechnet Transferzeit und zeigt Durchsatz in mehreren Einheiten.",
  category: "Measurement",
  keywords: ["transfer","bandwidth","bandbreite","speed","geschwindigkeit","time","zeit","download","upload","throughput"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "10 GB at 100 Mbit/s",
  example: "10 GB at 100 Mbit/s",
  useCasesDe: ["Backup-Dauer schätzen","Netzwerk-Kapazität planen","Upload-Zeit für Docker-Images"],
  run: (input) => {
    const m = input.match(/^([\d.]+)\s*(B|KB|MB|GB|TB)\s+(?:at|bei)\s+([\d.]+)\s*(bit|kbit|mbit|gbit|kbps|mbps|gbps|kb\/s|mb\/s|gb\/s)/i);
    if (!m) throw new Error("Format: '10 GB at 100 Mbit/s' oder '500 MB bei 50 Mbit/s'");
    const sizeVal = parseFloat(m[1]);
    const sizeUnit = m[2].toUpperCase();
    const bwVal = parseFloat(m[3]);
    const bwUnit = m[4].toLowerCase();
    const sizeBytes: Record<string,number> = {B:1,KB:1e3,MB:1e6,GB:1e9,TB:1e12};
    const bwBits: Record<string,number> = {bit:1,kbit:1e3,mbit:1e6,gbit:1e9,kbps:1e3,mbps:1e6,gbps:1e9,"kb/s":8e3,"mb/s":8e6,"gb/s":8e9};
    const bytes = sizeVal * sizeBytes[sizeUnit];
    const bitsPerSec = bwVal * bwBits[bwUnit];
    const seconds = (bytes * 8) / bitsPerSec;
    const h = Math.floor(seconds/3600), min = Math.floor((seconds%3600)/60), s = Math.floor(seconds%60);
    return { output: [
      `Dateigröße:   ${sizeVal} ${sizeUnit}  (${bytes.toLocaleString("de")} Bytes)`,
      `Bandbreite:   ${bwVal} ${m[4]}`,
      ``,
      `Transferzeit: ${h>0?h+"h ":""}${min>0?min+"m ":""}${s}s`,
      `             (≈ ${seconds.toFixed(1)} Sekunden)`,
      ``,
      `Throughput:   ${(bytes/seconds/1e6).toFixed(2)} MB/s  ·  ${(bitsPerSec/1e6).toFixed(0)} Mbit/s`,
    ].join("\n") };
  },
});
