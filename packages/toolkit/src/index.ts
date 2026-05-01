import type { ToolDefinition, ToolResult } from "./types";
import type { ToolModule } from "./core";

const modules = import.meta.glob<ToolModule>(["./tools/*.ts", "!./tools/*.test.ts"], { eager: true, import: "default" });

const registry: Record<string, ToolModule> = {};
for (const path in modules) {
  const tool = modules[path];
  if (registry[tool.meta.id]) {
    throw new Error(`Duplicate tool id: ${tool.meta.id} (registered from ${path})`);
  }
  registry[tool.meta.id] = tool;
}

const sortedTools = Object.values(registry)
  .map((module) => module.meta)
  .sort((a, b) => a.id.localeCompare(b.id));

export const tools: ToolDefinition[] = sortedTools;
export const categories = Array.from(new Set(tools.map((tool) => tool.category)));

export async function runTool(toolId: string, input: string): Promise<ToolResult> {
  const tool = registry[toolId];
  if (!tool) {
    return {
      output: "This tool is not available in this build.",
      meta: "Unavailable",
    };
  }
  return tool.run(input);
}

export { slugify } from "./shared";
export { defineTool } from "./core";
export type { ToolModule, ToolRunner } from "./core";
export type { HistoryEntry, InputMode, Pipe, PipeInputMode, PipeStep, PipeStepResult, PrivacyMode, ToolCategory, ToolDefinition, ToolResult, ToolStatus } from "./types";
