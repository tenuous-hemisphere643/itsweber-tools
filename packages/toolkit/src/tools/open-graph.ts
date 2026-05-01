import { defineTool } from "../core";

export default defineTool({
  id: "open-graph",
  title: "Open Graph Preview",
  titleDe: "Open-Graph-Vorschau",
  description: "Generate and preview Open Graph meta tags for social media sharing.",
  descriptionDe: "Open-Graph-Meta-Tags für Social-Media-Shares generieren und vorschauen.",
  explanation: "Enter key:value pairs. Keys: title, description, url, image, type, site_name, locale, twitter_handle. Shows generated tags + character counts.",
  explanationDe: "Schlüssel:Wert-Paare eingeben. Schlüssel: title, description, url, image, type, site_name, locale, twitter_handle. Zeigt generierte Tags + Zeichenzählungen.",
  category: "Web",
  keywords: ["opengraph","og","social","share","twitter","facebook","preview","meta","seo"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "title: ItsWeber Tools\ndescription: Self-hosted IT Workbench\nurl: https://itsweber.de\nimage: /og-image.png",
  example: "title: ItsWeber Tools v2\ndescription: Schnelle Self-Hosted IT Workbench für Entwickler\nsite_name: ItsWeber",
  useCasesDe: ["Social-Media-Previews prüfen","OG-Tags vollständig befüllen","Link-Vorschauen optimieren"],
  run: (input) => {
    const kv: Record<string,string> = {};
    input.split("\n").forEach(l=>{ const i=l.indexOf(":"); if(i>0) kv[l.slice(0,i).trim().toLowerCase()]=l.slice(i+1).trim(); });
    const title = kv.title||"";
    const desc = kv.description||kv.desc||"";
    const url = kv.url||"";
    const image = kv.image||"";
    const type = kv.type||"website";
    const siteName = kv.site_name||kv.sitename||"";
    const locale = kv.locale||"de_DE";
    const twitter = kv.twitter_handle||kv.twitter||"";
    const lines: string[] = [];
    const warn: string[] = [];
    if (!title) warn.push("⚠ title fehlt (wichtig!)");
    else if (title.length > 70) warn.push(`⚠ title zu lang: ${title.length} > 70 Zeichen`);
    if (!desc) warn.push("⚠ description fehlt");
    else if (desc.length > 200) warn.push(`⚠ description zu lang: ${desc.length} > 200 Zeichen`);
    if (!image) warn.push("⚠ image fehlt (empfohlen: 1200×630px)");
    lines.push(`<!-- Open Graph Tags -->`);
    if (title) lines.push(`<meta property="og:title" content="${title}">`);
    if (desc) lines.push(`<meta property="og:description" content="${desc}">`);
    if (url) lines.push(`<meta property="og:url" content="${url}">`);
    if (image) lines.push(`<meta property="og:image" content="${image}">`);
    lines.push(`<meta property="og:type" content="${type}">`);
    if (siteName) lines.push(`<meta property="og:site_name" content="${siteName}">`);
    lines.push(`<meta property="og:locale" content="${locale}">`);
    lines.push(``,`<!-- Twitter Card -->`);
    lines.push(`<meta name="twitter:card" content="summary_large_image">`);
    if (twitter) lines.push(`<meta name="twitter:site" content="@${twitter.replace("@","")}">`);
    if (title) lines.push(`<meta name="twitter:title" content="${title}">`);
    if (desc) lines.push(`<meta name="twitter:description" content="${desc}">`);
    if (image) lines.push(`<meta name="twitter:image" content="${image}">`);
    if (warn.length) lines.push(``,`── Hinweise ─────────────────────────────`,...warn);
    return { output: lines.join("\n") };
  },
});
