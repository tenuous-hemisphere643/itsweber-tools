import type { ToolDefinition } from "@itsweber/toolkit";
import { categoryLabelsDe, type Language } from "./copy";

export function toolTitle(tool: ToolDefinition, language: Language): string {
  return language === "de" ? tool.titleDe : tool.title;
}

export function toolDescription(tool: ToolDefinition, language: Language): string {
  return language === "de" ? tool.descriptionDe : tool.description;
}

export function toolExplanation(tool: ToolDefinition, language: Language): string {
  return language === "de" ? tool.explanationDe : tool.explanation;
}

export function toolUseCases(tool: ToolDefinition, language: Language): string[] {
  return language === "de" ? tool.useCasesDe : tool.useCases;
}

export function categoryLabel(category: string, language: Language): string {
  return language === "de" ? (categoryLabelsDe[category] ?? category) : category;
}
