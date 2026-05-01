import { describe, it, expect } from "vitest";
import { tools, runTool } from "./index";

describe("Tool Registry", () => {
  it("loads at least 150 tools", () => {
    expect(tools.length).toBeGreaterThanOrEqual(150);
  });

  it("all tools have required fields", () => {
    for (const tool of tools) {
      expect(tool.id, `${tool.id}: id missing`).toBeTruthy();
      expect(tool.title, `${tool.id}: title missing`).toBeTruthy();
      expect(tool.titleDe, `${tool.id}: titleDe missing`).toBeTruthy();
      expect(tool.description, `${tool.id}: description missing`).toBeTruthy();
      expect(tool.descriptionDe, `${tool.id}: descriptionDe missing`).toBeTruthy();
      expect(tool.explanation, `${tool.id}: explanation missing`).toBeTruthy();
      expect(tool.explanationDe, `${tool.id}: explanationDe missing`).toBeTruthy();
      expect(tool.category, `${tool.id}: category missing`).toBeTruthy();
      expect(tool.keywords.length, `${tool.id}: keywords empty`).toBeGreaterThan(0);
    }
  });

  it("no duplicate tool ids", () => {
    const ids = tools.map((t) => t.id);
    const unique = new Set(ids);
    expect(ids.length).toBe(unique.size);
  });

  it("all tools have a valid status", () => {
    const validStatuses = new Set(["ready", "wip", "planned"]);
    for (const tool of tools) {
      expect(validStatuses.has(tool.status), `${tool.id}: invalid status '${tool.status}'`).toBe(true);
    }
  });
});

describe("Tool Execution", () => {
  it("base64: encodes plain text (auto-detect)", async () => {
    const result = await runTool("base64", "Hello");
    expect(result.output).toContain("SGVsbG8=");
  });

  it("base64: decodes base64 string (auto-detect)", async () => {
    const result = await runTool("base64", "SGVsbG8=");
    expect(result.output).toContain("Hello");
  });

  it("text-case: outputs all case variants", async () => {
    const result = await runTool("text-case", "hello world");
    expect(result.output).toContain("UPPERCASE");
    expect(result.output).toContain("HELLO WORLD");
    expect(result.output).toContain("camelCase");
    expect(result.output).toContain("helloWorld");
  });

  it("json-to-table: converts JSON array to csv", async () => {
    const result = await runTool("json-to-table", 'csv\n[{"name":"Alice","age":30}]');
    expect(result.output).toContain("name");
    expect(result.output).toContain("Alice");
  });

  it("binary-tools: AND operation", async () => {
    const result = await runTool("binary-tools", "255 AND 170");
    expect(result.output).toContain("170");
  });

  it("text-cipher: rot13 roundtrip", async () => {
    const r1 = await runTool("text-cipher", "rot13\nHello");
    const r2 = await runTool("text-cipher", `rot13\n${r1.output}`);
    expect(r2.output).toBe("Hello");
  });

  it("unknown tool returns fallback", async () => {
    const result = await runTool("__nonexistent__", "");
    expect(result.output).toContain("not available");
  });
});
