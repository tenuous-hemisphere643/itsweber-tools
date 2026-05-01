import { defineTool } from "../core";
import { textEncoder } from "../shared";

async function sha1(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-1", textEncoder.encode(input));
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

export default defineTool({
  id: "htpasswd",
  title: "htpasswd Generator",
  titleDe: "htpasswd Generator",
  description: "Generate htpasswd entries (SHA-1 / plaintext) for nginx and Apache.",
  descriptionDe: "Erzeugt htpasswd-Einträge (SHA-1 / Klartext) für nginx und Apache.",
  explanation: "Generates a {SHA} htpasswd entry compatible with nginx and Apache basic auth. Input: 'username password'.",
  explanationDe: "Erzeugt einen {SHA}-htpasswd-Eintrag kompatibel mit nginx- und Apache-Basic-Auth. Eingabe: 'Benutzername Passwort'.",
  category: "ItsWeber Ops",
  keywords: ["htpasswd", "basic auth", "nginx", "apache", "password", "passwort", "sha1", "authentifizierung"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "admin mySecurePassword",
  example: "admin mySecurePassword",
  useCasesDe: ["Nginx-Basic-Auth für Docker-Apps", "Unraid-Proxy-Schutz", "htpasswd-Datei schnell erzeugen"],
  run: async (input) => {
    const parts = input.trim().split(/\s+/);
    if (parts.length < 2) throw new Error("Enter: username password");
    const [user, ...pwParts] = parts;
    const password = pwParts.join(" ");
    if (!/^[a-zA-Z0-9._-]+$/.test(user)) throw new Error("Username may only contain letters, digits, dots, underscores, hyphens.");
    const hash = await sha1(password);
    return {
      output: [
        `# htpasswd entry (SHA-1):`,
        `${user}:{SHA}${hash}`,
        ``,
        `# Add to nginx:`,
        `#   auth_basic           "Protected";`,
        `#   auth_basic_user_file /etc/nginx/.htpasswd;`,
        ``,
        `# ⚠ {SHA} is not bcrypt — use 'htpasswd -B' for production.`,
      ].join("\n"),
    };
  },
});
