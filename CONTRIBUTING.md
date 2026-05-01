# Contributing

## Local workflow

```bash
pnpm install
pnpm dev          # localhost:5173
```

Vor jedem Commit:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm format:check
```

## Neues Tool hinzufügen

Eine einzige Datei unter [packages/toolkit/src/tools/](packages/toolkit/src/tools/) — siehe [README.md](README.md) für das `defineTool()`-Schema. Wichtig:

- **Bilingual ausfüllen**: alle sechs Felder `title`/`titleDe`, `description`/`descriptionDe`, `explanation`/`explanationDe`. Nicht nur EN.
- **`useCases` und `useCasesDe`** je 3 Bullet-Points.
- **`privacyMode`** auf `"local-only"` (default) oder `"browser-api"` (z. B. WebCrypto, Clipboard).
- Wenn das Tool wirft, dann `throw new Error("klarer Hinweis was zu tun ist")` — die UI zeigt das als Fehlermeldung.
- Test in [packages/toolkit/src/runner.test.ts](packages/toolkit/src/runner.test.ts) ergänzen.

## Privacy baseline

Tools verarbeiten Daten ausschließlich lokal im Browser. Keine Server-Roundtrips, keine Telemetrie, kein externer CDN. Wenn ein Tool zwingend eine externe API braucht, ist das in der Tool-Beschreibung explizit zu dokumentieren — und es kommt in einen separaten "Networked Tools"-Bereich (heute noch nicht vorhanden).

## Repo-Hygiene

**Niemals committen**:

- `.env` mit echten Werten (nur `.env.example`)
- API-Keys, Tokens, Credentials, Passwörter
- AI-Conversation-Logs, persönliche Daten
- Lokale IDE-Settings mit absoluten Pfaden
- Echte Benutzer-Inputs aus Tests (nur synthetische Daten wie `"name": "ItsWeber Tools"`)

`.gitignore` deckt Standardfälle ab — bei Unsicherheit `git status -uno` durchgehen vor `git add`.

## Anti-AI-Design

UI-Beiträge dürfen **nicht** wie KI-Defaults aussehen (Glassmorphism, Lila-Blau-Mesh, Sparkles, identische Rounded-Cards). Stattdessen Industrial-Workshop-Aesthetik: Bemaßungen, Mono-Annotationen, asymmetrische Editorial-Layouts, Petrol + Brass, scharfe 4-px-Radien, Signature-Schraube oben rechts. Visuelle Referenz: [previews/v2-*.html](previews/).

Cross-Check vor Merge: "Würde Midjourney das genauso bauen?" → wenn ja, ändern.

## Branches & Commits

- Branch from `main`, open a PR — CI runs `pnpm typecheck && pnpm test`
- Commit messages in imperative form: `Add hex-to-rgb tool`, `Fix base64 rawOutput`
- No force-pushes to `main`

## Fragen

Open an issue or discussion on [github.com/itsweber-official/itsweber-tools](https://github.com/itsweber-official/itsweber-tools).
