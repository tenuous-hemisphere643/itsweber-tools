import { defineTool } from "../core";

function toCamel(s: string) { return s.replace(/[-_\s]+(.)/g,(_,c)=>c.toUpperCase()).replace(/^./,c=>c.toLowerCase()); }
function toPascal(s: string) { return toCamel(s).replace(/^./,c=>c.toUpperCase()); }
function toSnake(s: string) { return s.replace(/([a-z])([A-Z])/g,"$1_$2").replace(/[-\s]+/g,"_").toLowerCase(); }
function toKebab(s: string) { return toSnake(s).replace(/_/g,"-"); }
function toScream(s: string) { return toSnake(s).toUpperCase(); }
function toTitle(s: string) { return s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()); }
function toDot(s: string) { return toSnake(s).replace(/_/g,"."); }
function toTrain(s: string) { return toKebab(s).replace(/(^|-)./g,c=>c.toUpperCase()); }

export default defineTool({
  id: "text-case",
  title: "Text Case Converter",
  titleDe: "Schreibweisen-Konverter",
  description: "Convert text to camelCase, PascalCase, snake_case, kebab-case, SCREAMING_SNAKE, Title Case, dot.case, and more.",
  descriptionDe: "Konvertiert Text in camelCase, PascalCase, snake_case, kebab-case, SCREAMING_SNAKE, Title Case, dot.case und weitere.",
  explanation: "Converts any text to all common programming and writing conventions simultaneously. Useful for variable names, API fields, CSS classes, and filenames.",
  explanationDe: "Wandelt Text gleichzeitig in alle gängigen Programmier- und Schreibkonventionen um. Nützlich für Variablennamen, API-Felder, CSS-Klassen und Dateinamen.",
  category: "Text",
  keywords: ["case","camel","pascal","snake","kebab","screaming","title","dot","train","konvertieren","schreibweise"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "my example text",
  example: "itsweber docker tools",
  useCasesDe: ["Variablennamen für verschiedene Sprachen","CSS-Klassen aus Beschreibungen","API-Feldnamen vereinheitlichen"],
  run: (input) => {
    const t = input.trim();
    return { output: [
      `camelCase:      ${toCamel(t)}`,
      `PascalCase:     ${toPascal(t)}`,
      `snake_case:     ${toSnake(t)}`,
      `kebab-case:     ${toKebab(t)}`,
      `SCREAMING:      ${toScream(t)}`,
      `Title Case:     ${toTitle(t)}`,
      `dot.case:       ${toDot(t)}`,
      `Train-Case:     ${toTrain(t)}`,
      `UPPERCASE:      ${t.toUpperCase()}`,
      `lowercase:      ${t.toLowerCase()}`,
    ].join("\n") };
  },
});
