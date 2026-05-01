import { defineTool } from "../core";
import { escapeXml } from "../shared";

function unraidTemplate(value: string): string {
  const data = Object.fromEntries(
    value
      .split(/\r?\n/)
      .map((line) => line.split("="))
      .filter(([key, val]) => key && val)
      .map(([key, ...val]) => [key.trim().toLowerCase(), val.join("=").trim()]),
  );
  const name = data.name || "ItsWeber Tools";
  const image = data.image || "ghcr.io/itsweber-official/itsweber-tools:latest";
  const port = data.port || "8080";
  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<Container version="2">',
    `  <Name>${escapeXml(name)}</Name>`,
    "  <Repository>" + escapeXml(image) + "</Repository>",
    "  <Registry>https://github.com/itsweber-official/itsweber-tools</Registry>",
    "  <Network>bridge</Network>",
    "  <Shell>sh</Shell>",
    "  <Privileged>false</Privileged>",
    "  <Support>https://github.com/itsweber-official/itsweber-tools/issues</Support>",
    "  <Project>https://github.com/itsweber-official/itsweber-tools</Project>",
    "  <Overview>Fast local IT toolbox with ItsWeber branding.</Overview>",
    `  <Config Name="Web UI" Target="80" Default="${escapeXml(port)}" Mode="tcp" Description="Web interface" Type="Port" Display="always" Required="true" Mask="false" />`,
    "</Container>",
  ].join("\n");
}

export default defineTool({
  id: "unraid-template-helper",
  title: "Unraid Template Helper",
  titleDe: "Unraid-Template-Helfer",
  description: "Generates a simple Unraid XML template from image data.",
  descriptionDe: "Erstellt aus Image-Daten ein einfaches Unraid-XML-Template.",
  explanation:
    "Unraid Community Apps use XML templates for Docker apps. This helper creates a starting point from name, image, and port.",
  explanationDe:
    "Unraid Community Apps nutzen XML-Templates für Docker-Apps. Dieser Helfer erzeugt einen Startpunkt aus Name, Image und Port.",
  category: "ItsWeber Ops",
  keywords: ["unraid", "docker", "template", "xml"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "name=ItsWeber Tools\nimage=ghcr.io/itsweber-official/itsweber-tools:latest\nport=8080",
  example: "name=ItsWeber Tools\nimage=ghcr.io/itsweber-official/itsweber-tools:latest\nport=8080",
  run: (input) => ({ output: unraidTemplate(input) }),
});
