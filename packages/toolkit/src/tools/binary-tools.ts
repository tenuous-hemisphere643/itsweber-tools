import { defineTool } from "../core";

export default defineTool({
  id: "binary-tools",
  title: "Bitwise & Binary Tools",
  titleDe: "Bitweise & Binär-Werkzeuge",
  description: "Perform bitwise operations (AND, OR, XOR, NOT, shifts) and inspect bit patterns.",
  descriptionDe: "Bitweise Operationen (AND, OR, XOR, NOT, Shifts) durchführen und Bitmuster inspizieren.",
  explanation: "Format: A op B — e.g. '255 AND 170', 'NOT 42' or '1 SHL 4'. Operations: AND, OR, XOR, NOT, SHL, SHR. Also: 'bits N' for bit pattern.",
  explanationDe: "Format: A op B — z.B. '255 AND 170', 'NOT 42' oder '1 SHL 4'. Operationen: AND, OR, XOR, NOT, SHL, SHR. Auch: 'bits N' für Bitmuster.",
  category: "Development",
  keywords: ["binary","bit","bitwise","and","or","xor","not","shift","bitmask","flags"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "255 AND 170",
  example: "0xFF XOR 0xAA",
  useCasesDe: ["Bitmask-Operationen","Flags prüfen","Low-Level-Debugging"],
  run: (input) => {
    const t = input.trim().toUpperCase();
    const parseNum = (s: string): number => {
      const n = s.trim();
      if (n.startsWith("0X")) return parseInt(n, 16);
      if (n.startsWith("0B")) return parseInt(n.slice(2), 2);
      if (n.startsWith("0O")) return parseInt(n.slice(2), 8);
      return parseInt(n);
    };
    const fmt = (n: number): string => {
      const u = n >>> 0;
      return [
        `DEC: ${n} (signed) / ${u} (unsigned)`,
        `HEX: 0x${u.toString(16).toUpperCase().padStart(8,"0")}`,
        `OCT: 0o${u.toString(8)}`,
        `BIN: ${u.toString(2).padStart(32,"0").match(/.{8}/g)!.join(" ")}`,
      ].join("\n");
    };
    if (t.startsWith("BITS")) {
      const n = parseNum(t.replace("BITS","").trim());
      if (isNaN(n)) throw new Error("Ungültige Zahl");
      return { output: fmt(n) };
    }
    // Support both "A op B" and unary "NOT A"
    const unaryMatch = t.match(/^NOT\s+(0[XBO]?[\dA-F]+|\d+)$/);
    if (unaryMatch) {
      const a = parseNum(unaryMatch[1]!);
      if (isNaN(a)) throw new Error("Ungültige Zahl");
      return { output: [`NOT ${unaryMatch[1]} =`,``,fmt(~a)].join("\n") };
    }
    const m = t.match(/^(0[XBO]?[\dA-F]+|\d+)\s+(AND|OR|XOR|SHL|SHR)\s+(0[XBO]?[\dA-F]+|\d+)$/);
    if (!m) throw new Error("Format: N AND M | N OR M | N XOR M | NOT N | N SHL M | N SHR M | bits N");
    const a = parseNum(m[1]!); const op = m[2]!; const b = parseNum(m[3]!);
    if (isNaN(a)||isNaN(b)) throw new Error("Ungültige Zahl(en)");
    let result: number;
    switch(op) {
      case "AND": result = a & b; break;
      case "OR":  result = a | b; break;
      case "XOR": result = a ^ b; break;
      case "SHL": result = a << b; break;
      case "SHR": result = a >> b; break;
      default: throw new Error(`Unbekannte Op: ${op}`);
    }
    return { output: [`${m[1]} ${op} ${m[3]} =`,``,fmt(result)].join("\n") };
  },
});
