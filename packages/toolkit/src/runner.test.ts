import { describe, expect, it } from "vitest";
import { runTool, slugify } from "./index";

describe("toolkit", () => {
  it("slugifies product labels", () => {
    expect(slugify("ItsWeber Tools Docker App")).toBe("itsweber-tools-docker-app");
  });

  it("formats JSON (auto-detects direction)", async () => {
    const compact = await runTool("json-format", "{\"ok\":true}");
    expect(compact.output).toContain('"ok"');
    const multiline = await runTool("json-format", '{\n  "ok": true\n}');
    expect(multiline.output).toContain('"ok":true');
  });

  it("calculates cidr details", async () => {
    const result = await runTool("cidr-calculator", "192.168.1.5/24");
    expect(result.output).toContain("Network: 192.168.1.0");
    expect(result.output).toContain("Broadcast: 192.168.1.255");
  });

  it("converts chmod permissions", async () => {
    await expect(runTool("chmod-calculator", "rwxr-x---")).resolves.toMatchObject({ output: "750" });
  });
});
