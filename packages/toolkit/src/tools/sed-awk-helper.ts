import { defineTool } from "../core";

export default defineTool({
  id: "sed-awk-helper",
  title: "sed / awk Command Builder",
  titleDe: "sed / awk Befehl-Builder",
  description: "Generate sed and awk commands for common text processing operations.",
  descriptionDe: "sed- und awk-Befehle für häufige Textverarbeitungsoperationen generieren.",
  explanation: "Enter an operation: replace, delete, extract, count, sum, or describe a transformation.",
  explanationDe: "Operation eingeben: replace, delete, extract, count, sum oder eine Transformation beschreiben.",
  category: "Development",
  keywords: ["sed","awk","bash","shell","text","process","replace","regex","cli","linux"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "replace",
  example: "replace foo bar",
  useCasesDe: ["Log-Dateien verarbeiten","CSV-Transformation","Shell-Einzeiler schreiben"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const m = t.split(/\s+/);
    const op = m[0];
    if (op==="replace" && m.length>=3) {
      const [,from,to] = m;
      return { output: [
        `# sed: alle Vorkommen ersetzen`,
        `sed 's/${from}/${to}/g' file.txt`,``,
        `# sed: nur erste Zeile`,
        `sed '1s/${from}/${to}/' file.txt`,``,
        `# sed: in-place (Datei überschreiben):`,
        `sed -i 's/${from}/${to}/g' file.txt`,``,
        `# awk: Ersetzen`,
        `awk '{gsub("${from}", "${to}"); print}' file.txt`,
      ].join("\n") };
    }
    if (op==="delete") {
      const term = m.slice(1).join(" ") || "PATTERN";
      return { output: [
        `# Zeilen die '${term}' enthalten löschen:`,
        `sed '/${term}/d' file.txt`,``,
        `# Leere Zeilen löschen:`,
        `sed '/^$/d' file.txt`,``,
        `# Erste N Zeilen löschen:`,
        `sed '1,N d' file.txt`,``,
        `# Leerzeichen am Anfang/Ende entfernen:`,
        `sed 's/^[[:space:]]*//;s/[[:space:]]*$//' file.txt`,
      ].join("\n") };
    }
    if (op==="extract") {
      const col = m[1] || "2";
      return { output: [
        `# Spalte ${col} aus CSV/TSV:`,
        `awk -F',' '{print $${col}}' file.csv`,``,
        `# Spalte ${col} aus Leerzeichen-getrenntem:`,
        `awk '{print $${col}}' file.txt`,``,
        `# Zeilen zwischen zwei Mustern:`,
        `sed -n '/START/,/END/p' file.txt`,``,
        `# N-te Zeile:`,
        `sed -n '${col}p' file.txt`,
      ].join("\n") };
    }
    if (op==="count") {
      return { output: [
        `# Zeilen zählen:`,
        `wc -l file.txt`,``,
        `# Zeilen die Pattern enthalten:`,
        `grep -c 'pattern' file.txt`,``,
        `# Wörter zählen:`,
        `wc -w file.txt`,``,
        `# Vorkommen eines Strings:`,
        `grep -o 'pattern' file.txt | wc -l`,``,
        `# Unique Zeilen zählen:`,
        `sort file.txt | uniq -c | sort -rn`,
      ].join("\n") };
    }
    if (op==="sum") {
      const col = m[1] || "1";
      return { output: [
        `# Spalte ${col} summieren:`,
        `awk '{sum += $${col}} END {print sum}' file.txt`,``,
        `# CSV-Spalte ${col} summieren:`,
        `awk -F',' '{sum += $${col}} END {print sum}' file.csv`,``,
        `# Min/Max/Average:`,
        `awk '{if(NR==1||$${col}<min)min=$${col}; if($${col}>max)max=$${col}; sum+=$${col}} END {print "min:"min" max:"max" avg:"sum/NR}' file.txt`,
      ].join("\n") };
    }
    return { output: [
      `Verfügbare Operationen:`,``,
      `  replace <from> <to>  — s/from/to/g`,
      `  delete <pattern>     — Zeilen löschen`,
      `  extract <column>     — Spalte extrahieren`,
      `  count               — Zeilen/Wörter/Vorkommen`,
      `  sum <column>        — Spalte summieren`,
      ``,
      `Nützliche Einzeiler:`,
      `  # Header (erste Zeile):`,
      `  head -1 file.csv`,
      `  # Letzte N Zeilen:`,
      `  tail -N file.txt`,
      `  # Duplikate entfernen:`,
      `  sort file.txt | uniq`,
      `  # Felder umkehren:`,
      `  awk '{for(i=NF;i>0;i--) printf $i" "; print ""}' file.txt`,
    ].join("\n") };
  },
});
