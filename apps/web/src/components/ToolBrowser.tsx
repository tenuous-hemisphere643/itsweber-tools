import { Search } from "lucide-react";
import { categories, type ToolCategory, type ToolDefinition } from "@itsweber/toolkit";
import type { Language } from "../lib/copy";
import { categoryLabel, toolDescription, toolTitle } from "../lib/tool-i18n";
import { QuickList } from "./QuickList";

interface ToolBrowserProps {
  language: Language;
  query: string;
  onChangeQuery: (query: string) => void;
  searchPlaceholder: string;
  allLabel: string;
  readyLabel: string;
  favoritesLabel: string;
  recentLabel: string;
  activeCategory: ToolCategory | "All";
  onChangeCategory: (category: ToolCategory | "All") => void;
  filteredTools: ToolDefinition[];
  queryFilteredTools: ToolDefinition[];
  selectedId: string;
  onSelectTool: (tool: ToolDefinition) => void;
  favorites: string[];
  recent: string[];
}

export function ToolBrowser({
  language,
  query,
  onChangeQuery,
  searchPlaceholder,
  allLabel,
  readyLabel,
  favoritesLabel,
  recentLabel,
  activeCategory,
  onChangeCategory,
  filteredTools,
  queryFilteredTools,
  selectedId,
  onSelectTool,
  favorites,
  recent,
}: ToolBrowserProps) {
  const de = language === "de";

  return (
    <aside className="sidebar">
      {/* Search */}
      <label className="sb-search">
        <Search size={14} />
        <input
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
          placeholder={searchPlaceholder}
        />
      </label>

      {/* Category filter */}
      <nav className="sb-cats" aria-label="Categories">
        <h4 className="sb-section-label">{de ? "Kategorien" : "Categories"}</h4>
        {(["All", ...categories] as (ToolCategory | "All")[]).map((cat) => {
          const count = cat === "All" ? queryFilteredTools.length : queryFilteredTools.filter((t) => t.category === cat).length;
          return (
            <button
              key={cat}
              className={`sb-cat-item${activeCategory === cat ? " active" : ""}`}
              onClick={() => onChangeCategory(cat)}
              type="button"
            >
              <span>{cat === "All" ? allLabel : categoryLabel(cat, language)}</span>
              <span className="sb-cat-count">{count}</span>
            </button>
          );
        })}
      </nav>

      {/* Pinned / Recent quick access */}
      {(favorites.length > 0 || recent.length > 0) && (
        <div className="sb-quick">
          <QuickList title={favoritesLabel} ids={favorites} language={language} onSelect={onSelectTool} />
          <QuickList title={recentLabel} ids={recent} language={language} onSelect={onSelectTool} />
        </div>
      )}

      {/* Tool list */}
      <div className="sb-tool-list">
        <h4 className="sb-section-label">
          {de ? "Tools" : "Tools"} <span className="sb-cat-count">{filteredTools.length}</span>
        </h4>
        {filteredTools.map((tool) => (
          <button
            key={tool.id}
            className={`sb-tool-item${tool.id === selectedId ? " active" : ""}`}
            onClick={() => onSelectTool(tool)}
            type="button"
          >
            <span className="sb-tool-name">{toolTitle(tool, language)}</span>
            <span className="sb-tool-desc">{toolDescription(tool, language)}</span>
            <span className="sb-tool-id">{tool.id}</span>
          </button>
        ))}
        {filteredTools.length === 0 && (
          <span className="sb-empty">{de ? "Kein Treffer." : "No results."}</span>
        )}
      </div>

      {/* Footer label */}
      <div className="sb-foot">
        <span>{readyLabel}: {filteredTools.filter((t) => t.status === "ready").length}</span>
      </div>
    </aside>
  );
}
