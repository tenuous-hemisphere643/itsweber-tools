import { defineTool } from "../core";

export default defineTool({
  id: "line-tools",
  title: "Line Tools",
  titleDe: "Zeilen-Werkzeuge",
  description: "Sort, deduplicate, filter, count, number, or reverse lines of text.",
  descriptionDe: "Sortiert, dedupliziert, filtert, zählt, nummeriert oder kehrt Zeilen um.",
  explanation: "First line = command (sort, sort-desc, unique, reverse, number, shuffle, count, trim, filter:<term>), remaining lines = text to process.",
  explanationDe: "Erste Zeile = Befehl (sort, sort-desc, unique, reverse, number, shuffle, count, trim, filter:<Begriff>), Rest = zu verarbeitender Text.",
  category: "Text",
  keywords: ["lines","zeilen","sort","sortieren","unique","deduplicate","reverse","filter","number","text","tools"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "sort\n\nZeile C\nZeile A\nZeile B",
  example: "sort\n\nalpaca\nzebra\nmouse\nelephant\ncat\nzebra",
  useCasesDe: ["Log-Zeilen sortieren und deduplizieren","IP-Listen bereinigen","CSV-Zeilen filtern"],
  run: (input) => {
    const nl = input.indexOf("\n");
    if (nl === -1) throw new Error("Erste Zeile = Befehl, dann Leerzeile, dann Text.");
    const cmd = input.slice(0,nl).trim().toLowerCase();
    const text = input.slice(nl+1).trimStart();
    const lines = text.split("\n");
    let result: string[];
    if (cmd==="sort") result=[...lines].sort((a,b)=>a.localeCompare(b));
    else if (cmd==="sort-desc"||cmd==="sort desc") result=[...lines].sort((a,b)=>b.localeCompare(a));
    else if (cmd==="unique"||cmd==="dedup") result=[...new Set(lines)];
    else if (cmd==="reverse") result=[...lines].reverse();
    else if (cmd==="number") result=lines.map((l,i)=>`${String(i+1).padStart(String(lines.length).length," ")}. ${l}`);
    else if (cmd==="trim") result=lines.map(l=>l.trim());
    else if (cmd==="count") return { output:`${lines.length} Zeilen\n${new Set(lines).size} eindeutige Zeilen\n${lines.filter(l=>l.trim()).length} nicht-leere Zeilen` };
    else if (cmd==="shuffle") result=[...lines].sort(()=>Math.random()-0.5);
    else if (cmd.startsWith("filter:")) { const term=cmd.slice(7); result=lines.filter(l=>l.toLowerCase().includes(term)); }
    else throw new Error(`Unbekannter Befehl '${cmd}'.\nErlaubt: sort, sort-desc, unique, reverse, number, shuffle, count, trim, filter:<Begriff>`);
    return { output:[`${result.length} Zeilen nach '${cmd}':`,``,...result].join("\n") };
  },
});
