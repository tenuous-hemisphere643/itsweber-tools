import type { HistoryEntry } from "@itsweber/toolkit";
import type { Language } from "../lib/copy";

interface HistoryPageProps {
  language: Language;
  history: HistoryEntry[];
  onClear: () => void;
  onRerun: (entry: HistoryEntry) => void;
}

function relativeTime(ts: number, de: boolean): string {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return de ? "Gerade eben" : "Just now";
  const m = Math.floor(s / 60);
  if (m < 60) return de ? `vor ${m} Min.` : `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return de ? `vor ${h} Std.` : `${h}h ago`;
  const d = Math.floor(h / 24);
  return de ? `vor ${d} Tag${d === 1 ? "" : "en"}` : `${d}d ago`;
}

function trunc(s: string, max = 120): string {
  const single = s.replace(/\s+/g, " ").trim();
  return single.length > max ? single.slice(0, max) + "…" : single;
}

export function HistoryPage({ language, history, onClear, onRerun }: HistoryPageProps) {
  const de = language === "de";

  return (
    <div className="hist-page">
      <div className="hist-header">
        <div>
          <p className="hist-eyebrow">{de ? "VERLAUF" : "HISTORY"}</p>
          <h2 className="hist-title">
            {de ? "Ausführungshistorie" : "Execution History"}
          </h2>
          <p className="hist-sub">
            {history.length === 0
              ? (de ? "Noch keine Ausführungen." : "No executions yet.")
              : de
              ? `${history.length} Einträge — letzte ${Math.min(history.length, 100)} werden gespeichert`
              : `${history.length} entries — last ${Math.min(history.length, 100)} stored`}
          </p>
        </div>
        {history.length > 0 && (
          <button className="hist-clear-btn" onClick={onClear} type="button">
            {de ? "Alle löschen" : "Clear all"}
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="hist-empty">
          <span className="hist-empty-icon">⟳</span>
          <p>{de ? "Führe ein Tool aus, um den Verlauf zu starten." : "Run a tool to start recording history."}</p>
        </div>
      ) : (
        <ol className="hist-list">
          {history.map((entry, idx) => (
            <li key={entry.id} className={`hist-entry${entry.error ? " hist-entry--error" : ""}`}>
              <div className="hist-entry-meta">
                <span className="hist-entry-num">#{history.length - idx}</span>
                <span className="hist-entry-tool">{entry.toolTitle}</span>
                <span className="hist-entry-id">{entry.toolId}</span>
                <span className="hist-entry-time">{relativeTime(entry.ts, de)}</span>
              </div>
              <div className="hist-entry-io">
                <div className="hist-entry-row">
                  <span className="hist-entry-label">{de ? "Eingabe" : "Input"}</span>
                  <code className="hist-entry-val">{trunc(entry.input)}</code>
                </div>
                {entry.error ? (
                  <div className="hist-entry-row hist-entry-row--err">
                    <span className="hist-entry-label">Error</span>
                    <code className="hist-entry-val">{trunc(entry.error, 200)}</code>
                  </div>
                ) : (
                  <div className="hist-entry-row">
                    <span className="hist-entry-label">{de ? "Ausgabe" : "Output"}</span>
                    <code className="hist-entry-val">{trunc(entry.output)}</code>
                  </div>
                )}
              </div>
              <div className="hist-entry-actions">
                <button
                  className="hist-rerun-btn"
                  type="button"
                  onClick={() => onRerun(entry)}
                  title={de ? "Tool mit dieser Eingabe erneut öffnen" : "Reopen tool with this input"}
                >
                  {de ? "Wiederholen →" : "Rerun →"}
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
