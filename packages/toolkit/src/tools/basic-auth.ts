import { defineTool } from "../core";

function basicAuth(value: string): string {
  const trimmed = value.trim();
  if (!trimmed.includes(":")) {
    throw new Error("Use the format username:password.");
  }
  return `Authorization: Basic ${btoa(unescape(encodeURIComponent(trimmed)))}`;
}

export default defineTool({
  id: "basic-auth",
  title: "Basic Auth Header",
  titleDe: "Basic-Auth-Header",
  description: "Builds an HTTP Basic Authorization header.",
  descriptionDe: "Erstellt einen HTTP-Basic-Authorization-Header.",
  explanation:
    "Some APIs and reverse proxies expect username and password as a Base64 encoded Authorization header.",
  explanationDe:
    "Manche APIs und Reverse Proxys erwarten Benutzername und Passwort als Base64-kodierten Authorization-Header.",
  category: "Web",
  keywords: ["basic", "auth", "header"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "username:password",
  example: "admin:change-me",
  run: (input) => ({ output: basicAuth(input) }),
});
