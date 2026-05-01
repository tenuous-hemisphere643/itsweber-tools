# Changelog

## [0.2.0] — 2026-04-30

### Features

- **Pipes system** — chain tools into reusable multi-step workflows; each step uses the previous output (chain mode) or a fixed static value; optional prefix injection; sequential execution with per-step timing and inline results; final output panel with copy button
- **Execution history** — last 100 tool runs stored in localStorage; input/output preview; relative timestamps; one-click rerun
- **`rawOutput` for clean pipe chaining** — tools with metadata headers (`Modus:`, `Länge:`, etc.) now expose a separate `rawOutput` field containing only the data value; pipe chaining uses `rawOutput` when available so downstream steps receive clean input
- **Command palette badges** — Pipes and History nav items show entry count badges when non-empty
- **163 tools** across 11 categories including image tools (resize, crop, compress, convert, flip, metadata, color picker, QR, favicon, image-to-PDF, image-to-base64)

### Infrastructure

- **Docker hardening** — non-root `appuser`, `--security-opt no-new-privileges:true`, CSP (`connect-src *` for CORS tester), `Permissions-Policy`, `server_tokens off`, `--frozen-lockfile` in build
- **PWA** — `manifest.webmanifest`, service worker (`sw.js`) with stale-while-revalidate for same-origin GETs, apple-touch-icon, theme-color meta
- **Vitest 4 test suite** — 15 tests in 2 suites: registry completeness (no duplicate IDs, valid statuses, required fields), tool execution (base64, json-format, text-case, yaml-json, math-eval)

### Architecture

- **Tool-Registry pattern** — `defineTool()` + `import.meta.glob` auto-discovery; one file per tool; no registration step
- **`rawOutput?: string`** added to `ToolResult` and `PipeStepResult` — tools that add metadata headers set this field for downstream pipe chaining
- **`useLocalStorage` hook** — typed codecs (`jsonCodec`, `stringCodec`) replace scattered `useEffect` persistence logic
- **App.tsx** — `Page` type extended to `"hub" | "tools" | "history" | "pipes" | "about"`; execute() records HistoryEntry on every run (success + error); max 100 entries

### Tools updated

- `base64` — `rawOutput`: encoded string or decoded string only (no `Modus:`/`Länge:` headers)
- `json-format` — `rawOutput`: pretty-printed or minified JSON only (no stats header)
- `number-base` — `rawOutput`: decimal integer string
- `encoding-detector` — `rawOutput`: first detected decoded value

---

## [0.1.0] — 2026-03-15

### Initial release

- Brand identity: Direction B "Prompt Bracket" logo (SVG, theme-adaptive), Petrol `#157897` + Brass `#E6A23C`
- Monorepo scaffold: pnpm workspaces, `@itsweber/toolkit`, `@itsweber/ui`, `apps/web`
- ESLint v9 flat config + Prettier 3
- First 80 tools across Crypto, Converter, Development, Network, Text, Math, Measurement, Web categories
- Docker multi-stage build (nginx Alpine), basic CSP
