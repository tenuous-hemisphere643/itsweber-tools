import { defineTool } from "../core";

function chmod(value: string): string {
  const compact = value.trim().replace(/[^rwx-]/g, "");
  if (!/^[r-][w-][x-][r-][w-][x-][r-][w-][x-]$/.test(compact)) {
    throw new Error("Use symbolic permissions like rwxr-x---.");
  }
  const groups = compact.match(/.{1,3}/g) ?? [];
  return groups
    .map((group) => (group[0] === "r" ? 4 : 0) + (group[1] === "w" ? 2 : 0) + (group[2] === "x" ? 1 : 0))
    .join("");
}

export default defineTool({
  id: "chmod-calculator",
  title: "CHMOD Calculator",
  titleDe: "CHMOD-Rechner",
  description: "Converts symbolic permissions to octal mode.",
  descriptionDe: "Wandelt symbolische Rechte in Oktalwerte um.",
  explanation: "Linux permissions such as rwxr-x--- can be represented as numbers like 750 for chmod commands.",
  explanationDe: "Linux-Rechte wie rwxr-x--- können als Zahlen wie 750 für chmod-Befehle dargestellt werden.",
  category: "Development",
  keywords: ["chmod", "linux", "permissions"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "rwxr-x---",
  example: "rwxr-x---",
  run: (input) => ({ output: chmod(input) }),
});
