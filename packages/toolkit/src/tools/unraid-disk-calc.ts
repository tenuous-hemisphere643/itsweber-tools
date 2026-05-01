import { defineTool } from "../core";

export default defineTool({
  id: "unraid-disk-calc",
  title: "Unraid Disk Calculator",
  titleDe: "Unraid-Festplatten-Rechner",
  description: "Calculate Unraid array usable space, parity overhead, and expansion planning.",
  descriptionDe: "Unraid-Array nutzbaren Speicher, Paritätsoverhead und Erweiterungsplanung berechnen.",
  explanation: "Enter disk sizes in TB, one per line. The largest disk is automatically used as parity. Shows usable space, parity overhead, and expansion suggestions.",
  explanationDe: "Festplattengrößen in TB eingeben, je eine Zeile. Die größte Platte wird automatisch als Parität verwendet. Zeigt nutzbaren Speicher, Paritätsoverhead und Erweiterungsvorschläge.",
  category: "ItsWeber Ops",
  keywords: ["unraid","disk","array","parity","storage","nas","capacity","festplatte","speicher"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "6\n4\n4\n2\n2",
  example: "8\n6\n4\n4\n2",
  useCasesDe: ["Array-Kapazität planen","Erweiterung berechnen","Paritätsoverhead verstehen"],
  run: (input) => {
    const sizes = input.trim().split("\n").map(l=>parseFloat(l.trim().replace(",","."))).filter(n=>!isNaN(n)&&n>0);
    if (sizes.length < 2) throw new Error("Mindestens 2 Festplattengrößen (erste = Parität)");
    const sorted = [...sizes].sort((a,b)=>b-a);
    const parity = sorted[0];
    const dataDrives = sorted.slice(1);
    const total = sizes.reduce((a,b)=>a+b,0);
    const usable = dataDrives.reduce((a,b)=>a+b,0);
    const overhead = (parity/total*100).toFixed(1);
    const maxExpansion = parity;
    const out = [
      `Array-Zusammenfassung:`,``,
      `Paritätslaufwerk:  ${parity} TB`,
      `Datenlaufwerke:    ${dataDrives.length}x (${dataDrives.join(" + ")} TB)`,
      ``,
      `Gesamt (brutto):   ${total} TB`,
      `Nutzbar:           ${usable} TB`,
      `Paritätsoverhead:  ${parity} TB (${overhead}%)`,
      ``,
      `Erweiterung:`,
      `  Max. Laufwerksgröße: ${maxExpansion} TB (Paritätslimit)`,
      `  Für größere Laufwerke: Parität zuerst auf ${maxExpansion+2}+ TB upgraden`,
      ``,
      `Empfehlung: Laufwerke mit gleicher Größe für optimale Nutzung.`,
      `Unraid unterstützt 1 (Standard) oder 2 Paritätslaufwerke.`,
    ];
    if (dataDrives.length >= 20) out.push(`⚠ Nahe am Limit: Unraid unterstützt bis zu 28 Datenlaufwerke.`);
    return { output: out.join("\n") };
  },
});
