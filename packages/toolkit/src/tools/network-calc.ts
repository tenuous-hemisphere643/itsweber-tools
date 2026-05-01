import { defineTool } from "../core";

export default defineTool({
  id: "network-calc",
  title: "Network Transfer Calculator",
  titleDe: "Netzwerk-Transfer-Rechner",
  description: "Calculate file transfer time, required bandwidth, or transferable data for any speed/time combination.",
  descriptionDe: "Dateiübertragungszeit, benötigte Bandbreite oder übertragbare Datenmenge für beliebige Kombinationen berechnen.",
  explanation: "Enter two of three: size (e.g. 100 GB), speed (e.g. 1 Gbps), time (e.g. 2 min). Calculates the missing value.",
  explanationDe: "Zwei von drei eingeben: size (z.B. 100 GB), speed (z.B. 1 Gbps), time (z.B. 2 min). Berechnet den fehlenden Wert.",
  category: "Measurement",
  keywords: ["network","transfer","bandwidth","speed","time","mbps","gbps","file","übertragung","netzwerk"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "size: 100 GB\nspeed: 100 Mbps",
  example: "size: 4 GB\nspeed: 1 Gbps",
  useCasesDe: ["Backup-Dauer schätzen","Internetgeschwindigkeit berechnen","VPN-Transfer planen"],
  run: (input) => {
    const parse = (s: string): number => {
      const m = s.trim().match(/^([\d.,]+)\s*([a-zA-Z/]+)$/);
      if (!m) throw new Error(`Ungültiger Wert: '${s}'`);
      const val = parseFloat(m[1].replace(",","."));
      const unit = m[2].toLowerCase();
      const bytes: Record<string,number> = {
        b:1,kb:1e3,mb:1e6,gb:1e9,tb:1e12,
        kib:1024,mib:1048576,gib:1073741824,tib:1099511627776,
      };
      const bits: Record<string,number> = {
        bps:1,"kbps":1e3,"mbps":1e6,"gbps":1e9,"kbit/s":1e3,"mbit/s":1e6,"gbit/s":1e9,
        "kb/s":8e3,"mb/s":8e6,"gb/s":8e9,
      };
      const times: Record<string,number> = {s:1,sec:1,min:60,h:3600,hr:3600,hour:3600,d:86400,day:86400};
      if (unit in bytes) return val * bytes[unit];
      if (unit in bits) return val * bits[unit] / 8;
      if (unit in times) return val * times[unit];
      throw new Error(`Unbekannte Einheit '${unit}'`);
    };
    const kv: Record<string,string> = {};
    for (const line of input.split("\n")) {
      const i = line.indexOf(":");
      if (i>0) kv[line.slice(0,i).trim().toLowerCase()] = line.slice(i+1).trim();
    }
    const fmtSize = (b: number) => b>=1e12?`${(b/1e12).toFixed(2)} TB`:b>=1e9?`${(b/1e9).toFixed(2)} GB`:b>=1e6?`${(b/1e6).toFixed(2)} MB`:`${(b/1e3).toFixed(2)} KB`;
    const fmtSpeed = (bps: number) => bps>=1e9?`${(bps*8/1e9).toFixed(2)} Gbps`:bps>=1e6?`${(bps*8/1e6).toFixed(2)} Mbps`:`${(bps*8/1e3).toFixed(2)} Kbps`;
    const fmtTime = (s: number) => s>=86400?`${(s/86400).toFixed(2)}d`:s>=3600?`${Math.floor(s/3600)}h ${Math.floor((s%3600)/60)}min ${Math.floor(s%60)}s`:s>=60?`${Math.floor(s/60)}min ${Math.floor(s%60)}s`:`${s.toFixed(1)}s`;
    if (kv.size && kv.speed) {
      const sizeB = parse(kv.size); const speedBps = parse(kv.speed);
      const secs = sizeB / speedBps;
      return { output: `${fmtSize(sizeB)} bei ${fmtSpeed(speedBps)}\n→ Transferzeit: ${fmtTime(secs)}` };
    }
    if (kv.size && kv.time) {
      const sizeB = parse(kv.size); const timeSec = parse(kv.time);
      const speedBps = sizeB / timeSec;
      return { output: `${fmtSize(sizeB)} in ${fmtTime(timeSec)}\n→ Benötigte Bandbreite: ${fmtSpeed(speedBps)}` };
    }
    if (kv.speed && kv.time) {
      const speedBps = parse(kv.speed); const timeSec = parse(kv.time);
      const sizeB = speedBps * timeSec;
      return { output: `${fmtSpeed(speedBps)} für ${fmtTime(timeSec)}\n→ Übertragbare Datenmenge: ${fmtSize(sizeB)}` };
    }
    throw new Error("Mindestens zwei Werte eingeben:\nsize: 100 GB\nspeed: 1 Gbps\ntime: 2 min");
  },
});
