import { defineTool } from "../core";

const SECTIONS: Record<string,[string,string][]> = {
  files: [
    ["ls -la","Alle Dateien mit Details"],
    ["find . -name '*.log'","Dateien nach Name suchen"],
    ["find . -newer file.txt","Neuere Dateien finden"],
    ["du -sh *","Verzeichnisgrößen anzeigen"],
    ["df -h","Festplattenbelegung"],
    ["stat file.txt","Detaillierte Dateiinfos"],
    ["lsof +D /path","Offene Dateien in Verzeichnis"],
    ["file binary","Dateityp erkennen"],
  ],
  processes: [
    ["ps aux","Alle Prozesse"],
    ["pgrep nginx","Prozess nach Name suchen"],
    ["kill -9 PID","Prozess beenden"],
    ["pkill nginx","Alle Prozesse nach Name beenden"],
    ["top / htop","Prozess-Monitor"],
    ["nohup cmd &","Im Hintergrund laufen lassen"],
    ["jobs","Hintergrundprozesse auflisten"],
    ["systemctl status svc","Service-Status"],
  ],
  network: [
    ["ss -tuln","Offene Ports anzeigen"],
    ["netstat -rn","Routing-Tabelle"],
    ["ip addr","Netzwerkadressen"],
    ["ip route","Routing-Infos"],
    ["curl -I url","HTTP-Header abrufen"],
    ["tcpdump -i eth0","Netzwerkverkehr mitschneiden"],
    ["iptables -L -n","Firewall-Regeln"],
  ],
  logs: [
    ["tail -f /var/log/syslog","Log live verfolgen"],
    ["journalctl -u service","Service-Logs"],
    ["journalctl --since '1h ago'","Letzte Stunde"],
    ["grep -r 'error' /var/log/","Fehler suchen"],
    ["zcat *.gz | grep pattern","Komprimierte Logs durchsuchen"],
  ],
  disk: [
    ["lsblk","Block-Geräte anzeigen"],
    ["fdisk -l","Partitionen anzeigen"],
    ["mount | column -t","Eingehängte Dateisysteme"],
    ["fstrim -av","SSD TRIM"],
    ["smartctl -a /dev/sda","SMART-Daten anzeigen"],
    ["rsync -avz src/ dst/","Synchronisieren"],
  ],
  users: [
    ["id username","Benutzerinfos"],
    ["who","Angemeldete Benutzer"],
    ["last","Login-Verlauf"],
    ["passwd username","Passwort ändern"],
    ["usermod -aG group user","Gruppe hinzufügen"],
    ["visudo","Sudoers editieren"],
    ["chown -R user:group /path","Eigentümer ändern"],
    ["chmod -R 755 /path","Berechtigungen setzen"],
  ],
};

export default defineTool({
  id: "linux-commands",
  title: "Linux Commands Cheatsheet",
  titleDe: "Linux-Befehle Spickzettel",
  description: "Quick reference for common Linux commands organized by category.",
  descriptionDe: "Schnellreferenz für häufige Linux-Befehle nach Kategorie geordnet.",
  explanation: "Enter a category: files, processes, network, logs, disk, users. Or leave blank for all.",
  explanationDe: "Kategorie eingeben: files, processes, network, logs, disk, users. Oder leer für alle.",
  category: "Development",
  keywords: ["linux","bash","shell","command","cli","cheatsheet","unix","sysadmin","terminal"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "network",
  example: "logs",
  useCasesDe: ["Linux-Befehle nachschlagen","Sysadmin-Aufgaben","Neue Server einrichten"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const keys = t && SECTIONS[t] ? [t] : Object.keys(SECTIONS);
    if (t && !SECTIONS[t]) throw new Error(`Unbekannte Kategorie '${t}'.\nErlaubt: ${Object.keys(SECTIONS).join(", ")}`);
    const out: string[] = [];
    for (const key of keys) {
      out.push(`── ${key.toUpperCase()} ${"─".repeat(33-key.length)}`);
      for (const [cmd,desc] of SECTIONS[key]) out.push(`  ${cmd.padEnd(38)}  ${desc}`);
      out.push("");
    }
    return { output: out.join("\n") };
  },
});
