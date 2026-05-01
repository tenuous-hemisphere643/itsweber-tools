import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { runTool, tools, type HistoryEntry, type Pipe, type ToolCategory, type ToolDefinition } from "@itsweber/toolkit";
import type { ColorMode, ThemeId } from "@itsweber/ui";
import { jsonCodec, stringCodec, useLocalStorage, type StorageCodec } from "./hooks/useLocalStorage";
import { copy, type Language } from "./lib/copy";
import { storageKeys } from "./lib/storageKeys";
import { AboutPage } from "./components/AboutPage";
import { CategoryGrid } from "./components/CategoryGrid";
import { CommandPalette } from "./components/CommandPalette";
import { DiscoveryHub } from "./components/DiscoveryHub";
import { HistoryPage } from "./components/HistoryPage";
import { PipesPage } from "./components/PipesPage";
import { SettingsPanel } from "./components/SettingsPanel";
import { ToolBrowser } from "./components/ToolBrowser";
import { Topbar } from "./components/Topbar";
import { Workbench } from "./components/Workbench";

export type Page = "hub" | "tools" | "history" | "pipes" | "about";

const themeCodec = stringCodec as unknown as StorageCodec<ThemeId>;
const colorModeCodec = stringCodec as unknown as StorageCodec<ColorMode>;
const languageCodec = stringCodec as unknown as StorageCodec<Language>;

const FAVORITES_CODEC = jsonCodec<string[]>();
const RECENT_CODEC = jsonCodec<string[]>();
const HISTORY_CODEC = jsonCodec<HistoryEntry[]>();
const PIPES_CODEC = jsonCodec<Pipe[]>();

const MAX_HISTORY = 100;

export function App() {
  const [page, setPage] = useState<Page>("hub");
  const [theme, setTheme] = useLocalStorage<ThemeId>(storageKeys.theme, "itsweber-petrol", themeCodec);
  const [colorMode, setColorMode] = useLocalStorage<ColorMode>(storageKeys.colorMode, "system", colorModeCodec);
  const [language, setLanguage] = useLocalStorage<Language>(storageKeys.language, "de", languageCodec);
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "All">("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined);
  const [downloadName, setDownloadName] = useState<string | undefined>(undefined);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useLocalStorage<string[]>(storageKeys.favorites, [], FAVORITES_CODEC);
  const [recent, setRecent] = useLocalStorage<string[]>(storageKeys.recent, [], RECENT_CODEC);
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(storageKeys.history, [], HISTORY_CODEC);
  const [pipes, setPipes] = useLocalStorage<Pipe[]>(storageKeys.pipes, [], PIPES_CODEC);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const t = copy[language];
  const selectedTool = selectedId ? (tools.find((tool) => tool.id === selectedId) ?? null) : null;
  const readyCount = tools.filter((tool) => tool.status === "ready").length;

  const queryFilteredTools = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return tools;
    return tools.filter((tool) =>
      [
        tool.title, tool.titleDe,
        tool.description, tool.descriptionDe,
        tool.explanation, tool.explanationDe,
        tool.category, ...tool.keywords,
      ].some((value) => value.toLowerCase().includes(normalized))
    );
  }, [query]);

  useEffect(() => {
    if (query.trim()) {
      setActiveCategory("All");
      setSelectedId(null);
    }
  }, [query]);

  function handleCategoryChange(cat: ToolCategory | "All") {
    setActiveCategory(cat);
    setSelectedId(null);
  }

  const filteredTools = useMemo(
    () => queryFilteredTools.filter((tool) => activeCategory === "All" || tool.category === activeCategory),
    [queryFilteredTools, activeCategory],
  );

  useEffect(() => {
    const updateMode = () => {
      const resolved =
        colorMode === "system"
          ? matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
          : colorMode;
      document.documentElement.dataset.theme = theme;
      document.documentElement.dataset.mode = resolved;
    };
    updateMode();
    const media = matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", updateMode);
    return () => media.removeEventListener("change", updateMode);
  }, [theme, colorMode]);

  const execute = useCallback(async (tool: ToolDefinition = (selectedTool ?? tools[0]!), overrideInput?: string) => {
    const effectiveInput = overrideInput ?? input;
    setError("");
    const entry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      toolId: tool.id,
      toolTitle: language === "de" ? (tool.titleDe || tool.title) : tool.title,
      input: effectiveInput,
      output: "",
      ts: Date.now(),
    };
    try {
      const result = await runTool(tool.id, effectiveInput);
      setOutput(result.output);
      setDownloadUrl(result.downloadUrl);
      setDownloadName(result.downloadName);
      setRecent((items) => [tool.id, ...items.filter((i) => i !== tool.id)].slice(0, 6));
      entry.output = result.output;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setOutput("");
      setDownloadUrl(undefined);
      setDownloadName(undefined);
      setError(msg);
      entry.error = msg;
    }
    setHistory((items) => [entry, ...items].slice(0, MAX_HISTORY));
  }, [selectedTool, input, language, setRecent, setHistory]);

  const executeRef = useRef(execute);
  useEffect(() => { executeRef.current = execute; }, [execute]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setPaletteOpen((v) => !v); }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); void executeRef.current(); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function selectTool(tool: ToolDefinition) {
    setSelectedId(tool.id);
    setInput(tool.example || "");
    setOutput("");
    setDownloadUrl(undefined);
    setDownloadName(undefined);
    setError("");
    setQuery("");
  }

  function rerunHistoryEntry(entry: HistoryEntry) {
    const tool = tools.find((t) => t.id === entry.toolId);
    if (!tool) return;
    selectTool(tool);
    setInput(entry.input);
    setPage("tools");
  }

  function toggleFavorite(toolId: string) {
    setFavorites((items) =>
      items.includes(toolId) ? items.filter((i) => i !== toolId) : [toolId, ...items],
    );
  }

  return (
    <div className="app-shell">
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        language={language}
        theme={theme}
        onChangeTheme={setTheme}
        colorMode={colorMode}
        onChangeColorMode={setColorMode}
        onChangeLanguage={setLanguage}
        onClearHistory={() => { setRecent([]); setHistory([]); }}
        onClearFavorites={() => setFavorites([])}
      />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        tools={tools}
        language={language}
        onSelectTool={(tool) => { selectTool(tool); setPage("tools"); }}
      />

      <Topbar
        page={page}
        onChangePage={setPage}
        language={language}
        onChangeLanguage={setLanguage}
        theme={theme}
        onChangeTheme={setTheme}
        colorMode={colorMode}
        onChangeColorMode={setColorMode}
        onOpenPalette={() => setPaletteOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        copy={t}
        historyCount={history.length}
        pipesCount={pipes.length}
      />

      {page === "about" ? (
        <AboutPage language={language} readyCount={readyCount} />
      ) : page === "hub" ? (
        <main className="workspace">
          <DiscoveryHub
            language={language}
            favorites={favorites}
            recent={recent}
            onSelectTool={(tool) => { selectTool(tool); setPage("tools"); }}
            onOpenPalette={() => setPaletteOpen(true)}
            onSelectCategory={(cat: ToolCategory) => { setActiveCategory(cat); setPage("tools"); }}
          />
        </main>
      ) : page === "history" ? (
        <main className="workspace">
          <HistoryPage
            language={language}
            history={history}
            onClear={() => setHistory([])}
            onRerun={rerunHistoryEntry}
          />
        </main>
      ) : page === "pipes" ? (
        <main className="workspace">
          <PipesPage
            language={language}
            pipes={pipes}
            onChangePipes={setPipes}
            onSelectTool={(tool) => { selectTool(tool); setPage("tools"); }}
          />
        </main>
      ) : (
        <main className="workspace">
          <section className="tool-layout">
            <ToolBrowser
              language={language}
              query={query}
              onChangeQuery={setQuery}
              searchPlaceholder={t.search}
              allLabel={t.all}
              readyLabel={t.ready}
              favoritesLabel={t.favorites}
              recentLabel={t.recent}
              activeCategory={activeCategory}
              onChangeCategory={handleCategoryChange}
              filteredTools={filteredTools}
              queryFilteredTools={queryFilteredTools}
              selectedId={selectedId ?? ""}
              onSelectTool={selectTool}
              favorites={favorites}
              recent={recent}
            />

            {selectedTool ? (
              <Workbench
                language={language}
                tool={selectedTool}
                input={input}
                onChangeInput={setInput}
                output={output}
                downloadUrl={downloadUrl}
                downloadName={downloadName}
                error={error}
                onRun={() => void execute()}
                onLoadExample={() => setInput(selectedTool.example)}
                onCopyOutput={() => void navigator.clipboard?.writeText(output)}
                isFavorite={favorites.includes(selectedTool.id)}
                onToggleFavorite={() => toggleFavorite(selectedTool.id)}
                copy={t}
              />
            ) : (
              <CategoryGrid
                category={activeCategory}
                tools={filteredTools}
                language={language}
                onSelectTool={selectTool}
              />
            )}
          </section>
        </main>
      )}
    </div>
  );
}
