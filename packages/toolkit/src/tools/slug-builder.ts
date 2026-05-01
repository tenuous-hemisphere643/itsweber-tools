import { defineTool } from "../core";

export default defineTool({
  id: "slug-builder",
  title: "Slug Builder",
  titleDe: "Slug-Builder",
  description: "Convert titles or phrases to URL-friendly slugs with multiple format options.",
  descriptionDe: "Titel oder Phrasen in URL-freundliche Slugs konvertieren mit verschiedenen Formatoptionen.",
  explanation: "Enter text (title, phrase, filename). Generates URL slug, SEO-friendly version, file-safe name, and namespace versions.",
  explanationDe: "Text eingeben (Titel, Phrase, Dateiname). Erzeugt URL-Slug, SEO-freundliche Variante, dateisicheren Namen und Namespace-Versionen.",
  category: "Web",
  keywords: ["slug","url","seo","permalink","filename","convert","path","kebab","clean"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "Meine tolle Artikel-Überschrift!",
  example: "ItsWeber Tools v2 Release — was ist neu?",
  useCasesDe: ["Blog-Post-URLs","Dateinamen normalisieren","REST-API-Pfade"],
  run: (input) => {
    const t = input.trim();
    const normalize = (s: string) => s
      .normalize("NFD").replace(/[̀-ͯ]/g,"")
      .replace(/[äÄ]/g,"ae").replace(/[öÖ]/g,"oe").replace(/[üÜ]/g,"ue").replace(/ß/g,"ss")
      .replace(/[^a-zA-Z0-9\s-]/g,"")
      .trim().replace(/\s+/g,"-").toLowerCase().replace(/-+/g,"-");
    const slug = normalize(t);
    const withYear = `${new Date().getFullYear()}-${slug}`;
    const noStopwords = slug.replace(/-(?:und|oder|der|die|das|ein|eine|in|an|auf|ist|was|wie|mit|von|the|a|an|and|or|in|of|to|for|with|on|at|by)-/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"");
    return { output: [
      `Slug:           ${slug}`,
      `Mit Jahreszahl: ${withYear}`,
      `Ohne Füllwörter: ${noStopwords}`,
      `Dateiname:      ${slug}.html`,
      `Namespace:      ${slug.replace(/-/g,"_")}`,
      `PascalCase:     ${slug.split("-").map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join("")}`,
      ``,
      `Original: ${t}`,
    ].join("\n") };
  },
});
