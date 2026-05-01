export type Language = "de" | "en";

export const copy = {
  de: {
    navTools: "Tools",
    navAbout: "Über",
    search: "Tools suchen, z. B. Docker, JSON, CIDR...",
    all: "Alle",
    ready: "Bereit",
    run: "Ausführen",
    input: "Eingabe",
    output: "Ausgabe",
    copy: "Kopieren",
    example: "Beispiel laden",
    favorites: "Favoriten",
    recent: "Zuletzt",
    privacy: "Läuft lokal im Browser",
    browserApi: "Nutzt sichere Browser-API",
    empty: "Wähle ein Tool aus oder starte mit der Suche.",
    aboutTitle: "Über ItsWeber Tools",
    aboutText:
      "Eine schnelle, self-hosted IT Workbench für Docker, Unraid und den Alltag in Infrastruktur-Projekten. Lokal, leicht und unabhängig.",
  },
  en: {
    navTools: "Tools",
    navAbout: "About",
    search: "Search tools, e.g. Docker, JSON, CIDR...",
    all: "All",
    ready: "Ready",
    run: "Run",
    input: "Input",
    output: "Output",
    copy: "Copy",
    example: "Load example",
    favorites: "Favorites",
    recent: "Recent",
    privacy: "Runs locally in your browser",
    browserApi: "Uses secure browser API",
    empty: "Pick a tool or start with search.",
    aboutTitle: "About ItsWeber Tools",
    aboutText:
      "A fast self-hosted IT workbench for Docker, Unraid, and daily infrastructure work. Local, lightweight, and independent.",
  },
} as const;

export const categoryLabelsDe: Record<string, string> = {
  Crypto: "Krypto",
  Converter: "Konverter",
  Web: "Web",
  "Images and QR": "Bilder & QR",
  Development: "Entwicklung",
  Network: "Netzwerk",
  Math: "Mathe",
  Measurement: "Messung",
  Text: "Text",
  Data: "Daten",
  "ItsWeber Ops": "ItsWeber Ops",
};
