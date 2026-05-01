import { defineTool } from "../core";

const SHORTCUTS: Record<string,[string,string,string][]> = {
  vscode: [
    ["⌘/Ctrl+P","Datei öffnen (Quick Open)","Datei"],
    ["⌘/Ctrl+Shift+P","Command Palette","Allgemein"],
    ["⌘/Ctrl+`","Terminal öffnen","Terminal"],
    ["⌘/Ctrl+B","Seitenleiste ein/aus","UI"],
    ["⌘/Ctrl+/","Zeile kommentieren","Bearbeiten"],
    ["Alt+↑↓","Zeile verschieben","Bearbeiten"],
    ["⌘/Ctrl+D","Nächste Übereinstimmung wählen","Multi-Cursor"],
    ["⌘/Ctrl+Shift+L","Alle Übereinstimmungen wählen","Multi-Cursor"],
    ["⌘/Ctrl+K ⌘/Ctrl+C","Zeile kommentieren","Bearbeiten"],
    ["F2","Symbol umbenennen","Refactor"],
    ["F12","Zur Definition","Navigation"],
    ["⌘/Ctrl+Shift+F","Suchen in Dateien","Suche"],
    ["⌘/Ctrl+Shift+G","Source Control","Git"],
  ],
  chrome: [
    ["⌘/Ctrl+T","Neuer Tab","Navigation"],
    ["⌘/Ctrl+W","Tab schließen","Navigation"],
    ["⌘/Ctrl+L","Adressleiste","Navigation"],
    ["⌘/Ctrl+R","Seite neu laden","Navigation"],
    ["⌘/Ctrl+Shift+J","DevTools öffnen","Entwickler"],
    ["F12","DevTools öffnen","Entwickler"],
    ["⌘/Ctrl+Shift+I","Element inspizieren","Entwickler"],
    ["⌘/Ctrl+Shift+M","Mobile-Ansicht","Entwickler"],
    ["⌘/Ctrl+F","Auf Seite suchen","Suche"],
    ["⌘/Ctrl+D","Lesezeichen","Lesezeichen"],
  ],
  terminal: [
    ["Ctrl+C","Prozess abbrechen","Prozess"],
    ["Ctrl+Z","Prozess stoppen (SIGSTOP)","Prozess"],
    ["Ctrl+L","Bildschirm leeren","UI"],
    ["Ctrl+A","Zum Zeilenanfang","Navigation"],
    ["Ctrl+E","Zum Zeilenende","Navigation"],
    ["Ctrl+R","Verlauf durchsuchen","Verlauf"],
    ["!!","Letzten Befehl wiederholen","Verlauf"],
    ["Ctrl+U","Zeile löschen","Bearbeiten"],
    ["Ctrl+W","Letztes Wort löschen","Bearbeiten"],
    ["Alt+.","Letztes Argument","Effizienz"],
    ["cd -","Vorheriges Verzeichnis","Navigation"],
  ],
};

export default defineTool({
  id: "keyboard-shortcuts",
  title: "Keyboard Shortcuts Reference",
  titleDe: "Tastaturkürzel-Referenz",
  description: "Quick reference for keyboard shortcuts in VS Code, Chrome DevTools, and Terminal.",
  descriptionDe: "Schnellreferenz für Tastaturkürzel in VS Code, Chrome DevTools und Terminal.",
  explanation: "Enter an app: vscode, chrome, terminal. Or leave blank for all.",
  explanationDe: "App eingeben: vscode, chrome, terminal. Oder leer für alle.",
  category: "Development",
  keywords: ["keyboard","shortcuts","hotkeys","vscode","chrome","terminal","productivity","kürzel"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "vscode",
  example: "terminal",
  useCasesDe: ["Shortcuts lernen","Workflow beschleunigen","Neue Tools entdecken"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const keys = t && SHORTCUTS[t] ? [t] : Object.keys(SHORTCUTS);
    if (t && !SHORTCUTS[t]) throw new Error(`Unbekannt: '${t}'.\nErlaubt: ${Object.keys(SHORTCUTS).join(", ")}`);
    const out: string[] = [];
    for (const app of keys) {
      out.push(`── ${app.toUpperCase()} ${"─".repeat(35-app.length)}`);
      for (const [keys,desc] of SHORTCUTS[app]) out.push(`  ${keys.padEnd(32)}  ${desc}`);
      out.push("");
    }
    return { output: out.join("\n") };
  },
});
