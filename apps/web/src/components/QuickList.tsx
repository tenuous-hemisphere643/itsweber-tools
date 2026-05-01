import { tools, type ToolDefinition } from "@itsweber/toolkit";
import type { Language } from "../lib/copy";
import { toolTitle } from "../lib/tool-i18n";

interface QuickListProps {
  ids: string[];
  language: Language;
  onSelect: (tool: ToolDefinition) => void;
  title: string;
}

export function QuickList({ ids, language, onSelect, title }: QuickListProps) {
  const selected = ids
    .map((id) => tools.find((tool) => tool.id === id))
    .filter((tool): tool is ToolDefinition => Boolean(tool));
  if (!selected.length) {
    return null;
  }
  return (
    <section className="quick-list">
      <h3>{title}</h3>
      <div>
        {selected.map((tool) => (
          <button key={tool.id} onClick={() => onSelect(tool)} type="button">
            {toolTitle(tool, language)}
          </button>
        ))}
      </div>
    </section>
  );
}
