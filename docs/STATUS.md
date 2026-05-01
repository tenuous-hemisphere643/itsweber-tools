# Project Status

> Stand: 2026-04-30 · Phase 1 + 2 + 3 + 4 abgeschlossen, Phase 5 in progress. **v1.0-Ziel: 163 Tools erreicht.**

## Phasen-Tracker

| Phase | Status | Inhalt |
|---|---|---|
| **0 — Plan-Approval** | ✓ | Logo Direction B, eine Brand, Konverter-Schwerpunkt, Anti-AI-Direction, 150/200/250 Tools |
| **1 — Brand-Sprint** | ✓ | 6 HTML-Previews (`previews/v2-*.html`), neue Direction-B-SVGs, Token-System spec'd |
| **2 — Architektur-Refactor** | ✓ | Tool-Registry, App.tsx-Split, ESLint+Prettier, useLocalStorage |
| **3 — UI v2** | ✓ | Topbar, Cmd+K-Palette, Discovery-Hub, Workbench v2, SettingsPanel, About-Page v2, Token-System, CategoryGrid, ImageDropZone |
| **4 — Tool-Welle (163 Tools)** | ✓ | 4a Konverter, 4b Dev/Ops/Crypto/Network, 4c Math/Data/QR, 4d Images+QR, 4e Polish — **163 Tools, 210 KB gz** |
| **5 — Hardening + Public-Release** | 🔄 | Docker-Härtung ✓ · PWA offen · Playwright offen · Unraid-Live-Test offen · GitHub-Push offen · GHCR-Image offen |

## Code-Stand (2026-04-30)

- App.tsx: **~300 LOC**
- Tools: **163 ready** in 12 Kategorien
- Bundle: **210 KB gz** initial + **127 KB gz** lazy (jsPDF) — Limit: 250 KB ✓
- Typecheck: ✓ | Lint: ✓ (0 Errors) | Build: ✓
- Build: ~4 s

## Phase 3 — Erledigte Items

| Item | Datei | Status |
| --- | --- | --- |
| Direction-B Topbar Lockup | `components/Topbar.tsx` | ✓ |
| Cmd+K Command Palette (cmdk) | `components/CommandPalette.tsx` | ✓ |
| Discovery Hub Homepage | `components/DiscoveryHub.tsx` | ✓ |
| Workbench v2 (Trust-Strip, IO-Grid) | `components/Workbench.tsx` | ✓ |
| Sidebar / ToolBrowser v2 | `components/ToolBrowser.tsx` | ✓ |
| Platform Detection (⌘ / Ctrl) | `lib/platform.ts` | ✓ |
| SettingsPanel (4 Tabs, Gear-Button) | `components/SettingsPanel.tsx` | ✓ |
| About-Page v2 (Hero, Pillars, Roadmap, Stack) | `components/AboutPage.tsx` | ✓ |
| CSS v2 Token-System (Petrol+Brass+Ink+Sand, Geist) | `styles.css` | ✓ |
| Token-Vollintegration (--shade-*, --rule-*, --font-mono, --text-muted) | `styles.css` | ✓ |
| CategoryGrid (Kategorie-Klick → Grid in Mitte) | `components/CategoryGrid.tsx` | ✓ |
| ImageDropZone (Drag & Drop für Bild-Tools) | `components/Workbench.tsx` | ✓ |
| Download-Button (Binary-Output für Bild-Tools) | `components/Workbench.tsx` | ✓ |
| inputMode-Feld (text \| image-drop) | `packages/toolkit/src/types.ts` | ✓ |
| Search-Bug-Fix (Category auto-reset beim Suchen) | `App.tsx` | ✓ |

## Phase 5 — Offene Items

- PWA-Manifest + Service Worker (offline-Fähigkeit)
- Playwright E2E-Tests (smoke + Tool-Execution)
- Smoke-Test: Lighthouse ≥ 90
- Unraid-Live-Test (SSH, vor GitHub-Push)
- GitHub Public Push
- GHCR-Image bauen + pushen

## Was im Repo geändert wurde (Phase 2)

```
NEW    apps/web/src/components/{AboutPage,DockerRail,HeroPanel,Metric,QuickList,ToolBrowser,Topbar,Workbench}.tsx
NEW    apps/web/src/hooks/useLocalStorage.ts
NEW    apps/web/src/lib/{copy,storageKeys,tool-i18n}.ts
NEW    packages/toolkit/src/{core,shared,globs.d}.ts
NEW    packages/toolkit/src/tools/<20 dateien>.ts
NEW    eslint.config.mjs
NEW    .prettierrc.json
NEW    .prettierignore
NEW    previews/v2-*.html (6 sheets)
MOD    apps/web/src/App.tsx (529 → 166 LOC)
MOD    package.json (lint/format/format:check scripts)
MOD    public/brand/itsweber-tools-{mark,wordmark}.svg (Direction B)
MOD    apps/web/package.json, packages/toolkit/package.json, packages/ui/package.json (lint script entfernt)
DEL    packages/toolkit/src/runner.ts (in core+tools/* aufgegangen)
DEL    packages/toolkit/src/catalog.ts (in tools/* aufgegangen)
```

## Wichtige Constraints für nachfolgende Arbeit

- **Anti-AI-Design**: aktive Vermeidung von KI-Standardlooks. Visuelle Referenz: `previews/v2-*.html`. Cross-Check pro Element.
- **Kein GitHub-Push** bis Phase 5 Unraid-Live-Test grün.
- **Repo-Hygiene**: niemals AI-Daten oder Personendaten committen.
- **Kein Login**: alle Persistenz in localStorage, Settings-Page statt Account.
- **Privacy-First**: alle Tools lokal, kein Telemetry, keine externen Fonts/CDNs in Production.
- **Brand**: Direction B als finales Logo, "It's Weber Tools" mit Apostroph, Petrol + Brass, signature 8 px Brass-Schraube oben rechts auf jeder Karte.

## Nächster Schritt

Phase 5 abschließen: GHCR-Image bauen + pushen, GitHub Release v0.2.0 anlegen, Screenshots für README hinzufügen.
