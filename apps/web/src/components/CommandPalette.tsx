import { useEffect, useRef } from "react";
import { Command } from "cmdk";
import type { ToolDefinition } from "@itsweber/toolkit";
import type { Language } from "../lib/copy";
import { modKeyLabel } from "../lib/platform";
import { toolTitle, toolDescription } from "../lib/tool-i18n";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  tools: ToolDefinition[];
  language: Language;
  onSelectTool: (tool: ToolDefinition) => void;
}

export function CommandPalette({ open, onClose, tools, language, onSelectTool }: CommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10);
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function pick(tool: ToolDefinition) {
    onSelectTool(tool);
    onClose();
  }

  const readyTools = tools.filter((t) => t.status === "ready");
  const categories = [...new Set(readyTools.map((t) => t.category))].sort();

  return (
    <div className="palette-backdrop" onClick={onClose} aria-modal="true" role="dialog" aria-label="Command palette">
      <div className="palette-shell" onClick={(e) => e.stopPropagation()}>
        <div className="palette-header">
          <span className="palette-eyebrow">{modKeyLabel("K")} · TOOL SUCHEN</span>
          <kbd className="palette-esc" onClick={onClose}>ESC</kbd>
        </div>

        <Command className="palette-cmd" shouldFilter>
          <Command.Input
            ref={inputRef}
            className="palette-input"
            placeholder={language === "de" ? "Tool suchen …" : "Search tools …"}
          />
          <Command.List className="palette-list">
            <Command.Empty className="palette-empty">
              {language === "de" ? "Kein Treffer." : "No results."}
            </Command.Empty>

            {categories.map((cat) => {
              const catTools = readyTools.filter((t) => t.category === cat);
              return (
                <Command.Group key={cat} heading={cat} className="palette-group">
                  {catTools.map((tool) => (
                    <Command.Item
                      key={tool.id}
                      value={`${tool.title} ${tool.titleDe ?? ""} ${tool.keywords.join(" ")}`}
                      className="palette-item"
                      onSelect={() => pick(tool)}
                    >
                      <span className="palette-item-name">{toolTitle(tool, language)}</span>
                      <span className="palette-item-desc">{toolDescription(tool, language)}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              );
            })}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
