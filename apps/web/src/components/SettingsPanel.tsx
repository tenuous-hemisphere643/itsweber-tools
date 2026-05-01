import { useState } from "react";
import { X } from "lucide-react";
import { themes, colorModes, type ThemeId, type ColorMode } from "@itsweber/ui";
import type { Language } from "../lib/copy";
import { modKeyLabel } from "../lib/platform";

type SettingsTab = "appearance" | "language" | "keyboard" | "privacy";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  language: Language;
  theme: ThemeId;
  onChangeTheme: (t: ThemeId) => void;
  colorMode: ColorMode;
  onChangeColorMode: (m: ColorMode) => void;
  onChangeLanguage: (l: Language) => void;
  onClearHistory: () => void;
  onClearFavorites: () => void;
}

const TABS: Array<{ id: SettingsTab; de: string; en: string }> = [
  { id: "appearance", de: "Erscheinung", en: "Appearance" },
  { id: "language",   de: "Sprache",     en: "Language"   },
  { id: "keyboard",   de: "Tastatur",    en: "Keyboard"   },
  { id: "privacy",    de: "Datenschutz", en: "Privacy"    },
];

const THEME_SWATCHES: Record<ThemeId, [string, string, string]> = {
  "itsweber-petrol":  ["#157897", "#E6A23C", "#0e2029"],
  "graphite-command": ["#36d6c2", "#ffbf47", "#12171d"],
  "clean-studio":     ["#d4943a", "#69c189", "#1d1d1b"],
};

export function SettingsPanel({
  open,
  onClose,
  language,
  theme,
  onChangeTheme,
  colorMode,
  onChangeColorMode,
  onChangeLanguage,
  onClearHistory,
  onClearFavorites,
}: SettingsPanelProps) {
  const [tab, setTab] = useState<SettingsTab>("appearance");
  const de = language === "de";

  if (!open) return null;

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="settings-backdrop" onClick={handleBackdropClick}>
      <div className="settings-shell" role="dialog" aria-modal="true" aria-label={de ? "Einstellungen" : "Settings"}>
        {/* Header */}
        <div className="settings-head">
          <div>
            <span className="settings-eyebrow">· {de ? "einstellungen" : "settings"} · phase-3</span>
            <h2 className="settings-title">{de ? "Einstellungen" : "Settings"}</h2>
          </div>
          <button className="settings-close" onClick={onClose} type="button" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="settings-body">
          {/* Left nav */}
          <nav className="settings-nav" aria-label="Settings tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`settings-nav-item${tab === t.id ? " active" : ""}`}
                onClick={() => setTab(t.id)}
                type="button"
              >
                {de ? t.de : t.en}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="settings-content">
            {tab === "appearance" && (
              <>
                <div className="settings-section-label">{de ? "· thema" : "· theme"}</div>

                <div className="skin-grid">
                  {themes.map((th) => {
                    const [c1, c2, c3] = THEME_SWATCHES[th.id];
                    return (
                      <button
                        key={th.id}
                        className={`skin-card${theme === th.id ? " active" : ""}`}
                        onClick={() => onChangeTheme(th.id)}
                        type="button"
                      >
                        <div className="swatch-row">
                          <span className="swatch" style={{ background: c1 }} />
                          <span className="swatch" style={{ background: c2 }} />
                          <span className="swatch" style={{ background: c3 }} />
                        </div>
                        <span className="skin-name">{th.name}</span>
                        <span className="skin-desc">{th.description}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="settings-row">
                  <div className="settings-row-meta">
                    <span className="settings-row-label">{de ? "Farbmodus" : "Color mode"}</span>
                    <span className="settings-row-sub">{de ? "System folgt dem OS-Modus" : "System follows OS preference"}</span>
                  </div>
                  <div className="seg-buttons">
                    {colorModes.map((m) => (
                      <button
                        key={m.id}
                        className={`seg-btn${colorMode === m.id ? " active" : ""}`}
                        onClick={() => onChangeColorMode(m.id)}
                        type="button"
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {tab === "language" && (
              <>
                <div className="settings-section-label">{de ? "· sprache / language" : "· language / sprache"}</div>

                <div className="settings-row">
                  <div className="settings-row-meta">
                    <span className="settings-row-label">{de ? "Oberflächensprache" : "UI language"}</span>
                    <span className="settings-row-sub">{de ? "Alle Beschriftungen und Tool-Texte" : "All labels and tool texts"}</span>
                  </div>
                  <div className="seg-buttons">
                    <button className={`seg-btn${language === "de" ? " active" : ""}`} onClick={() => onChangeLanguage("de")} type="button">DE · Deutsch</button>
                    <button className={`seg-btn${language === "en" ? " active" : ""}`} onClick={() => onChangeLanguage("en")} type="button">EN · English</button>
                  </div>
                </div>

                <div className="settings-info-block">
                  <span className="settings-section-label">· {de ? "hinweis" : "note"}</span>
                  <p>{de
                    ? "Tool-Beschreibungen sind sprachgebunden — jedes Tool zeigt eigene DE- und EN-Texte."
                    : "Tool descriptions are language-bound — each tool shows its own DE and EN texts."}</p>
                </div>
              </>
            )}

            {tab === "keyboard" && (
              <>
                <div className="settings-section-label">{de ? "· tastaturkürzel" : "· keyboard shortcuts"}</div>

                <div className="key-grid">
                  <div className="key-row">
                    <span className="key-label">{de ? "Tool-Suche öffnen" : "Open tool search"}</span>
                    <kbd className="key-combo">{modKeyLabel("K")}</kbd>
                  </div>
                  <div className="key-row">
                    <span className="key-label">{de ? "Tool ausführen" : "Run tool"}</span>
                    <kbd className="key-combo">{modKeyLabel("↵")}</kbd>
                  </div>
                  <div className="key-row">
                    <span className="key-label">{de ? "Palette schließen" : "Close palette"}</span>
                    <kbd className="key-combo">Esc</kbd>
                  </div>
                  <div className="key-row key-row-disabled">
                    <span className="key-label">{de ? "Pipe-Editor (Phase 4)" : "Pipe editor (Phase 4)"}</span>
                    <kbd className="key-combo">{modKeyLabel("P")}</kbd>
                  </div>
                </div>

                <div className="settings-info-block">
                  <span className="settings-section-label">· {de ? "plattform" : "platform"}</span>
                  <p>{de
                    ? "Tastaturkürzel werden automatisch an Mac (⌘) oder Windows/Linux (Ctrl) angepasst."
                    : "Keyboard shortcuts adapt automatically to Mac (⌘) or Windows/Linux (Ctrl)."}</p>
                </div>
              </>
            )}

            {tab === "privacy" && (
              <>
                <div className="settings-section-label">{de ? "· datenschutz & verlauf" : "· privacy & history"}</div>

                <div className="settings-row">
                  <div className="settings-row-meta">
                    <span className="settings-row-label">{de ? "Trust Mode" : "Trust mode"}</span>
                    <span className="settings-row-sub">{de ? "0 Server-Roundtrips · 0 Telemetrie · Nur localStorage" : "0 server roundtrips · 0 telemetry · localStorage only"}</span>
                  </div>
                  <span className="settings-badge">{de ? "lokal · aktiv" : "local · active"}</span>
                </div>

                <div className="settings-row">
                  <div className="settings-row-meta">
                    <span className="settings-row-label">{de ? "Verlauf löschen" : "Clear history"}</span>
                    <span className="settings-row-sub">{de ? "Zuletzt verwendete Tools zurücksetzen" : "Reset recently used tools"}</span>
                  </div>
                  <button className="settings-danger-btn" onClick={onClearHistory} type="button">
                    {de ? "Verlauf leeren" : "Clear history"}
                  </button>
                </div>

                <div className="settings-row">
                  <div className="settings-row-meta">
                    <span className="settings-row-label">{de ? "Favoriten löschen" : "Clear favorites"}</span>
                    <span className="settings-row-sub">{de ? "Alle gespeicherten Favoriten entfernen" : "Remove all saved favorites"}</span>
                  </div>
                  <button className="settings-danger-btn" onClick={onClearFavorites} type="button">
                    {de ? "Favoriten leeren" : "Clear favorites"}
                  </button>
                </div>

                <div className="settings-info-block">
                  <span className="settings-section-label">· localStorage keys</span>
                  <div className="key-grid key-grid-mono">
                    {["itsweber:theme", "itsweber:color-mode", "itsweber:language", "itsweber:favorites", "itsweber:recent"].map((k) => (
                      <div key={k} className="key-row">
                        <span className="key-label">{k}</span>
                        <span className="key-combo" style={{ fontSize: "10px" }}>{de ? "lokal" : "local"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
