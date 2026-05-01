import { defineTool } from "../core";

const SECTIONS: Record<string, [string,string][]> = {
  basics: [
    ["git init","Neues Repository erstellen"],
    ["git clone <url>","Repository klonen"],
    ["git status","Arbeitsstatus anzeigen"],
    ["git add .","Alle Änderungen stagen"],
    ["git add -p","Interaktiv teilen und stagen"],
    ["git commit -m \"msg\"","Commit erstellen"],
    ["git commit --amend","Letzten Commit bearbeiten"],
    ["git log --oneline --graph","Kompakter Verlauf"],
  ],
  branch: [
    ["git branch","Branches auflisten"],
    ["git branch <name>","Neuen Branch erstellen"],
    ["git checkout -b <name>","Branch erstellen und wechseln"],
    ["git switch <name>","Zu Branch wechseln (modern)"],
    ["git merge <branch>","Branch mergen"],
    ["git rebase <branch>","Branch rebasieren"],
    ["git branch -d <name>","Branch löschen"],
    ["git cherry-pick <hash>","Commit übernehmen"],
  ],
  remote: [
    ["git remote -v","Remotes anzeigen"],
    ["git remote add origin <url>","Remote hinzufügen"],
    ["git fetch --all","Alle Remotes abrufen"],
    ["git pull","Aktualisieren + mergen"],
    ["git pull --rebase","Aktualisieren + rebasieren"],
    ["git push -u origin <branch>","Branch pushen (mit Tracking)"],
    ["git push --force-with-lease","Sicherer Force-Push"],
  ],
  undo: [
    ["git restore <file>","Unstaged Änderungen verwerfen"],
    ["git restore --staged <file>","Staging rückgängig"],
    ["git reset HEAD~1","Letzten Commit rückgängig (Änderungen bleiben)"],
    ["git reset --hard HEAD~1","Letzten Commit entfernen (Änderungen weg!)"],
    ["git revert <hash>","Commit durch neuen Commit rückgängig"],
    ["git stash","Änderungen zwischenspeichern"],
    ["git stash pop","Zwischengespeichertes wiederherstellen"],
  ],
  search: [
    ["git log --grep=\"term\"","In Commit-Nachrichten suchen"],
    ["git log -S \"code\"","In Diff-Inhalten suchen"],
    ["git blame <file>","Zeile-für-Zeile Autoren"],
    ["git bisect start","Binärsuche nach Bug"],
    ["git log --all --oneline -- <file>","Datei-Verlauf anzeigen"],
  ],
};

export default defineTool({
  id: "git-cheatsheet",
  title: "Git Cheatsheet",
  titleDe: "Git-Spickzettel",
  description: "Quick reference for common Git commands, organized by topic.",
  descriptionDe: "Schnellreferenz für häufige Git-Befehle, nach Thema geordnet.",
  explanation: "Enter a topic: basics, branch, remote, undo, search. Or leave blank for all.",
  explanationDe: "Thema eingeben: basics, branch, remote, undo, search. Oder leer lassen für alle.",
  category: "Development",
  keywords: ["git","cheatsheet","spickzettel","commit","branch","merge","rebase","remote","undo","stash"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "basics",
  example: "branch",
  useCasesDe: ["Git-Befehle nachschlagen","Onboarding-Hilfe","Quick-Reference"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const keys = t && SECTIONS[t] ? [t] : Object.keys(SECTIONS);
    if (t && !SECTIONS[t]) throw new Error(`Unbekanntes Thema '${t}'.\nErlaubt: ${Object.keys(SECTIONS).join(", ")}`);
    const out: string[] = [];
    for (const key of keys) {
      out.push(`── ${key.toUpperCase()} ${"─".repeat(35-key.length)}`);
      for (const [cmd,desc] of SECTIONS[key]) {
        out.push(`  ${cmd.padEnd(38)}  ${desc}`);
      }
      out.push("");
    }
    return { output: out.join("\n") };
  },
});
