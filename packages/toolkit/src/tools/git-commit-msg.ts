import { defineTool } from "../core";

export default defineTool({
  id: "git-commit-msg",
  title: "Git Commit Message Builder",
  titleDe: "Git-Commit-Nachrichten-Builder",
  description: "Build well-formatted Conventional Commits style commit messages with emoji support.",
  descriptionDe: "Gut formatierte Conventional-Commits-Commit-Nachrichten mit Emoji-Unterstützung erstellen.",
  explanation: "Enter: type, scope (optional), and description. Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build.",
  explanationDe: "Eingabe: type, scope (optional) und Beschreibung. Typen: feat, fix, docs, style, refactor, test, chore, perf, ci, build.",
  category: "Development",
  keywords: ["git","commit","conventional","message","angular","emoji","type","scope"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "type: feat\nscope: auth\ndescription: add OAuth 2.0 login with Google",
  example: "type: fix\nscope: subnet-calc\ndescription: correct broadcast address for /31 networks",
  useCasesDe: ["Konventionelle Commits erstellen","Changelog generieren","Team-Standards einhalten"],
  run: (input) => {
    const kv: Record<string,string> = {};
    input.split("\n").forEach(l=>{ const i=l.indexOf(":"); if(i>0) kv[l.slice(0,i).trim().toLowerCase()]=l.slice(i+1).trim(); });
    const type = (kv.type||"feat").toLowerCase();
    const scope = kv.scope||kv.module||"";
    const desc = kv.description||kv.desc||kv.message||"";
    if (!desc) throw new Error("'description' ist erforderlich");
    const EMOJIS: Record<string,string> = {
      feat:"✨",fix:"🐛",docs:"📝",style:"💄",refactor:"♻️",test:"✅",
      chore:"🔧",perf:"⚡",ci:"👷",build:"🏗️",security:"🔒",release:"🚀",
    };
    const emoji = EMOJIS[type] || "";
    const header = scope ? `${type}(${scope}): ${desc}` : `${type}: ${desc}`;
    const withEmoji = scope ? `${emoji} ${type}(${scope}): ${desc}` : `${emoji} ${type}: ${desc}`;
    const breaking = kv.breaking ? `\nBREAKING CHANGE: ${kv.breaking}` : "";
    const body = kv.body||kv.detail ? `\n\n${kv.body||kv.detail}` : "";
    const footer = kv.closes||kv.fixes ? `\n\nCloses #${(kv.closes||kv.fixes||"").replace("#","")}` : "";
    return { output: [
      `Conventional Commit:`,``,header+body+footer,``,
      `Mit Emoji:`,withEmoji+body+footer,
      breaking,
      ``,`Length: ${header.length}/72 Zeichen ${header.length>72?"⚠ zu lang":"✓"}`,
    ].filter(l=>l!=="BREAKING CHANGE: ").join("\n") };
  },
});
