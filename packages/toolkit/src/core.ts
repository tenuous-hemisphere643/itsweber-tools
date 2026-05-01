import type { ToolDefinition, ToolResult } from "./types";

export type ToolRunner = (input: string) => Promise<ToolResult> | ToolResult;

export interface ToolModule {
  meta: ToolDefinition;
  run: ToolRunner;
}

type ToolMetaInput = Omit<ToolDefinition, "useCases" | "useCasesDe"> & {
  useCases?: string[];
  useCasesDe?: string[];
};

const DEFAULT_USE_CASES = ["Daily IT work", "Documentation", "Troubleshooting"];
const DEFAULT_USE_CASES_DE = ["Tägliche IT-Arbeit", "Dokumentation", "Fehlersuche"];

export function defineTool(input: ToolMetaInput & { run: ToolRunner }): ToolModule {
  const { run, useCases, useCasesDe, ...rest } = input;
  return {
    meta: {
      ...rest,
      useCases: useCases ?? DEFAULT_USE_CASES,
      useCasesDe: useCasesDe ?? DEFAULT_USE_CASES_DE,
    },
    run,
  };
}
