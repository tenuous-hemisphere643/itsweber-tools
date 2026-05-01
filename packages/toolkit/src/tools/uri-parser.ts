import { defineTool } from "../core";

export default defineTool({
  id: "uri-parser",
  title: "URL / URI Parser",
  titleDe: "URL / URI Parser",
  description: "Parse a URL into its components — protocol, host, path, query params, hash.",
  descriptionDe: "Zerlegt eine URL in ihre Bestandteile — Protokoll, Host, Pfad, Query-Parameter, Hash.",
  explanation: "Parses any URL using the browser's native URL API and displays all components: protocol, hostname, port, pathname, query parameters (formatted), and hash.",
  explanationDe: "Zerlegt jede URL mit der nativen Browser-URL-API: Protokoll, Hostname, Port, Pfad, Query-Parameter (formatiert) und Hash.",
  category: "Web",
  keywords: ["url", "uri", "parse", "query", "params", "protocol", "host", "path", "hash", "link"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "https://example.com/path?foo=bar&baz=qux#section",
  example: "https://api.example.com:8443/v2/users?role=admin&active=true&page=1#results",
  useCasesDe: ["API-URLs analysieren", "Query-Parameter extrahieren", "Nginx-Regeln nachvollziehen"],
  run: (input) => {
    let url: URL;
    try {
      url = new URL(input.trim());
    } catch {
      try { url = new URL("https://" + input.trim()); } catch { throw new Error("Invalid URL. Include the protocol (https://...)."); }
    }

    const params = [...url.searchParams.entries()];
    const paramLines = params.length > 0
      ? params.map(([k, v]) => `    ${k} = ${v}`)
      : ["    (none)"];

    return {
      output: [
        `Protocol:  ${url.protocol}`,
        `Host:      ${url.hostname}`,
        `Port:      ${url.port || "(default)"}`,
        `Origin:    ${url.origin}`,
        `Path:      ${url.pathname}`,
        `Query:     ${url.search || "(none)"}`,
        `Hash:      ${url.hash || "(none)"}`,
        ``,
        `── Query Parameters (${params.length}) ──`,
        ...paramLines,
        ``,
        `Full URL:  ${url.href}`,
      ].join("\n"),
    };
  },
});
