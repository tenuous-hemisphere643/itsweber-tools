import { defineTool } from "../core";

function mdToHtml(md: string): string {
  return md
    .replace(/^#{6}\s+(.+)$/gm, "<h6>$1</h6>")
    .replace(/^#{5}\s+(.+)$/gm, "<h5>$1</h5>")
    .replace(/^#{4}\s+(.+)$/gm, "<h4>$1</h4>")
    .replace(/^#{3}\s+(.+)$/gm, "<h3>$1</h3>")
    .replace(/^#{2}\s+(.+)$/gm, "<h2>$1</h2>")
    .replace(/^#{1}\s+(.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^---$/gm, "<hr>")
    .replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>\n${m}</ul>`)
    .replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>")
    .split(/\n{2,}/)
    .map((block) => {
      if (/^<(h[1-6]|ul|blockquote|hr)/.test(block.trim())) return block.trim();
      return `<p>${block.trim().replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n\n");
}

export default defineTool({
  id: "markdown-to-html",
  title: "Markdown → HTML",
  titleDe: "Markdown → HTML",
  description: "Convert Markdown to HTML (headings, bold, italic, links, lists).",
  descriptionDe: "Wandelt Markdown in HTML um (Überschriften, Fett, Kursiv, Links, Listen).",
  explanation: "Converts basic Markdown syntax to HTML. Supports headings (h1–h6), bold, italic, inline code, links, blockquotes, and unordered lists.",
  explanationDe: "Konvertiert grundlegendes Markdown in HTML. Unterstützt Überschriften (h1–h6), Fett, Kursiv, Inline-Code, Links, Blockquotes und Listen.",
  category: "Converter",
  keywords: ["markdown", "html", "md", "convert", "render", "preview", "dokumentation"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "# Hello\n\n**Bold** and *italic* text.",
  example: "# ItsWeber Tools\n\nA **self-hosted** IT workbench for *Docker* and Unraid.\n\n- Local\n- Private\n- Offline-capable",
  useCasesDe: ["README-Vorschau ohne GitHub", "Dokumentationen schnell konvertieren", "E-Mail-HTML aus Markdown erzeugen"],
  run: (input) => ({ output: mdToHtml(input) }),
});
