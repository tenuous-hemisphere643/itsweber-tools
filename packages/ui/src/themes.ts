export type ThemeId = "itsweber-petrol" | "graphite-command" | "clean-studio";
export type ColorMode = "system" | "light" | "dark";

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
}

export const themes: ThemeDefinition[] = [
  {
    id: "itsweber-petrol",
    name: "ItsWeber Petrol",
    description: "Official petrol and cyan signature for the product default.",
  },
  {
    id: "graphite-command",
    name: "Graphite Command",
    description: "Dense command-center surfaces for infrastructure work.",
  },
  {
    id: "clean-studio",
    name: "Clean Studio",
    description: "Bright professional workspace for documentation-heavy tasks.",
  },
];

export const colorModes: Array<{ id: ColorMode; name: string }> = [
  { id: "system", name: "System" },
  { id: "light", name: "Light" },
  { id: "dark", name: "Dark" },
];
