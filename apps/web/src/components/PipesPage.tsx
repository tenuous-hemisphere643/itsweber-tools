import { useState } from "react";
import { runTool, tools, type Pipe, type PipeStep, type PipeStepResult, type ToolDefinition } from "@itsweber/toolkit";
import type { Language } from "../lib/copy";

interface PipesPageProps {
  language: Language;
  pipes: Pipe[];
  onChangePipes: (updater: (prev: Pipe[]) => Pipe[]) => void;
  onSelectTool: (tool: ToolDefinition) => void;
}

function newStep(): PipeStep {
  return {
    id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    toolId: tools[0]?.id ?? "",
    inputMode: "chain",
    staticInput: "",
    prefix: "",
  };
}

function newPipe(de: boolean): Pipe {
  const now = Date.now();
  return {
    id: `pipe-${now}`,
    name: de ? `Neue Pipe ${new Date(now).toLocaleTimeString("de")}` : `New Pipe ${new Date(now).toLocaleTimeString("en")}`,
    steps: [newStep()],
    createdAt: now,
    updatedAt: now,
  };
}

function trunc(s: string, max = 100) {
  return s.length > max ? s.slice(0, max) + "…" : s;
}

export function PipesPage({ language, pipes, onChangePipes, onSelectTool }: PipesPageProps) {
  const de = language === "de";
  const [activePipeId, setActivePipeId] = useState<string | null>(pipes[0]?.id ?? null);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<PipeStepResult[] | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  const activePipe = pipes.find((p) => p.id === activePipeId) ?? null;

  function savePipe(updated: Pipe) {
    onChangePipes((prev) =>
      prev.map((p) => (p.id === updated.id ? { ...updated, updatedAt: Date.now() } : p))
    );
  }

  function createPipe() {
    const p = newPipe(de);
    onChangePipes((prev) => [p, ...prev]);
    setActivePipeId(p.id);
    setResults(null);
    setRunError(null);
  }

  function deletePipe(id: string) {
    onChangePipes((prev) => prev.filter((p) => p.id !== id));
    if (activePipeId === id) {
      const remaining = pipes.filter((p) => p.id !== id);
      setActivePipeId(remaining[0]?.id ?? null);
    }
    setResults(null);
  }

  function updateName(name: string) {
    if (!activePipe) return;
    savePipe({ ...activePipe, name });
  }

  function addStep() {
    if (!activePipe) return;
    savePipe({ ...activePipe, steps: [...activePipe.steps, newStep()] });
  }

  function removeStep(stepId: string) {
    if (!activePipe) return;
    savePipe({ ...activePipe, steps: activePipe.steps.filter((s) => s.id !== stepId) });
  }

  function moveStep(stepId: string, dir: -1 | 1) {
    if (!activePipe) return;
    const idx = activePipe.steps.findIndex((s) => s.id === stepId);
    if (idx < 0) return;
    const next = idx + dir;
    if (next < 0 || next >= activePipe.steps.length) return;
    const steps = [...activePipe.steps];
    [steps[idx], steps[next]] = [steps[next]!, steps[idx]!];
    savePipe({ ...activePipe, steps });
  }

  function updateStep(stepId: string, patch: Partial<PipeStep>) {
    if (!activePipe) return;
    savePipe({
      ...activePipe,
      steps: activePipe.steps.map((s) => (s.id === stepId ? { ...s, ...patch } : s)),
    });
  }

  async function runPipe() {
    if (!activePipe || activePipe.steps.length === 0) return;
    setRunning(true);
    setResults(null);
    setRunError(null);
    const stepResults: PipeStepResult[] = [];
    let chainedOutput = "";
    try {
      for (const step of activePipe.steps) {
        const tool = tools.find((t) => t.id === step.toolId);
        const toolTitle = tool ? (de ? (tool.titleDe || tool.title) : tool.title) : step.toolId;
        const effectiveInput =
          step.inputMode === "static"
            ? step.staticInput
            : (step.prefix ? step.prefix + "\n" + chainedOutput : chainedOutput);
        const start = Date.now();
        try {
          const result = await runTool(step.toolId, effectiveInput);
          chainedOutput = result.rawOutput ?? result.output;
          stepResults.push({
            stepId: step.id, toolId: step.toolId, toolTitle,
            input: effectiveInput, output: result.output,
            rawOutput: result.rawOutput,
            durationMs: Date.now() - start,
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          stepResults.push({
            stepId: step.id, toolId: step.toolId, toolTitle,
            input: effectiveInput, output: "", error: msg,
            durationMs: Date.now() - start,
          });
          setRunError(de ? `Fehler in Schritt "${toolTitle}": ${msg}` : `Error in step "${toolTitle}": ${msg}`);
          break;
        }
      }
    } finally {
      setResults(stepResults);
      setRunning(false);
    }
  }

  const readyTools = tools.filter((t) => t.status === "ready");

  return (
    <div className="pipes-page">
      {/* ── Left: pipe list ── */}
      <aside className="pipes-sidebar">
        <div className="pipes-sidebar-head">
          <span className="pipes-sidebar-label">{de ? "PIPES" : "PIPES"}</span>
          <button className="pipes-new-btn" onClick={createPipe} type="button" title={de ? "Neue Pipe" : "New pipe"}>
            +
          </button>
        </div>
        {pipes.length === 0 ? (
          <p className="pipes-sidebar-empty">{de ? "Noch keine Pipes." : "No pipes yet."}</p>
        ) : (
          <ul className="pipes-list">
            {pipes.map((pipe) => (
              <li key={pipe.id}>
                <button
                  className={`pipes-list-item${activePipeId === pipe.id ? " active" : ""}`}
                  onClick={() => { setActivePipeId(pipe.id); setResults(null); setRunError(null); }}
                  type="button"
                >
                  <span className="pipes-list-name">{pipe.name}</span>
                  <span className="pipes-list-meta">{pipe.steps.length} {de ? "Schritte" : "steps"}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* ── Center: editor + results ── */}
      <div className="pipes-main">
        {!activePipe ? (
          <div className="pipes-empty-state">
            <p className="pipes-empty-icon">⇢</p>
            <p>{de ? "Erstelle eine Pipe um Tools zu verketten." : "Create a pipe to chain tools together."}</p>
            <button className="pipes-create-btn" onClick={createPipe} type="button">
              {de ? "+ Erste Pipe erstellen" : "+ Create first pipe"}
            </button>
          </div>
        ) : (
          <>
            {/* Pipe header */}
            <div className="pipes-editor-head">
              <div className="pipes-name-row">
                <input
                  className="pipes-name-input"
                  value={activePipe.name}
                  onChange={(e) => updateName(e.target.value)}
                  placeholder={de ? "Pipe-Name" : "Pipe name"}
                  aria-label={de ? "Pipe-Name" : "Pipe name"}
                />
                <div className="pipes-head-actions">
                  <button
                    className="pipes-run-btn"
                    onClick={() => void runPipe()}
                    disabled={running || activePipe.steps.length === 0}
                    type="button"
                  >
                    {running ? (de ? "Läuft…" : "Running…") : (de ? "▶ Pipe ausführen" : "▶ Run pipe")}
                  </button>
                  <button
                    className="pipes-delete-btn"
                    onClick={() => deletePipe(activePipe.id)}
                    type="button"
                    title={de ? "Pipe löschen" : "Delete pipe"}
                  >
                    ✕
                  </button>
                </div>
              </div>
              <p className="pipes-hint">
                {de
                  ? "Jeder Schritt erhält den Output des vorherigen als Input (Verkettung) — oder einen festen Wert."
                  : "Each step receives the previous output as input (chain) — or a fixed value."}
              </p>
            </div>

            {/* Steps */}
            <div className="pipes-steps">
              {activePipe.steps.map((step, idx) => {
                const stepTool = readyTools.find((t) => t.id === step.toolId);
                const stepResult = results?.find((r) => r.stepId === step.id);
                return (
                  <div key={step.id} className={`pipe-step${stepResult?.error ? " pipe-step--error" : stepResult ? " pipe-step--done" : ""}`}>
                    {/* Step connector */}
                    {idx > 0 && (
                      <div className="pipe-connector">
                        <span className="pipe-connector-arrow">↓</span>
                        <span className="pipe-connector-label">{de ? "Output → Input" : "Output → Input"}</span>
                      </div>
                    )}

                    <div className="pipe-step-inner">
                      <div className="pipe-step-head">
                        <span className="pipe-step-num">{de ? `Schritt ${idx + 1}` : `Step ${idx + 1}`}</span>
                        <div className="pipe-step-controls">
                          <button className="pipe-step-ctrl" onClick={() => moveStep(step.id, -1)} disabled={idx === 0} type="button" title={de ? "Nach oben" : "Move up"}>↑</button>
                          <button className="pipe-step-ctrl" onClick={() => moveStep(step.id, 1)} disabled={idx === activePipe.steps.length - 1} type="button" title={de ? "Nach unten" : "Move down"}>↓</button>
                          <button className="pipe-step-ctrl pipe-step-remove" onClick={() => removeStep(step.id)} type="button" title={de ? "Schritt entfernen" : "Remove step"}>✕</button>
                        </div>
                      </div>

                      {/* Tool selector */}
                      <div className="pipe-step-field">
                        <label className="pipe-step-label">{de ? "Tool" : "Tool"}</label>
                        <div className="pipe-tool-row">
                          <select
                            className="pipe-tool-select"
                            value={step.toolId}
                            onChange={(e) => updateStep(step.id, { toolId: e.target.value })}
                            aria-label={de ? "Tool auswählen" : "Select tool"}
                          >
                            {readyTools.map((t) => (
                              <option key={t.id} value={t.id}>
                                {de ? t.titleDe : t.title}
                              </option>
                            ))}
                          </select>
                          {stepTool && (
                            <button
                              className="pipe-tool-open"
                              type="button"
                              onClick={() => onSelectTool(stepTool)}
                              title={de ? "Tool öffnen" : "Open tool"}
                            >
                              ↗
                            </button>
                          )}
                        </div>
                        {stepTool && (
                          <p className="pipe-tool-desc">{de ? stepTool.descriptionDe : stepTool.description}</p>
                        )}
                      </div>

                      {/* Input mode */}
                      <div className="pipe-step-field">
                        <label className="pipe-step-label">{de ? "Eingabe" : "Input"}</label>
                        <div className="pipe-mode-toggle">
                          <button
                            className={`pipe-mode-btn${step.inputMode === "chain" ? " active" : ""}`}
                            onClick={() => updateStep(step.id, { inputMode: "chain" })}
                            type="button"
                          >
                            {de ? "Verketten" : "Chain"}
                          </button>
                          <button
                            className={`pipe-mode-btn${step.inputMode === "static" ? " active" : ""}`}
                            onClick={() => updateStep(step.id, { inputMode: "static" })}
                            type="button"
                          >
                            {de ? "Fester Wert" : "Static"}
                          </button>
                        </div>
                        {step.inputMode === "static" ? (
                          <textarea
                            className="pipe-static-input"
                            value={step.staticInput}
                            onChange={(e) => updateStep(step.id, { staticInput: e.target.value })}
                            placeholder={de ? "Fester Eingabewert für diesen Schritt…" : "Fixed input value for this step…"}
                            rows={3}
                          />
                        ) : idx === 0 ? (
                          <div className="pipe-chain-hint pipe-chain-first">
                            <textarea
                              className="pipe-static-input"
                              value={step.staticInput}
                              onChange={(e) => updateStep(step.id, { staticInput: e.target.value })}
                              placeholder={de ? "Startingabe für die Pipe (erster Schritt)…" : "Initial input for the pipe (first step)…"}
                              rows={3}
                            />
                          </div>
                        ) : (
                          <div className="pipe-chain-hint">
                            <span>{de ? "← Output des vorherigen Schritts" : "← Output from previous step"}</span>
                            <input
                              className="pipe-prefix-input"
                              value={step.prefix}
                              onChange={(e) => updateStep(step.id, { prefix: e.target.value })}
                              placeholder={de ? "Optionaler Präfix (z. B. 'json')" : "Optional prefix (e.g. 'json')"}
                            />
                          </div>
                        )}
                      </div>

                      {/* Step result */}
                      {stepResult && (
                        <div className={`pipe-step-result${stepResult.error ? " pipe-step-result--err" : ""}`}>
                          <div className="pipe-result-head">
                            <span>{de ? "Ergebnis" : "Result"}</span>
                            <span className="pipe-result-dur">{stepResult.durationMs}ms</span>
                          </div>
                          <pre className="pipe-result-output">
                            {stepResult.error ? stepResult.error : trunc(stepResult.output, 400)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <button className="pipe-add-step-btn" onClick={addStep} type="button">
                + {de ? "Schritt hinzufügen" : "Add step"}
              </button>
            </div>

            {/* Final output */}
            {results && results.length > 0 && !runError && (
              <div className="pipes-final-output">
                <div className="pipes-final-head">
                  <span className="pipes-final-label">{de ? "FINALER OUTPUT" : "FINAL OUTPUT"}</span>
                  <button
                    className="pipes-final-copy"
                    type="button"
                    onClick={() => void navigator.clipboard?.writeText(results[results.length - 1]?.rawOutput ?? results[results.length - 1]?.output ?? "")}
                  >
                    {de ? "Kopieren" : "Copy"}
                  </button>
                </div>
                <pre className="pipes-final-pre">{results[results.length - 1]?.rawOutput ?? results[results.length - 1]?.output}</pre>
              </div>
            )}

            {runError && (
              <div className="pipes-run-error">
                <span className="pipes-run-error-label">Error</span>
                {runError}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
