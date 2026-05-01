import { categories, tools as allTools, type ToolCategory, type ToolDefinition } from "@itsweber/toolkit";
import type { Language } from "../lib/copy";
import { modKeyLabel } from "../lib/platform";
import { categoryLabel, toolTitle } from "../lib/tool-i18n";

interface DiscoveryHubProps {
  language: Language;
  favorites: string[];
  recent: string[];
  onSelectTool: (tool: ToolDefinition) => void;
  onOpenPalette: () => void;
  onSelectCategory: (cat: ToolCategory) => void;
}

const CATEGORY_SIZES: Record<string, string> = {
  Converter: "large featured",
  "ItsWeber Ops": "tall",
  Development: "medium",
  Crypto: "medium",
  Network: "small",
  Web: "small",
  Text: "small",
  Data: "small",
};

const CATEGORY_DESC: Record<string, { de: string; en: string }> = {
  Converter: {
    de: `Encoding, Datenformate, Zeit, Farben — die größte Kategorie der Werkbank. ${modKeyLabel("K")} findet alles direkt.`,
    en: `Encoding, data formats, time, colors — the largest category. ${modKeyLabel("K")} finds everything instantly.`,
  },
  "ItsWeber Ops": {
    de: "Operator-First: Docker, Unraid, Nginx, .htaccess. Was andere Toolkits ignorieren.",
    en: "Operator-First: Docker, Unraid, Nginx, .htaccess. What other toolkits ignore.",
  },
  Development: {
    de: "JSON, Regex, SQL, Markdown — der DevTools-Kern.",
    en: "JSON, Regex, SQL, Markdown — the DevTools core.",
  },
  Crypto: {
    de: "UUID, HMAC, JWT — alles Web-Crypto-API, niemals serverseitig.",
    en: "UUID, HMAC, JWT — Web Crypto API only, never server-side.",
  },
};

const readyTools = allTools.filter((t) => t.status === "ready");
const totalReady = readyTools.length;

function catIndex(cat: ToolCategory) {
  return String(categories.indexOf(cat) + 1).padStart(2, "0");
}

function qlItem(
  tool: ToolDefinition | undefined,
  lang: Language,
  type: "fav" | "recent",
  onClick: () => void,
  meta?: string,
) {
  if (!tool) return null;
  return (
    <button key={tool.id} className={`ql-item${type === "fav" ? " fav" : ""}`} onClick={onClick} type="button">
      {toolTitle(tool, lang)}
      <span className="ql-id">{tool.id}</span>
      {type === "fav" ? <span className="ql-heart">♥</span> : <span className="ql-ago">{meta}</span>}
    </button>
  );
}

export function DiscoveryHub({
  language: lang,
  favorites,
  recent,
  onSelectTool,
  onOpenPalette,
  onSelectCategory,
}: DiscoveryHubProps) {
  const de = lang === "de";

  function byId(id: string) {
    return allTools.find((t) => t.id === id);
  }

  const pinnedTools = favorites.slice(0, 6).map(byId).filter(Boolean) as ToolDefinition[];
  const recentTools = recent.slice(0, 6).map(byId).filter(Boolean) as ToolDefinition[];
  const lastTool = byId(recent[0] ?? "json-format") ?? allTools[0];

  return (
    <div className="discovery-hub">
      {/* HERO + STATS */}
      <section className="dh-hero">
        <div className="hero-card">
          <span className="dh-eyebrow">
            · discovery hub · {totalReady} tools · {categories.length} {de ? "kategorien" : "categories"}
          </span>
          <h1>
            {de ? (
              <>Was möchtest du<br /><em>jetzt</em> bauen<span className="punct">?</span></>
            ) : (
              <>What do you want<br />to <em>build</em> now<span className="punct">?</span></>
            )}
          </h1>
          <p className="dh-lede">
            {de
              ? <>Tippe <kbd>{modKeyLabel("K")}</kbd> für direkte Suche, wähle eine Kategorie — oder springe per Pinned/Recent in dein letztes Tool. Alles lokal, alles offline-fähig.</>
              : <>Press <kbd>{modKeyLabel("K")}</kbd> to search, pick a category — or jump to your last tool via Pinned/Recent. All local, all offline-capable.</>}
          </p>
          <div className="dh-quick-actions">
            <button className="dh-action brass" onClick={() => onSelectTool(lastTool)} type="button">
              <span className="verb">▶</span>
              {de ? `Letztes Tool (${lastTool.id})` : `Last tool (${lastTool.id})`}
            </button>
            <button className="dh-action" onClick={onOpenPalette} type="button">
              <span className="verb">⌕</span>
              {de ? `Tool-Suche · ${modKeyLabel("K")}` : `Search · ${modKeyLabel("K")}`}
            </button>
          </div>
        </div>

        <div className="dh-stat-stack">
          <div className="stat-card">
            <span className="stat-label">· {de ? "tools verfügbar" : "tools available"}</span>
            <span className="stat-value">{totalReady}<em>· ready</em></span>
            <span className="stat-sub">{categories.length} {de ? "Kategorien" : "categories"}</span>
            <div className="stat-bar"><i style={{ width: "100%" }} /></div>
          </div>
          <div className="stat-card">
            <span className="stat-label">· {de ? "deine favoriten" : "your favorites"}</span>
            <span className="stat-value">{favorites.length}<em>· pinned</em></span>
            <span className="stat-sub">{de ? "Klick öffnet direkt" : "click to open directly"}</span>
            <div className="stat-bar"><i className="brass" style={{ width: `${Math.min(favorites.length / 6, 1) * 100}%` }} /></div>
          </div>
          <div className="stat-card">
            <span className="stat-label">· trust mode</span>
            <span className="stat-value">local<em>· only</em></span>
            <span className="stat-sub">0 Server-Roundtrips · 0 Telemetry</span>
            <div className="stat-bar"><i style={{ width: "100%" }} /></div>
          </div>
        </div>
      </section>

      {/* PINNED + RECENT */}
      <section className="dh-quick-rows">
        <div className="dh-ql-card">
          <div className="ql-head">
            <h3>{de ? "Favoriten" : "Pinned"}</h3>
            <span className="ql-codename">· {de ? "deine gespeicherten" : "your saved tools"}</span>
          </div>
          <div className="ql-grid">
            {pinnedTools.length > 0
              ? pinnedTools.map((t) => qlItem(t, lang, "fav", () => onSelectTool(t)))
              : <span className="ql-empty">{de ? "Noch keine Favoriten — klick ♥ in einem Tool." : "No favorites yet — click ♥ in a tool."}</span>}
          </div>
        </div>

        <div className="dh-ql-card">
          <div className="ql-head">
            <h3>Recent</h3>
            <span className="ql-codename">· {de ? "letzte tools" : "last tools"}</span>
          </div>
          <div className="ql-grid">
            {recentTools.length > 0
              ? recentTools.map((t) => qlItem(t, lang, "recent", () => onSelectTool(t)))
              : <span className="ql-empty">{de ? "Noch keine History." : "No history yet."}</span>}
          </div>
        </div>
      </section>

      {/* CATEGORIES BENTO */}
      <div className="dh-sect-h">
        <span className="dh-sect-num">· 02</span>
        <h2>{de ? <>Werkzeug<em>kategorien.</em></> : <>Tool<em> categories.</em></>}</h2>
        <span className="dh-sect-meta">↘ {categories.length} cluster</span>
      </div>

      <section className="dh-cat-bento">
        {categories.map((cat) => {
          const size = CATEGORY_SIZES[cat] ?? "small";
          const desc = CATEGORY_DESC[cat];
          const catTools = allTools.filter((t) => t.category === cat);
          const readyCat = catTools.filter((t) => t.status === "ready");
          return (
            <button
              key={cat}
              className={`cat-card ${size}`}
              onClick={() => onSelectCategory(cat)}
              type="button"
            >
              <span className="cat-id">· cat-{catIndex(cat)}{size.includes("featured") ? " · featured" : ""}</span>
              <h3>{categoryLabel(cat, lang)}</h3>
              <span className="cat-count">{readyCat.length} tools</span>
              {desc && <p className="cat-desc">{desc[lang]}</p>}
              {cat === "ItsWeber Ops" && (
                <div className="cat-illu">
                  {catTools.slice(0, 5).map((t) => (
                    <div key={t.id} className="cat-illu-row">
                      <span>{t.id}</span>
                      <span className="v">{t.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </section>
    </div>
  );
}
