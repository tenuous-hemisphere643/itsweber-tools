import { defineTool } from "../core";

function httpStatus(value: string): string {
  const code = value.trim();
  const statuses: Record<string, string> = {
    "200": "OK - request succeeded.",
    "201": "Created - resource was created.",
    "204": "No Content - success without body.",
    "301": "Moved Permanently - resource has a new permanent URL.",
    "302": "Found - temporary redirect.",
    "304": "Not Modified - cached response can be used.",
    "400": "Bad Request - malformed request.",
    "401": "Unauthorized - authentication required.",
    "403": "Forbidden - authenticated but not allowed.",
    "404": "Not Found - resource does not exist.",
    "409": "Conflict - request conflicts with current state.",
    "418": "I'm a teapot - RFC 2324.",
    "429": "Too Many Requests - rate limit exceeded.",
    "500": "Internal Server Error - unexpected server failure.",
    "502": "Bad Gateway - invalid upstream response.",
    "503": "Service Unavailable - temporary overload or maintenance.",
  };
  return statuses[code] ?? "Unknown or less common HTTP status code.";
}

export default defineTool({
  id: "http-status",
  title: "HTTP Status Lookup",
  titleDe: "HTTP-Status-Suche",
  description: "Explains common HTTP status codes.",
  descriptionDe: "Erklärt häufige HTTP-Statuscodes.",
  explanation: "Status codes such as 404, 500, or 301 tell you what a web server did with a request.",
  explanationDe: "Statuscodes wie 404, 500 oder 301 sagen dir, was ein Webserver mit einer Anfrage gemacht hat.",
  category: "Web",
  keywords: ["http", "status", "codes"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "404",
  example: "418",
  run: (input) => ({ output: httpStatus(input) }),
});
