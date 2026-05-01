# Tool-Pipes — Konzept & Spezifikation

> Status: **Spezifiziert** — Implementierung in Phase 4 geplant.

## Was sind Pipes?

Pipes verbinden Tools so, dass der Output eines Tools automatisch zum Input des nächsten wird — ohne Copy-Paste. Eine Pipe ist eine benannte, gespeicherte Kette von Tools, die auf einen Klick oder per Tastenkürzel ausgeführt wird.

**Beispiel:**
```
json-format → base64-encode → sha256-hash
```
Input einmal eingeben, alle drei Tools laufen durch, Endresultat steht direkt da.

## Warum Pipes?

Wiederkehrende Workflows in der IT-Arbeit bestehen oft aus mehreren Schritten, die man sonst manuell verketten muss:
- JWT prüfen → Payload dekodieren → neu signieren
- docker-run konvertieren → Compose validieren → .env extrahieren
- JSON formatieren → minifizieren → Base64 encodieren

Pipes machen das einmalig speicherbar und per `Ctrl+K → "pipe-name"` sofort ausführbar.

## Datenmodell (geplant)

```ts
interface Pipe {
  id: string;           // z.B. "jwt-roundtrip"
  name: string;         // Anzeigename
  steps: string[];      // Tool-IDs in Reihenfolge, z.B. ["jwt-decode", "hmac-verify"]
  createdAt: number;    // Timestamp
  runCount: number;     // wie oft ausgeführt
}
```

Gespeichert in `localStorage` unter dem Key `itsweber:pipes`.

## UX-Flow (geplant)

1. Tool ausführen → Button „→ Pipe to…" erscheint neben dem Output
2. Klick öffnet Tool-Picker für den nächsten Schritt
3. Pipe benennen + speichern
4. Im Hub unter „Tool-Pipes" sichtbar, per `Ctrl+K → Pipe-Name` ausführbar
5. Pipes-Tab in der Topbar öffnet Pipe-Manager (Liste, Edit, Delete, Run)

## Keyboard-Shortcuts (geplant)

| Shortcut | Aktion |
|---|---|
| `Ctrl+K` → Pipe-Name | Pipe direkt ausführen |
| `Ctrl+P` | Pipe-Manager öffnen |
| `→` im Workbench | Output an nächste Pipe-Stufe weiterleiten |

## Implementierungs-Reihenfolge (Phase 4)

1. `localStorage`-Store + Pipe-Typ in `packages/toolkit/src/types.ts`
2. „→ Pipe to…" Button im Workbench-Output
3. Pipe-Builder Modal (Tool-Picker, Benennung)
4. Pipe-Ausführung (sequenziell, Output → Input)
5. Pipes-Tab in Topbar + Pipe-Manager
6. `Ctrl+K` Integration (Pipes tauchen als Einträge in der Palette auf)
