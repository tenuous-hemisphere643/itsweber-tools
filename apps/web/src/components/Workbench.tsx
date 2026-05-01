import { Clipboard, Download, Heart, ImagePlus, Play, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import type { ToolDefinition } from "@itsweber/toolkit";
import type { Language } from "../lib/copy";
import { modKeyLabel } from "../lib/platform";
import {
  categoryLabel,
  toolDescription,
  toolExplanation,
  toolTitle,
  toolUseCases,
} from "../lib/tool-i18n";

interface WorkbenchProps {
  language: Language;
  tool: ToolDefinition;
  input: string;
  onChangeInput: (value: string) => void;
  output: string;
  downloadUrl?: string;
  downloadName?: string;
  error: string;
  onRun: () => void;
  onLoadExample: () => void;
  onCopyOutput: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  copy: {
    run: string;
    example: string;
    copy: string;
    input: string;
    output: string;
    privacy: string;
    browserApi: string;
    empty: string;
  };
}

function ImageDropZone({
  onFile,
  de,
  preview,
  onClear,
  extraParams,
  onChangeParams,
  placeholder,
}: {
  onFile: (dataUrl: string) => void;
  de: boolean;
  preview: string | null;
  onClear: () => void;
  extraParams: string;
  onChangeParams: (v: string) => void;
  placeholder: string;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") onFile(result);
    };
    reader.readAsDataURL(file);
  }, [onFile]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) readFile(file);
  }, [readFile]);

  return (
    <div className="img-drop-wrap">
      {preview ? (
        <div className="img-drop-preview">
          <img src={preview} alt="preview" className="img-drop-thumb" />
          <button className="img-drop-clear" onClick={onClear} type="button" title={de ? "Entfernen" : "Clear"}>
            <X size={14} />
          </button>
        </div>
      ) : (
        <label
          className={`img-drop-zone${dragging ? " dragging" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <ImagePlus size={28} strokeWidth={1.5} />
          <span>{de ? "Bild hierher ziehen oder klicken" : "Drop image here or click to upload"}</span>
          <span className="img-drop-hint">PNG, JPG, WebP, GIF, SVG</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="img-drop-input"
            aria-label={de ? "Bild hochladen" : "Upload image"}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) readFile(file);
            }}
          />
        </label>
      )}
      {/* Optional params (e.g. quality=80 or "16:9") */}
      <textarea
        className="wb-textarea img-drop-params"
        value={extraParams}
        onChange={(e) => onChangeParams(e.target.value)}
        placeholder={placeholder}
        rows={2}
      />
    </div>
  );
}

export function Workbench({
  language,
  tool,
  input,
  onChangeInput,
  output,
  downloadUrl,
  downloadName,
  error,
  onRun,
  onLoadExample,
  onCopyOutput,
  isFavorite,
  onToggleFavorite,
  copy,
}: WorkbenchProps) {
  const de = language === "de";
  const privacyLabel = tool.privacyMode === "browser-api" ? copy.browserApi : copy.privacy;
  const isImageTool = tool.inputMode === "image-drop";

  // For image tools: split input into data URL + extra params
  const dataUrlInInput = isImageTool ? (input.split("\n").find(l => l.trim().startsWith("data:image/")) ?? null) : null;
  const extraParamsInInput = isImageTool
    ? input.split("\n").filter(l => !l.trim().startsWith("data:image/")).join("\n")
    : input;

  function handleImageFile(dataUrl: string) {
    const params = input.split("\n").filter(l => !l.trim().startsWith("data:image/")).join("\n");
    onChangeInput(params ? `${params}\n${dataUrl}` : dataUrl);
  }

  function handleClearImage() {
    const params = input.split("\n").filter(l => !l.trim().startsWith("data:image/")).join("\n");
    onChangeInput(params);
  }

  function handleParamsChange(params: string) {
    const existing = input.split("\n").find(l => l.trim().startsWith("data:image/")) ?? "";
    onChangeInput(existing ? `${params}\n${existing}` : params);
  }

  return (
    <section className="workbench" aria-live="polite">
      {/* Head */}
      <div className="wb-head">
        <div>
          <span className="wb-meta-l">{categoryLabel(tool.category, language)} · {tool.id}</span>
          <h1 className="wb-title">{toolTitle(tool, language)}</h1>
        </div>
        <div className="wb-actions">
          <button
            className={isFavorite ? "tb-icon-btn active" : "tb-icon-btn"}
            onClick={onToggleFavorite}
            title={de ? "Favorit" : "Favorite"}
            type="button"
          >
            <Heart size={16} />
          </button>
        </div>
      </div>

      {/* Trust strip */}
      <div className="wb-trust-strip">
        <span><strong>⬡</strong> {privacyLabel}</span>
        <span className="wb-trust-audit">· {tool.privacyMode} · 0 server-roundtrips</span>
      </div>

      {/* Description card */}
      <div className="wb-desc-card">
        <div className="wb-desc-head">
          <h3>{de ? "Was macht dieses Tool?" : "What does this tool do?"}</h3>
          <span className="wb-desc-lang">{language.toUpperCase()}</span>
        </div>
        <p className="wb-desc-what">{toolDescription(tool, language)}</p>
        <p className="wb-desc-how">{toolExplanation(tool, language)}</p>
        {toolUseCases(tool, language).length > 0 && (
          <div className="wb-uses">
            <h4>{de ? "Anwendungsfälle" : "Use cases"}</h4>
            <ul>
              {toolUseCases(tool, language).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* IO grid */}
      <div className="wb-io">
        <div className="wb-field wb-field-input">
          <div className="wb-field-head">
            <span className="wb-field-label">{copy.input}</span>
            {!isImageTool && (
              <button className="wb-field-action" onClick={onLoadExample} type="button">
                {copy.example}
              </button>
            )}
          </div>
          {isImageTool ? (
            <ImageDropZone
              onFile={handleImageFile}
              de={de}
              preview={dataUrlInInput}
              onClear={handleClearImage}
              extraParams={extraParamsInInput}
              onChangeParams={handleParamsChange}
              placeholder={tool.placeholder}
            />
          ) : (
            <textarea
              className="wb-textarea"
              value={input}
              onChange={(e) => onChangeInput(e.target.value)}
              placeholder={tool.placeholder}
            />
          )}
          <span className="wb-field-corner">{de ? "EINGABE" : "INPUT"}</span>
        </div>

        <div className="wb-field wb-field-output">
          <div className="wb-field-head">
            <span className="wb-field-label">{copy.output}</span>
            <button className="wb-field-action" onClick={onCopyOutput} type="button">
              <Clipboard size={13} /> {copy.copy}
            </button>
          </div>
          <pre className={`wb-output${error ? " wb-output-error" : ""}`}>
            {error || output || copy.empty}
          </pre>
          <span className="wb-field-corner">{de ? "AUSGABE" : "OUTPUT"}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="wb-action-row">
        <button className="wb-btn wb-btn-primary" onClick={onRun} type="button">
          <Play size={15} />
          {copy.run}
          <kbd className="wb-btn-kbd">{modKeyLabel("↵")}</kbd>
        </button>
        {downloadUrl && (
          <a
            className="wb-btn wb-btn-secondary"
            href={downloadUrl}
            download={downloadName ?? "download"}
          >
            <Download size={15} />
            {de ? "Herunterladen" : "Download"}
          </a>
        )}
      </div>
    </section>
  );
}
