import { defineTool } from "../core";

// Safe math evaluator — no eval(), whitelist only
function calc(expr: string): number {
  const tokens = expr.replace(/\s+/g,"").match(/(\d+\.?\d*|\.\d+|[+\-*/^()%]|sqrt|abs|log|sin|cos|tan|pi|e)/gi);
  if (!tokens) throw new Error("Ungültiger Ausdruck.");
  let pos = 0;
  const peek = () => tokens[pos];
  const consume = () => tokens[pos++];

  function parseExpr(): number { return parseAddSub(); }
  function parseAddSub(): number {
    let left = parseMulDiv();
    while (peek() === "+" || peek() === "-") {
      const op = consume();
      const right = parseMulDiv();
      left = op === "+" ? left + right : left - right;
    }
    return left;
  }
  function parseMulDiv(): number {
    let left = parsePow();
    while (peek() === "*" || peek() === "/" || peek() === "%") {
      const op = consume();
      const right = parsePow();
      if (op === "/" && right === 0) throw new Error("Division durch 0.");
      left = op === "*" ? left * right : op === "/" ? left / right : left % right;
    }
    return left;
  }
  function parsePow(): number {
    const base = parseUnary();
    if (peek() === "^") { consume(); return Math.pow(base, parsePow()); }
    return base;
  }
  function parseUnary(): number {
    if (peek() === "-") { consume(); return -parseAtom(); }
    if (peek() === "+") { consume(); return parseAtom(); }
    return parseAtom();
  }
  function parseAtom(): number {
    const t = peek();
    if (!t) throw new Error("Unerwartetes Ende.");
    if (t === "(") { consume(); const v = parseExpr(); if (consume() !== ")") throw new Error("Fehlende )"); return v; }
    if (/^sqrt$/i.test(t)) { consume(); if (consume() !== "(") throw new Error("sqrt(...)"); const v = parseExpr(); consume(); return Math.sqrt(v); }
    if (/^abs$/i.test(t)) { consume(); if (consume() !== "(") throw new Error("abs(...)"); const v = parseExpr(); consume(); return Math.abs(v); }
    if (/^log$/i.test(t)) { consume(); if (consume() !== "(") throw new Error("log(...)"); const v = parseExpr(); consume(); return Math.log10(v); }
    if (/^sin$/i.test(t)) { consume(); if (consume() !== "(") throw new Error("sin(...)"); const v = parseExpr(); consume(); return Math.sin(v * Math.PI / 180); }
    if (/^cos$/i.test(t)) { consume(); if (consume() !== "(") throw new Error("cos(...)"); const v = parseExpr(); consume(); return Math.cos(v * Math.PI / 180); }
    if (/^tan$/i.test(t)) { consume(); if (consume() !== "(") throw new Error("tan(...)"); const v = parseExpr(); consume(); return Math.tan(v * Math.PI / 180); }
    if (/^pi$/i.test(t)) { consume(); return Math.PI; }
    if (/^e$/i.test(t)) { consume(); return Math.E; }
    const n = parseFloat(consume());
    if (isNaN(n)) throw new Error(`Unbekanntes Token: ${t}`);
    return n;
  }
  const result = parseExpr();
  if (pos < tokens.length) throw new Error(`Unerwartetes Token: ${tokens[pos]}`);
  return result;
}

export default defineTool({
  id: "math-eval",
  title: "Math Expression Evaluator",
  titleDe: "Mathematik-Ausdruck Rechner",
  description: "Evaluate math expressions safely — no eval(). Supports +−×÷^, sqrt, sin, cos, log.",
  descriptionDe: "Berechnet mathematische Ausdrücke sicher ohne eval(). Unterstützt +−×÷^, sqrt, sin, cos, log.",
  explanation: "Evaluates arithmetic expressions safely using a recursive descent parser. Operators: + - * / ^ %. Functions: sqrt(), abs(), log(), sin(), cos(), tan(). Constants: pi, e.",
  explanationDe: "Berechnet Ausdrücke sicher mit einem rekursiven Descent-Parser. Operatoren: + - * / ^ %. Funktionen: sqrt(), abs(), log(), sin(), cos(), tan(). Konstanten: pi, e.",
  category: "Math",
  keywords: ["math","calc","rechner","calculate","expression","formel","formula","sqrt","sin","cos","eval"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "2^10 + sqrt(144) / 3",
  example: "2^10 + sqrt(144) / 3",
  useCasesDe: ["Schnelle Berechnungen ohne Taschenrechner","Formeln prüfen","Server-Ressourcen kalkulieren"],
  run: (input) => {
    const lines = input.split("\n").map(l=>l.trim()).filter(Boolean);
    const results = lines.map(line => {
      try { return `${line} = ${calc(line)}`; }
      catch(e) { return `${line} → Fehler: ${e instanceof Error ? e.message : e}`; }
    });
    return { output: results.join("\n") };
  },
});
