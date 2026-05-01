import type { ToolCategory, ToolDefinition } from "@itsweber/toolkit";
import type { Language } from "../lib/copy";
import { categoryLabel, toolDescription, toolTitle } from "../lib/tool-i18n";

interface CategoryGridProps {
  category: ToolCategory | "All";
  tools: ToolDefinition[];
  language: Language;
  onSelectTool: (tool: ToolDefinition) => void;
}

export function CategoryGrid({ category, tools, language, onSelectTool }: CategoryGridProps) {
  const de = language === "de";
  const title = category === "All"
    ? (de ? "Alle Tools" : "All Tools")
    : categoryLabel(category, language);

  return (
    <div className="cat-grid-view">
      <div className="cat-grid-header">
        <h2 className="cat-grid-title">{title}</h2>
        <span className="cat-grid-count">{tools.length} {de ? "Tools" : "tools"}</span>
      </div>
      <div className="cat-tool-grid">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className="cat-tool-card"
            onClick={() => onSelectTool(tool)}
            type="button"
          >
            <span className="cat-tool-card-name">{toolTitle(tool, language)}</span>
            <span className="cat-tool-card-desc">{toolDescription(tool, language)}</span>
            <span className="cat-tool-card-id">{tool.id}</span>
            {tool.privacyMode === "network-fetch" && (
              <span className="cat-tool-card-badge network">network</span>
            )}
          </button>
        ))}
        {tools.length === 0 && (
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
            {de ? "Keine Tools gefunden." : "No tools found."}
          </span>
        )}
      </div>
    </div>
  );
}
