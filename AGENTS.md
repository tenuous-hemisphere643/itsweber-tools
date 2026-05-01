# AGENTS.md — Briefing für AI-Assistenten

Lies diese Datei einmal am Sessionstart, bevor du mit Code-Änderungen anfängst.

## Was ist das Projekt?

It's Weber Tools — ein selbst-gehostetes IT-Toolkit (Konverter, Crypto, Docker, Netzwerk, Web). Public-Release auf GitHub geplant, soll besser als it-tools (corentinth) sein, kein Klon. Detail siehe [README.md](README.md).

## Wo bin ich gerade?

[docs/STATUS.md](docs/STATUS.md) — Phasen-Tracker mit aktuellem Stand. Phase 1 (Brand) + Phase 2 (Architektur-Refactor) sind ✓. Nächste: Phase 3 (UI v2).

## Single Source of Truth

- **Status**: [docs/STATUS.md](docs/STATUS.md)
- **Tool-Katalog**: [docs/TOOL_CATALOG.md](docs/TOOL_CATALOG.md)
- **Visual specs**: `previews/v2-*.html` (open in browser)

## Harte Regeln

1. **Niemals AI-/Personendaten committen.** `.env` mit echten Werten, Conversation-Logs, IDE-Settings mit privaten Pfaden bleiben außerhalb.
2. **Niemals private IPs, Hostnamen oder Credentials in Source-Code.**
3. **Anti-AI-Design**: keine Glassmorphism, keine Lila-Blau-Gradient-Meshes, keine identischen Rounded-Cards. Industrial-Workshop-Aesthetik (Bemaßungen, Mono-Annotationen, Petrol + Brass, signature 8 px Schraube). Cross-Check vor Commit: "Würde Midjourney das genauso bauen?"
4. **Brand fix**: Logo Direction B (Prompt Bracket), "It's Weber Tools" mit Apostroph, Petrol `#157897` + Brass `#E6A23C`. Geist Sans/Mono.
5. **Privacy-First**: alle Tools lokal im Browser, keine Telemetry, keine externen Fonts/CDNs in Production.
6. **Kein Login**: nur Settings-Panel + localStorage.
7. **Tool-Beschreibungen** sind bilingual Pflicht: `description`/`descriptionDe`, `explanation`/`explanationDe`, `useCases`/`useCasesDe`.

## Wie füge ich ein neues Tool hinzu?

Eine Datei unter `packages/toolkit/src/tools/<id>.ts` mit `defineTool({...})` als Default-Export. Auto-Discovery, sonst nichts. Schema in [README.md](README.md) und [CONTRIBUTING.md](CONTRIBUTING.md).

## Vor jedem nicht-trivialen Commit

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Alle vier müssen grün sein. Bundle ≤ 250 KB gz Budget.

## Was tun bei Unsicherheit?

- **Refactor groß genug, dass App.tsx wachsen würde?** → in Subkomponente unter `apps/web/src/components/` auslagern.
- **Neue State-Persistenz?** → `useLocalStorage` aus `apps/web/src/hooks/useLocalStorage.ts` nutzen, keine raw `useEffect + localStorage.setItem`.
- **Übersetzbarer String?** → in `apps/web/src/lib/copy.ts`, nicht inline. (Mid-term: i18next-Migration kommt in Phase 3, wenn 3. Sprache dazu kommt.)
- **Brand-Frage?** → Direction B SVG ist `public/brand/itsweber-tools-mark.svg`. Wordmark in `itsweber-tools-wordmark.svg`. Beide mit `prefers-color-scheme` Media-Query.
- **Stylesheet-Frage?** → aktuelle Tokens sind in `apps/web/src/styles.css` als `--app-bg`, `--brand`, `--accent` etc. Phase 3 zieht das auf das v2-Token-System aus `previews/v2-design-tokens.html` um.

## Nächste konkrete Aufgabe

Siehe [docs/STATUS.md](docs/STATUS.md) "Nächster Schritt" — Reihenfolge für Phase 3.
