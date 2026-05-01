import { defineTool } from "../core";

export default defineTool({
  id: "ssh-keygen-guide",
  title: "SSH Keygen Guide",
  titleDe: "SSH-Keygen-Leitfaden",
  description: "Generate ssh-keygen commands for different key types and use cases.",
  descriptionDe: "ssh-keygen-Befehle für verschiedene Schlüsseltypen und Anwendungsfälle generieren.",
  explanation: "Enter a key type or use case: ed25519, rsa4096, rsa2048, ecdsa, server, github, deploy. Or 'all' for overview.",
  explanationDe: "Schlüsseltyp oder Anwendungsfall eingeben: ed25519, rsa4096, rsa2048, ecdsa, server, github, deploy. Oder 'all' für Übersicht.",
  category: "ItsWeber Ops",
  keywords: ["ssh","keygen","key","public","private","ed25519","rsa","authorized","server","git"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "ed25519",
  example: "github",
  useCasesDe: ["SSH-Keys für Server generieren","GitHub-Keys erstellen","Deploy-Keys konfigurieren"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const guides: Record<string,string[]> = {
      ed25519: [
        `# Empfohlen: Ed25519 (sicher, schnell, kurze Keys)`,
        `ssh-keygen -t ed25519 -C "user@host" -f ~/.ssh/id_ed25519`,
        ``,
        `# Öffentlichen Key ausgeben:`,
        `cat ~/.ssh/id_ed25519.pub`,
        ``,
        `# Auf Server kopieren:`,
        `ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server`,
      ],
      rsa4096: [
        `# RSA 4096 (Kompatibilität mit alten Systemen)`,
        `ssh-keygen -t rsa -b 4096 -C "user@host" -f ~/.ssh/id_rsa`,
        ``,
        `# Schlüssel-Fingerprint prüfen:`,
        `ssh-keygen -lf ~/.ssh/id_rsa.pub`,
      ],
      ecdsa: [
        `# ECDSA P-256`,
        `ssh-keygen -t ecdsa -b 256 -C "user@host" -f ~/.ssh/id_ecdsa`,
      ],
      server: [
        `# Server-Schlüssel prüfen (z.B. nach Neuinstallation):`,
        `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub`,
        ``,
        `# Host-Keys neu generieren:`,
        `ssh-keygen -A`,
        ``,
        `# Known-Hosts Eintrag entfernen (nach Neuinstallation):`,
        `ssh-keygen -R hostname`,
      ],
      github: [
        `# GitHub-Key erstellen:`,
        `ssh-keygen -t ed25519 -C "your@email.com" -f ~/.ssh/github_ed25519`,
        ``,
        `# SSH-Config (~/.ssh/config):`,
        `Host github.com`,
        `  HostName github.com`,
        `  User git`,
        `  IdentityFile ~/.ssh/github_ed25519`,
        ``,
        `# Key zu GitHub hinzufügen: Settings → SSH Keys → New SSH Key`,
        `cat ~/.ssh/github_ed25519.pub`,
      ],
      deploy: [
        `# Deploy-Key (ohne Passphrase, nur Lesezugriff):`,
        `ssh-keygen -t ed25519 -C "deploy@ci" -f ~/.ssh/deploy_key -N ""`,
        ``,
        `# Pub-Key → GitHub/GitLab Repository Settings → Deploy Keys`,
        `cat ~/.ssh/deploy_key.pub`,
        ``,
        `# In CI verwenden:`,
        `export GIT_SSH_COMMAND="ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no"`,
      ],
      all: [
        `Schlüsseltypen im Vergleich:`,``,
        `  ed25519   Empfohlen, modern, schnell, 256-bit Sicherheit`,
        `  ecdsa     ECDSA P-256/P-384, breite Kompatibilität`,
        `  rsa4096   Legacy-Kompatibilität, 4096-bit`,
        `  rsa2048   Minimum-Länge (veraltet, aber noch verbreitet)`,
        ``,
        `Anwendungsfälle: github, deploy, server`,
        ``,
        `Passphrase-Management mit ssh-agent:`,
        `  eval $(ssh-agent -s)`,
        `  ssh-add ~/.ssh/id_ed25519`,
      ],
    };
    const result = guides[t] || guides.all;
    if (!guides[t] && t!=="all") return { output: [`Unbekannt: '${input}'. Zeige alle:`,...guides.all].join("\n") };
    return { output: result.join("\n") };
  },
});
