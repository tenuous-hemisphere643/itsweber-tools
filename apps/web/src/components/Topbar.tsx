import { Moon, Settings, Sun } from "lucide-react";
import { type ColorMode, type ThemeId } from "@itsweber/ui";
import type { Language } from "../lib/copy";
import { modKeyLabel } from "../lib/platform";
import type { Page } from "../App";

function BrandMark() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="brand-mark-svg">
      <rect className="bm-frame" x="2.5" y="3.5" width="19" height="17" rx="1.5" />
      <line className="bm-sep" x1="2.5" y1="7.5" x2="21.5" y2="7.5" />
      <circle className="bm-dot" cx="4.5" cy="5.5" r="0.5" />
      <circle className="bm-dot" cx="6.4" cy="5.5" r="0.5" />
      <circle className="bm-dot" cx="8.3" cy="5.5" r="0.5" />
      <path className="bm-chev" d="M 8 12 L 11.5 15 L 8 18" />
      <rect className="bm-cursor" x="13.5" y="14.5" width="3.5" height="2" />
    </svg>
  );
}

interface TopbarProps {
  page: Page;
  onChangePage: (page: Page) => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  theme: ThemeId;
  onChangeTheme: (theme: ThemeId) => void;
  colorMode: ColorMode;
  onChangeColorMode: (mode: ColorMode) => void;
  onOpenPalette: () => void;
  onOpenSettings: () => void;
  copy: { navTools: string; navAbout: string };
  historyCount: number;
  pipesCount: number;
}

export function Topbar({
  page,
  onChangePage,
  language,
  onChangeLanguage,
  colorMode,
  onChangeColorMode,
  onOpenPalette,
  onOpenSettings,
  historyCount,
  pipesCount,
}: TopbarProps) {
  const de = language === "de";

  return (
    <header className="topbar">
      {/* Brand */}
      <button className="brand-lockup" onClick={() => onChangePage("hub")} type="button" aria-label="It's Weber Tools">
        <BrandMark />
        <span className="brand-wordmark">
          <strong className="brand-name">
            It&rsquo;s Weber <span className="brand-tools">Tools</span>
          </strong>
          <small className="brand-sub">· CONTAINER-READY IT WORKBENCH</small>
        </span>
      </button>

      {/* Nav */}
      <nav className="tb-nav" aria-label="Primary">
        <button
          className={page === "tools" ? "tb-nav-item active" : "tb-nav-item"}
          onClick={() => onChangePage("tools")}
          type="button"
        >
          {de ? "TOOLS" : "TOOLS"}
        </button>
        <button
          className={page === "pipes" ? "tb-nav-item active" : "tb-nav-item"}
          onClick={() => onChangePage("pipes")}
          type="button"
        >
          {de ? "PIPES" : "PIPES"}
          {pipesCount > 0 && <span className="tb-nav-badge">{pipesCount}</span>}
        </button>
        <button
          className={page === "history" ? "tb-nav-item active" : "tb-nav-item"}
          onClick={() => onChangePage("history")}
          type="button"
        >
          {de ? "VERLAUF" : "HISTORY"}
          {historyCount > 0 && <span className="tb-nav-badge">{historyCount}</span>}
        </button>
        <button
          className={page === "about" ? "tb-nav-item active" : "tb-nav-item"}
          onClick={() => onChangePage("about")}
          type="button"
        >
          {de ? "ÜBER" : "ABOUT"}
        </button>
      </nav>

      {/* Cmd+K search box */}
      <button className="tb-search" onClick={onOpenPalette} type="button" aria-label="Open command palette">
        <span className="tb-search-icon">⌕</span>
        <span className="tb-search-placeholder">
          {de ? "Tools, Pipes, Aktionen suchen…" : "Search tools, pipes, actions…"}
        </span>
        <kbd className="tb-search-kbd">{modKeyLabel("K")}</kbd>
      </button>

      {/* Right tools */}
      <div className="tb-right">
        <button
          className="tb-icon-btn"
          onClick={() => onChangeLanguage(language === "de" ? "en" : "de")}
          type="button"
          aria-label="Toggle language"
        >
          {language.toUpperCase()}
        </button>
        <button
          className={colorMode === "dark" ? "tb-icon-btn active" : "tb-icon-btn"}
          onClick={() => onChangeColorMode(colorMode === "dark" ? "light" : "dark")}
          type="button"
          aria-label="Toggle dark mode"
        >
          {colorMode === "dark" ? <Moon size={15} /> : <Sun size={15} />}
        </button>
        <button className="tb-icon-btn" type="button" aria-label="Settings" onClick={onOpenSettings}>
          <Settings size={15} />
        </button>
      </div>
    </header>
  );
}
