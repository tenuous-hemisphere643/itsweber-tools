<div align="center">

# It's Weber Tools

**163 lokale Tools — Crypto, Converter, Netzwerk, Docker, Bilder und mehr.**  
Läuft überall wo Docker läuft. Keine Cloud, kein Login, keine Telemetrie. Alles bleibt im Browser.

[![Lizenz](https://img.shields.io/badge/Lizenz-Proprietär-3ba7a7.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-ready-2ea3f2.svg)](#schnellstart)
[![Tools](https://img.shields.io/badge/Tools-163-e6a23c.svg)](#tool-kategorien)
[![Made by ITSWEBER](https://img.shields.io/badge/by-itsweber.de-2ea3f2.svg)](https://itsweber.de)

[Schnellstart](#schnellstart) · [Tool-Kategorien](#tool-kategorien) · [Pipes](#pipes) · [Architektur](#architektur) · [Entwicklung](#entwicklung)

🇬🇧 **Read in English** → [README.md](README.md)

</div>

---

## Funktionen

- **163 fertige Tools** in 11 Kategorien — fast alle laufen lokal im Browser, kein Server-Call nötig
- **Pipe-System** — Tools verketten: Output von Schritt N wird Input von Schritt N+1; statische Eingaben und Präfix-Injection unterstützt
- **Ausführungshistorie** — letzte 100 Läufe in localStorage, per Klick wiederholen
- **Command Palette** (Strg + K) — Fuzzy-Suche über alle Tools, Pipes und Aktionen; Tastatur-First
- **Zweisprachig** — vollständige DE/EN-UI, wechselt ohne Reload
- **Dark / Light Mode** — System-Standard-Erkennung, wird sitzungsübergreifend gespeichert
- **Bild-Tools** — Drag-and-Drop für Resize, Crop, Compress, Convert, Flip, Metadaten, Farbwähler, QR-Generator, Favicon-Generator
- **Privacy-First** — keine Analytics, keine externen Fonts oder CDNs in Production, keine Accounts
- **Einzelner Docker-Container** — nginx-basiert, ~10 MB Image, Non-Root-User, Security-Header inkl. CSP
- **PWA** — installierbar, Service Worker für Offline-Nutzung

---

## Schnellstart

### Docker (empfohlen)

```bash
docker run -d \
  --name itsweber-tools \
  --restart unless-stopped \
  -p 8080:80 \
  --security-opt no-new-privileges:true \
  ghcr.io/itsweber-official/itsweber-tools:latest
```

[http://localhost:8080](http://localhost:8080) öffnen.

### docker-compose

```yaml
services:
  itsweber-tools:
    image: ghcr.io/itsweber-official/itsweber-tools:latest
    container_name: itsweber-tools
    restart: unless-stopped
    ports:
      - "8080:80"
    security_opt:
      - no-new-privileges:true
```

### Aus dem Quellcode

```bash
git clone https://github.com/itsweber-official/itsweber-tools.git
cd itsweber-tools
pnpm install
pnpm dev          # http://localhost:5173
```

Docker-Image selbst bauen: `docker build -f docker/Dockerfile -t itsweber-tools:dev .`

---

## Tool-Kategorien

| Kategorie | Anzahl | Beispiele |
|---|---|---|
| **Crypto** | 12 | SHA-256/MD5/HMAC, PBKDF2, bcrypt, AES, JWT generieren/parsen/dekodieren, htpasswd |
| **Converter** | 24 | Base64, Hex↔RGB, URL-Codec, HTML-Entities, Römische Zahlen, Zahlensysteme, Temperatur, CSV↔JSON, YAML↔JSON, TOML↔JSON |
| **Development** | 28 | JSON format/minify/validate/query/schema, Regex-Tester, Cron-Parser, SQL-Formatter, Env-Formatter/Parser, String-Escape, Docker run→compose, Diff |
| **Network** | 18 | CIDR/Subnet-Rechner, IP-Info/Geo, DNS-Lookup, Port-Lookup, MAC-Lookup, IPv4-Range, UFW-Regeln, nginx-Config, ssh-keygen-Guide, CORS-Tester |
| **Images and QR** | 12 | QR-Generator, Favicon-Generator, Bild resize/crop/compress/convert/flip/Metadaten/Farbwähler/zu-Base64/zu-PDF |
| **Text** | 18 | Wortzähler, Lorem Ipsum, Textfall, Zeilen-Tools, Text-Diff, Markdown↔HTML, Markdown-Lint, Text-Wrap, Template, Slugify |
| **Data** | 10 | CSV-Analyzer, JSON-Query, Tabellen-Format, Docker-ps-Formatter, Docker-Image-Size, IBAN-Validator, Open Graph, Meta-Tags, Statistik |
| **Math** | 12 | Math-Eval, Prozentrechnung, GGT/KGV, Fibonacci, Primzahl-Prüfer, Zahlenformat, Statistik |
| **Measurement** | 14 | Einheiten-Konverter — Länge, Gewicht, Fläche, Volumen, Druck, Energie, Geschwindigkeit, Datengröße, Seitenverhältnis, CSS-Einheiten, Bytes-Formatter |
| **Web** | 8 | URL/URI-Parser, HTTP-Statuscodes, Basic Auth, API-Status-Monitor, Farbpalette, Farbkontrast, Farbkonvertierung, Farbnamen |
| **ItsWeber Ops** | 7 | Docker run→compose, docker-compose-Lint, Unraid-Template-Helfer, nginx-Config-Builder, UFW-Regeln, ssh-keygen-Guide, htpasswd |

Vollständiger Katalog: [docs/TOOL_CATALOG.md](docs/TOOL_CATALOG.md)

---

## Pipes

Das Pipe-System ermöglicht es, Tools zu wiederverwendbaren Workflows zu verketten:

```
[JSON Formatter] → formatiertes JSON
       ↓
[Base64 Encoder] → Base64 des JSON
       ↓
[SHA-256 Hash]   → Hash des Base64-Strings
```

Jeder Schritt kann den Output des vorherigen Schritts (Verkettungs-Modus) oder einen festen Wert nutzen. Optional kann ein Präfix vor dem Verketten vorangestellt werden. Das finale Output-Panel zeigt das saubere Ergebnis ohne Metadaten-Header aus Zwischen-Tools.

---

## Architektur

| Schicht | Technologie |
|---|---|
| Framework | React 19, TypeScript 5.9 strict |
| Build | Vite 7, pnpm Workspaces |
| Pakete | `@itsweber/toolkit` (Tool-Engine + 163 Tools), `@itsweber/ui` (Theme-Tokens) |
| Tool-Engine | `defineTool()`-Registry, eine Datei pro Tool, Auto-Discovery via `import.meta.glob` |
| State | React `useState` + `useLocalStorage` (Theme, Sprache, History, Pipes, Favoriten) |
| Container | nginx 1.27 Alpine, Multi-Stage-Build, Non-Root-User, CSP/Security-Header |
| Tests | Vitest 4 — Registry-Vollständigkeit, keine Duplikat-IDs, Tool-Ausführung |

---

## Entwicklung

```bash
pnpm install
pnpm dev              # Vite Dev-Server auf http://localhost:5173
pnpm lint             # ESLint v9
pnpm typecheck        # tsc --noEmit
pnpm test             # Vitest
pnpm build            # Production-Build
pnpm format           # Prettier
```

### Neues Tool hinzufügen

`packages/toolkit/src/tools/<id>.ts` erstellen:

```ts
import { defineTool } from "../core";

export default defineTool({
  id: "my-tool",
  title: "My Tool",
  titleDe: "Mein Tool",
  description: "What it does in one sentence.",
  descriptionDe: "Was es tut in einem Satz.",
  explanation: "Longer usage explanation with example.",
  explanationDe: "Längere Nutzungserklärung mit Beispiel.",
  category: "Converter",
  keywords: ["keyword1", "keyword2"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "Input placeholder text",
  example: "example input value",
  useCases: ["Use case 1", "Use case 2"],
  useCasesDe: ["Anwendungsfall 1", "Anwendungsfall 2"],
  run: (input) => ({ output: input.toUpperCase() }),
});
```

Auto-Discovery via `import.meta.glob` — keine Registrierung nötig. Test-Eintrag in `packages/toolkit/src/registry.test.ts` ergänzen.

---

## Roadmap

- [x] v0.1 — Initiales Scaffold, Brand-Identität (Petrol + Brass, Direction-B-Logo)
- [x] v0.2 — 163 Tools, Pipes-System, History, Docker-Härtung, PWA, zweisprachige UI
- [ ] v0.3 — Operator-Themes (Dark Variants), Settings-Panel, Tastaturkürzel-Anpassung
- [ ] v0.4 — GitHub CI/CD (typecheck + test bei PR, GHCR-Image bei Tag)
- [ ] v1.0 — 200 Tools, Unraid Community App Listing

---

## Lizenz

Siehe [LICENSE](LICENSE) — Quellcode ist öffentlich einsehbar für Distribution und Docker-basiertes Deployment.

---

Gebaut von **[ITSWEBER](https://itsweber.de)** · Issues und PRs willkommen → [CONTRIBUTING.md](CONTRIBUTING.md)
