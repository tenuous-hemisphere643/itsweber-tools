# Adding a New Tool

## 1. Create the tool file

`packages/toolkit/src/tools/<id>.ts`:

```ts
import { defineTool } from "../core";

export default defineTool({
  id: "my-tool",                          // unique kebab-case ID
  title: "My Tool",                        // English display name
  titleDe: "Mein Tool",                    // German display name
  description: "What it does.",            // one sentence, English
  descriptionDe: "Was es tut.",            // one sentence, German
  explanation: "Full usage explanation.\nWith example.",
  explanationDe: "Volle Nutzungserklärung.\nMit Beispiel.",
  category: "Converter",                   // see ToolCategory type
  keywords: ["keyword1", "keyword2"],
  status: "ready",
  privacyMode: "local-only",              // "local-only" | "browser-api" | "network-fetch"
  placeholder: "Input placeholder text",
  example: "example input value",
  useCases: ["Use case 1", "Use case 2"],
  useCasesDe: ["Anwendungsfall 1", "Anwendungsfall 2"],
  run: (input) => {
    const result = input.toUpperCase();
    return { output: result };
  },
});
```

Auto-discovered via `import.meta.glob` — no registration, no import elsewhere.

## 2. rawOutput for tools with metadata headers

If your tool adds metadata lines to `output` (e.g. `Modus: Encode\n\n<data>`), set `rawOutput` to just the data value so pipe chaining works cleanly:

```ts
run: (input) => ({
  output: [`Modus: Encode`, ``, encoded, `Länge: ${n}`].join("\n"),
  rawOutput: encoded,
}),
```

## 3. Image tools

For drag-and-drop image input, add `inputMode: "image-drop"`:

```ts
inputMode: "image-drop",
run: (input) => { /* input is a data-URL string */ },
```

## 4. Add a test

In `packages/toolkit/src/registry.test.ts`, add an execution test:

```ts
it("my-tool transforms input", async () => {
  const result = await runTool("my-tool", "hello");
  expect(result.output).toBe("HELLO");
});
```

## Categories

`Crypto` · `Converter` · `Web` · `Images and QR` · `Development` · `Network` · `Math` · `Measurement` · `Text` · `Data` · `ItsWeber Ops`

## Privacy modes

| Mode | When to use |
| --- | --- |
| `local-only` | All computation in the browser, no network calls |
| `browser-api` | Uses browser APIs (e.g. `navigator.clipboard`, `canvas`) |
| `network-fetch` | Makes outgoing HTTP requests (e.g. DNS lookup, IP info) |
