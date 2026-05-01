import { defineTool } from "../core";

function caesar(text: string, shift: number): string {
  return text.replace(/[a-zA-Z]/g, c => {
    const base = c >= 'a' ? 97 : 65;
    return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26 + 26) % 26 + base);
  });
}
function rot13(text: string): string { return caesar(text, 13); }
function vigenere(text: string, key: string, encode: boolean): string {
  const k = key.toLowerCase().replace(/[^a-z]/g,'');
  if (!k.length) return text;
  let ki = 0;
  return text.replace(/[a-zA-Z]/g, c => {
    const base = c >= 'a' ? 97 : 65;
    const shift = k.charCodeAt(ki % k.length) - 97;
    ki++;
    return String.fromCharCode(((c.charCodeAt(0) - base + (encode ? shift : 26 - shift)) % 26 + 26) % 26 + base);
  });
}
function atbash(text: string): string {
  return text.replace(/[a-zA-Z]/g, c => {
    const base = c >= 'a' ? 97 : 65;
    return String.fromCharCode(base + 25 - (c.charCodeAt(0) - base));
  });
}

export default defineTool({
  id: "text-cipher",
  title: "Text Cipher",
  titleDe: "Text-Verschlüsselung",
  description: "Encode/decode text with classical ciphers: Caesar, ROT13, Atbash, Vigenère.",
  descriptionDe: "Text mit klassischen Chiffren kodieren/dekodieren: Caesar, ROT13, Atbash, Vigenère.",
  explanation: "First line: cipher + optional params (caesar:13, rot13, atbash, vigenere:key, vigenere-decode:key). Rest: text.",
  explanationDe: "Erste Zeile: Chiffre + optionale Parameter (caesar:13, rot13, atbash, vigenere:schlüssel, vigenere-decode:schlüssel). Rest: Text.",
  category: "Crypto",
  keywords: ["cipher","verschlüsselung","caesar","rot13","atbash","vigenere","encode","decode","classic"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "rot13\nHello, World!",
  example: "caesar:3\nDie geheime Nachricht",
  useCasesDe: ["Klassische Kryptografie lernen","CTF-Challenges lösen","Spielerisch verschlüsseln"],
  run: (input) => {
    const nl = input.indexOf("\n");
    if (nl === -1) throw new Error("Erste Zeile: Chiffre, dann Text (z.B. rot13\\nHello)");
    const cmd = input.slice(0,nl).trim().toLowerCase();
    const text = input.slice(nl+1);
    if (cmd==="rot13") return { output: rot13(text) };
    if (cmd==="atbash") return { output: atbash(text) };
    if (cmd.startsWith("caesar")) {
      const shift = parseInt(cmd.split(":")[1] || "13");
      return { output: caesar(text, shift) };
    }
    if (cmd.startsWith("vigenere-decode:")) {
      const key = cmd.slice(16);
      return { output: vigenere(text, key, false) };
    }
    if (cmd.startsWith("vigenere:")) {
      const key = cmd.slice(9);
      return { output: vigenere(text, key, true) };
    }
    throw new Error(`Unbekannte Chiffre '${cmd}'.\nErlaubt: rot13, atbash, caesar:N, vigenere:KEY, vigenere-decode:KEY`);
  },
});
