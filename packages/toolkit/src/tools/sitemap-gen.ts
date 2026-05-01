import { defineTool } from "../core";

export default defineTool({
  id: "sitemap-gen",
  title: "XML Sitemap Generator",
  titleDe: "XML-Sitemap-Generator",
  description: "Generate XML sitemaps from URL lists with priority, frequency, and lastmod settings.",
  descriptionDe: "XML-Sitemaps aus URL-Listen mit Priorität, Häufigkeit und Änderungsdatum generieren.",
  explanation: "Enter a base URL on line 1, then relative paths (one per line). Optional: append '|priority|changefreq' to any URL.",
  explanationDe: "Basis-URL in Zeile 1, dann relative Pfade (je eine Zeile). Optional: '|Priorität|Häufigkeit' an URLs anhängen.",
  category: "Web",
  keywords: ["sitemap","xml","seo","urls","google","crawler","robot","indexing"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "https://itsweber.de\n/\n/tools\n/about\n/blog|0.8|weekly",
  example: "https://example.com\n/\n/products\n/about\n/contact|0.6|monthly",
  useCasesDe: ["SEO-Sitemap erstellen","Google Search Console","Neue Site indizieren lassen"],
  run: (input) => {
    const lines = input.trim().split("\n").filter(Boolean);
    const base = lines[0].trim().replace(/\/$/,"");
    if (!base.startsWith("http")) throw new Error("Erste Zeile: Basis-URL (https://...)");
    const today = new Date().toISOString().slice(0,10);
    const urls = lines.slice(1).map(l=>{
      const [path, prio, freq] = l.split("|");
      return { url: base+(path.trim().startsWith("/")?path.trim():"/"+(path.trim())), prio: prio?.trim()||"1.0", freq: freq?.trim()||"monthly" };
    });
    const xmlUrls = urls.map(({url,prio,freq})=>`  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${prio}</priority>\n  </url>`);
    return { output: [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
      ...xmlUrls,
      `</urlset>`,
    ].join("\n") };
  },
});
