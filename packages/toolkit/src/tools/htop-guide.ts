import { defineTool } from "../core";

export default defineTool({
  id: "htop-guide",
  title: "htop / top Field Reference",
  titleDe: "htop / top Felder-Referenz",
  description: "Explain htop and top column headers, key bindings, and process states.",
  descriptionDe: "htop- und top-Spaltenköpfe, Tastenkürzel und Prozesszustände erklären.",
  explanation: "Enter a field name (PID, CPU, MEM, VSZ, RSS, etc.) or 'keys' for keyboard shortcuts, 'states' for process states.",
  explanationDe: "Feldname eingeben (PID, CPU, MEM, VSZ, RSS etc.) oder 'keys' für Tastenkürzel, 'states' für Prozesszustände.",
  category: "Development",
  keywords: ["htop","top","process","cpu","memory","linux","sysadmin","pid","rss","vsz"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "cpu",
  example: "keys",
  useCasesDe: ["Server-Monitoring verstehen","Prozess-Ressourcen analysieren","Linux sysadmin lernen"],
  run: (input) => {
    const t = input.trim().toUpperCase();
    const fields: Record<string,string> = {
      "PID":"Process ID — eindeutige Prozessnummer",
      "PPID":"Parent Process ID — PID des übergeordneten Prozesses",
      "USER":"Benutzer dem der Prozess gehört",
      "PRI":"Priorität des Prozesses (OS-intern)",
      "NI":"Nice-Wert (-20 bis 19, niedriger = höhere Priorität)",
      "CPU":"%CPU — CPU-Auslastung in Prozent",
      "%CPU":"%CPU — CPU-Auslastung in Prozent",
      "%MEM":"%MEM — Anteil des physischen RAM",
      "MEM":"Physischer Speicher (RSS)",
      "VSZ":"Virtual Memory Size — gesamt allozierter virtueller Speicher",
      "RSS":"Resident Set Size — tatsächlich belegter RAM (kB)",
      "RES":"RSS — tatsächlich belegter physischer RAM",
      "SHR":"Geteilter Speicher mit anderen Prozessen",
      "S":"STATUS — Zustand des Prozesses (R/S/D/Z/T)",
      "STAT":"STATUS — erweiterter Prozesszustand",
      "START":"Startzeit des Prozesses",
      "TIME":"Kumulierte CPU-Zeit",
      "COMMAND":"Befehlsname / Pfad",
    };
    const entry = fields[t] || fields[t.replace("%","")];
    if (entry) return { output: `${t}: ${entry}` };
    if (t==="KEYS") return { output: [
      `htop-Tastenkürzel:`,``,
      `  F1 / h     Hilfe`,
      `  F2         Setup`,
      `  F3 / /     Suchen`,
      `  F4         Filtern`,
      `  F5         Baumansicht`,
      `  F6         Sortieren`,
      `  F9         Prozess beenden (kill)`,
      `  F10        Beenden`,
      `  k          Signal senden`,
      `  u          Nach Benutzer filtern`,
      `  Space      Tag/Untag`,
      `  P          CPU-Sortierung`,
      `  M          Speicher-Sortierung`,
      `  T          Zeit-Sortierung`,
    ].join("\n") };
    if (t==="STATES") return { output: [
      `Prozess-Zustände:`,``,
      `  R  Running  — läuft gerade`,
      `  S  Sleeping — wartet auf Ereignis (unterbrechbar)`,
      `  D  Disk     — wartet auf I/O (nicht unterbrechbar)`,
      `  Z  Zombie   — beendet, aber nicht aufgeräumt`,
      `  T  Stopped  — durch Signal angehalten`,
      `  I  Idle     — Kernel-Thread im Leerlauf`,
    ].join("\n") };
    return { output: [
      `Felder: ${Object.keys(fields).join(", ")}`,``,
      `Spezial: KEYS, STATES`,
    ].join("\n") };
  },
});
