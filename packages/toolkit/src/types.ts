export type ToolCategory =
  | "Crypto"
  | "Converter"
  | "Web"
  | "Images and QR"
  | "Development"
  | "Network"
  | "Math"
  | "Measurement"
  | "Text"
  | "Data"
  | "ItsWeber Ops";

export type ToolStatus = "ready";
export type PrivacyMode = "local-only" | "browser-api" | "network-fetch";
/** UI input mode: "text" = textarea (default), "image-drop" = drag-and-drop image uploader + params textarea */
export type InputMode = "text" | "image-drop";

export interface ToolDefinition {
  id: string;
  title: string;
  titleDe: string;
  description: string;
  descriptionDe: string;
  explanation: string;
  explanationDe: string;
  useCases: string[];
  useCasesDe: string[];
  category: ToolCategory;
  keywords: string[];
  status: ToolStatus;
  privacyMode: PrivacyMode;
  placeholder: string;
  example: string;
  inputMode?: InputMode;
}

export interface ToolResult {
  output: string;
  /** Raw value for pipe chaining — omits human-readable metadata lines (e.g. "Modus:", "Länge:").
   *  Falls back to `output` when not set. Tools that add metadata headers MUST set this. */
  rawOutput?: string;
  meta?: string;
  /** Base64 data URL for binary downloads (images, PDFs) */
  downloadUrl?: string;
  /** Suggested filename for download */
  downloadName?: string;
}

// ── History ──────────────────────────────────────────────────────────────────

export interface HistoryEntry {
  id: string;
  toolId: string;
  toolTitle: string;
  input: string;
  output: string;
  error?: string;
  ts: number;
}

// ── Pipes ─────────────────────────────────────────────────────────────────────

export type PipeInputMode = "chain" | "static";

export interface PipeStep {
  id: string;
  toolId: string;
  /** "chain" = use previous step's output; "static" = use staticInput */
  inputMode: PipeInputMode;
  staticInput: string;
  /** Optional text prepended to chained input */
  prefix: string;
}

export interface Pipe {
  id: string;
  name: string;
  steps: PipeStep[];
  createdAt: number;
  updatedAt: number;
}

export interface PipeStepResult {
  stepId: string;
  toolId: string;
  toolTitle: string;
  input: string;
  output: string;
  rawOutput?: string;
  error?: string;
  durationMs: number;
}
