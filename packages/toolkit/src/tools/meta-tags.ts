import { defineTool } from "../core";

export default defineTool({
  id: "meta-tags",
  title: "Meta Tag Generator",
  titleDe: "Meta-Tag-Generator",
  description: "Generate complete HTML meta tags: SEO, Open Graph, Twitter Card, and viewport.",
  descriptionDe: "Vollständige HTML-Meta-Tags generieren: SEO, Open Graph, Twitter Card und Viewport.",
  explanation: "Enter key:value pairs, one per line. Keys: title, desc, url, image, author, robots, color. Generates all standard meta tag blocks.",
  explanationDe: "Schlüssel:Wert-Paare eingeben, je eine Zeile. Schlüssel: title, desc, url, image, author, robots, color. Gibt alle Standard-Meta-Tag-Blöcke aus.",
  category: "Web",
  keywords: ["meta","tag","seo","opengraph","twitter","card","html","head","og","viewport","social"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "title: ItsWeber Tools\ndesc: Self-hosted IT workbench\nurl: https://itsweber.de\nimage: /og.png",
  example: "title: ItsWeber Tools\ndesc: Schnelle Self-Hosted IT Workbench\nurl: https://itsweber.de",
  useCasesDe: ["Landing-Page SEO","Social-Media-Previews vorbereiten","PWA-Manifest ergänzen"],
  run: (input) => {
    const kv: Record<string,string> = {};
    input.split("\n").forEach(line => {
      const i = line.indexOf(":");
      if (i>0) { kv[line.slice(0,i).trim().toLowerCase()] = line.slice(i+1).trim(); }
    });
    const title = kv.title||"";
    const desc = kv.desc||kv.description||"";
    const url = kv.url||"";
    const image = kv.image||"";
    const author = kv.author||"";
    const robots = kv.robots||"index, follow";
    const color = kv.color||"";
    const lines: string[] = [
      `<!-- Basis SEO -->`,
      `<meta charset="UTF-8">`,
      `<meta name="viewport" content="width=device-width, initial-scale=1">`,
    ];
    if (title) { lines.push(`<title>${title}</title>`); lines.push(`<meta name="title" content="${title}">`); }
    if (desc) lines.push(`<meta name="description" content="${desc}">`);
    if (author) lines.push(`<meta name="author" content="${author}">`);
    lines.push(`<meta name="robots" content="${robots}">`);
    if (color) lines.push(`<meta name="theme-color" content="${color}">`);
    if (url) lines.push(`<link rel="canonical" href="${url}">`);
    lines.push(``,`<!-- Open Graph -->`);
    lines.push(`<meta property="og:type" content="website">`);
    if (title) lines.push(`<meta property="og:title" content="${title}">`);
    if (desc) lines.push(`<meta property="og:description" content="${desc}">`);
    if (url) lines.push(`<meta property="og:url" content="${url}">`);
    if (image) lines.push(`<meta property="og:image" content="${image}">`);
    lines.push(``,`<!-- Twitter Card -->`);
    lines.push(`<meta name="twitter:card" content="summary_large_image">`);
    if (title) lines.push(`<meta name="twitter:title" content="${title}">`);
    if (desc) lines.push(`<meta name="twitter:description" content="${desc}">`);
    if (image) lines.push(`<meta name="twitter:image" content="${image}">`);
    return { output: lines.join("\n") };
  },
});
