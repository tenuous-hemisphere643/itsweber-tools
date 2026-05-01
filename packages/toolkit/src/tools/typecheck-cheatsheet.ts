import { defineTool } from "../core";

export default defineTool({
  id: "typecheck-cheatsheet",
  title: "TypeScript Type Cheatsheet",
  titleDe: "TypeScript-Typen-Spickzettel",
  description: "Quick reference for TypeScript types, utilities, generics, and common patterns.",
  descriptionDe: "Schnellreferenz für TypeScript-Typen, Utility-Types, Generics und häufige Muster.",
  explanation: "Enter a category: primitives, objects, arrays, generics, utilities, advanced, guards. Or leave blank for all.",
  explanationDe: "Kategorie eingeben: primitives, objects, arrays, generics, utilities, advanced, guards. Oder leer für alle.",
  category: "Development",
  keywords: ["typescript","types","generics","utility","interface","type","cheatsheet","ts"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "utilities",
  example: "generics",
  useCasesDe: ["TypeScript-Typen nachschlagen","Generics lernen","Utility Types verstehen"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const sections: Record<string,string[]> = {
      primitives: ["string  number  boolean  null  undefined  symbol  bigint  never  unknown  any  void","","// Literal types:","type Dir = 'left' | 'right' | 'up' | 'down'","type StatusCode = 200 | 400 | 404 | 500"],
      objects: ["interface User { id: number; name: string; email?: string }","type Point = { x: number; y: number }","","// Readonly:","type ReadonlyUser = Readonly<User>","// Record:","type Dict = Record<string, number>"],
      arrays: ["string[]  oder  Array<string>","[string, number]  // Tuple","[...string[], number]  // Rest Tuple","","const arr: readonly string[] = ['a','b']"],
      generics: ["function identity<T>(val: T): T { return val }","","interface Box<T> { value: T; label: string }","","// Constraints:","function getLength<T extends { length: number }>(t: T): number","","// Conditional:","type IsString<T> = T extends string ? true : false"],
      utilities: ["Partial<T>        // alle Properties optional","Required<T>       // alle Properties required","Readonly<T>       // alle Properties readonly","Record<K,V>       // Map von K auf V","Pick<T,K>         // Subset von Properties","Omit<T,K>         // Properties entfernen","Exclude<T,U>      // Union-Mitglieder entfernen","Extract<T,U>      // Schnittmenge","NonNullable<T>    // null/undefined entfernen","ReturnType<F>     // Rückgabetyp","Parameters<F>     // Parameter-Tuple","Awaited<T>        // Awaited Promise-Typ"],
      advanced: ["// Template Literal Types:","type Key = `user_${string}`","","// Mapped Types:","type Flags<T> = { [K in keyof T]: boolean }","","// Infer:","type UnwrapPromise<T> = T extends Promise<infer U> ? U : T","","// Discriminated Unions:","type Shape = { kind: 'circle', r: number } | { kind: 'rect', w: number, h: number }"],
      guards: ["// Type Guard:","function isString(v: unknown): v is string { return typeof v === 'string' }","","// Assertion:","function assertNumber(v: unknown): asserts v is number { if(typeof v!=='number') throw Error() }","","// in operator:","if ('name' in user) { /* user has name */ }","","// instanceof:","if (err instanceof Error) { console.log(err.message) }"],
    };
    const keys = t && sections[t] ? [t] : Object.keys(sections);
    if (t && !sections[t]) throw new Error(`Unbekannt: '${t}'.\nErlaubt: ${Object.keys(sections).join(", ")}`);
    const out: string[] = [];
    for (const key of keys) {
      out.push(`── ${key.toUpperCase()} ${"─".repeat(35-key.length)}`);
      out.push(...sections[key]);
      out.push("");
    }
    return { output: out.join("\n") };
  },
});
