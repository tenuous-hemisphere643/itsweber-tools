import { defineTool } from "../core";

export default defineTool({
  id: "unixperm-calc",
  title: "Unix Permission Calculator",
  titleDe: "Unix-Berechtigungs-Rechner",
  description: "Convert between symbolic (rwxr-xr--) and octal (754) Unix file permissions.",
  descriptionDe: "Zwischen symbolischen (rwxr-xr--) und oktalen (754) Unix-Datei-Berechtigungen konvertieren.",
  explanation: "Enter octal (e.g. 755) or symbolic (e.g. rwxr-xr-x) permissions. Shows full breakdown and chmod command.",
  explanationDe: "Oktal (z.B. 755) oder symbolisch (z.B. rwxr-xr-x) eingeben. Zeigt vollständige Aufschlüsselung und chmod-Befehl.",
  category: "Development",
  keywords: ["chmod","permission","unix","linux","octal","rwx","file","owner","group","other"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "755",
  example: "rwxr-xr-x",
  useCasesDe: ["chmod-Befehle verstehen","Berechtigungen planen","Sicherheits-Audit"],
  run: (input) => {
    const t = input.trim().replace(/^[-d]/,"");
    const parse = (s: string): number => {
      let n = 0;
      if (s[0]==="r") n|=4;
      if (s[1]==="w") n|=2;
      if (s[2]==="x"||s[2]==="s"||s[2]==="t") n|=1;
      return n;
    };
    let octal: string;
    if (/^\d{3,4}$/.test(t)) {
      octal = t.padStart(4,"0").slice(-3);
    } else if (/^[-rwxst]{9}$/.test(t)) {
      octal = String(parse(t.slice(0,3)))+String(parse(t.slice(3,6)))+String(parse(t.slice(6,9)));
    } else throw new Error("Ungültig. Format: 755 oder rwxr-xr-x");
    const [uo,go,oo] = octal.split("").map(Number);
    const descs: Record<number,string[]> = {
      0:["---","keine Rechte"],1:["--x","nur Ausführen"],2:["-w-","nur Schreiben"],
      3:["-wx","Schreiben+Ausführen"],4:["r--","nur Lesen"],5:["r-x","Lesen+Ausführen"],
      6:["rw-","Lesen+Schreiben"],7:["rwx","alle Rechte"],
    };
    return { output: [
      `Oktal:    ${octal}`,
      `Symbolisch: ${descs[uo][0]}${descs[go][0]}${descs[oo][0]}`,``,
      `Eigentümer (${uo}): ${descs[uo][1]}`,
      `Gruppe     (${go}): ${descs[go][1]}`,
      `Andere     (${oo}): ${descs[oo][1]}`,``,
      `chmod ${octal} datei.txt`,
    ].join("\n") };
  },
});
