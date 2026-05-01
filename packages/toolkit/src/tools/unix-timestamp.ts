import { defineTool } from "../core";

export default defineTool({
  id: "unix-timestamp",
  title: "Unix Timestamp Converter",
  titleDe: "Unix-Timestamp Konverter",
  description: "Convert Unix timestamps to human-readable dates and vice versa.",
  descriptionDe: "Wandelt Unix-Timestamps in lesbare Datumsangaben um und umgekehrt.",
  explanation: "A Unix timestamp is the number of seconds since 1970-01-01T00:00:00Z. Millisecond timestamps (13 digits) are also supported.",
  explanationDe: "Ein Unix-Timestamp ist die Anzahl Sekunden seit dem 1.1.1970 UTC. 13-stellige Millisekunden-Timestamps werden ebenfalls erkannt.",
  category: "Converter",
  keywords: ["unix", "timestamp", "epoch", "date", "time", "datum", "zeit", "iso"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "1700000000 or 2024-11-14T22:13:20Z",
  example: "1700000000",
  useCasesDe: ["Log-Timestamps verstehen", "API-Antworten lesen", "Cron-Zeiten prüfen"],
  run: (input) => {
    const trimmed = input.trim();
    const numVal = Number(trimmed);
    if (!Number.isNaN(numVal) && /^\d+$/.test(trimmed)) {
      const ms = trimmed.length >= 13 ? numVal : numVal * 1000;
      const d = new Date(ms);
      if (Number.isNaN(d.getTime())) throw new Error("Invalid timestamp.");
      return {
        output: [
          `UTC:       ${d.toUTCString()}`,
          `ISO 8601:  ${d.toISOString()}`,
          `Local:     ${d.toLocaleString()}`,
          `Unix (s):  ${Math.floor(ms / 1000)}`,
          `Unix (ms): ${ms}`,
        ].join("\n"),
      };
    }
    const d = new Date(trimmed);
    if (Number.isNaN(d.getTime())) throw new Error("Enter a Unix timestamp (seconds or ms) or ISO 8601 date.");
    return {
      output: [
        `Unix (s):  ${Math.floor(d.getTime() / 1000)}`,
        `Unix (ms): ${d.getTime()}`,
        `ISO 8601:  ${d.toISOString()}`,
        `UTC:       ${d.toUTCString()}`,
      ].join("\n"),
    };
  },
});
