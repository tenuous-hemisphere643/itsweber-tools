import { defineTool } from "../core";

export default defineTool({
  id: "string-tools",
  title: "String Utilities",
  titleDe: "String-Werkzeuge",
  description: "Analyze and transform strings: reverse, palindrome check, frequency analysis, remove duplicates.",
  descriptionDe: "Strings analysieren und transformieren: umkehren, Palindrom-Prüfung, Frequenzanalyse, Duplikate entfernen.",
  explanation: "First line: command (reverse, palindrome, frequency, dedup-chars, count-chars, vowels). Rest: text.",
  explanationDe: "Erste Zeile: Befehl (reverse, palindrome, frequency, dedup-chars, count-chars, vowels). Rest: Text.",
  category: "Text",
  keywords: ["string","text","reverse","palindrome","frequency","analyze","transform","chars","character"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "reverse\nHello, World!",
  example: "frequency\nto be or not to be that is the question",
  useCasesDe: ["Text-Analyse","Palindrome finden","Zeichenhäufigkeiten"],
  run: (input) => {
    const nl = input.indexOf("\n");
    let cmd = input.trim().toLowerCase(), text = "";
    if (nl > -1) { cmd = input.slice(0,nl).trim().toLowerCase(); text = input.slice(nl+1); }
    else { text = input; }
    if (cmd==="reverse") return { output: text.split("").reverse().join("") };
    if (cmd==="palindrome") {
      const clean = text.toLowerCase().replace(/[^a-z0-9]/g,"");
      const isPalin = clean === clean.split("").reverse().join("");
      return { output: `"${text.trim()}" ${isPalin?"ist ein Palindrom ✓":"ist kein Palindrom ✗"}` };
    }
    if (cmd==="frequency") {
      const freq: Record<string,number> = {};
      for (const c of text.toLowerCase().replace(/\s/g,"")) freq[c]=(freq[c]||0)+1;
      const sorted = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,20);
      const total = Object.values(freq).reduce((a,b)=>a+b,0);
      const bars = sorted.map(([c,n])=>`  '${c}'  ${"█".repeat(Math.round(n/total*20))}  ${n} (${(n/total*100).toFixed(1)}%)`);
      return { output: [`Häufigste Zeichen (${total} gesamt):`,``,...bars].join("\n") };
    }
    if (cmd==="count-chars") {
      const letters = (text.match(/[a-zA-ZäöüÄÖÜß]/g)||[]).length;
      const digits = (text.match(/\d/g)||[]).length;
      const spaces = (text.match(/\s/g)||[]).length;
      const punct = text.length - letters - digits - spaces;
      return { output: [`Gesamt:     ${text.length}`,`Buchstaben: ${letters}`,`Ziffern:    ${digits}`,`Leerzeichen: ${spaces}`,`Satzzeichen: ${punct}`].join("\n") };
    }
    if (cmd==="dedup-chars") return { output: [...new Set(text.split(""))].join("") };
    if (cmd==="vowels") {
      const v = (text.match(/[aeiouäöüAEIOUÄÖÜ]/g)||[]).length;
      return { output: `${v} Vokale von ${text.replace(/\s/g,"").length} Zeichen (${(v/text.replace(/\s/g,"").length*100).toFixed(1)}%)` };
    }
    throw new Error("Befehle: reverse | palindrome | frequency | count-chars | dedup-chars | vowels");
  },
});
