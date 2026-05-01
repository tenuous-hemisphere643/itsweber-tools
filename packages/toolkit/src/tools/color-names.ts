import { defineTool } from "../core";

const CSS_COLORS: [string,string][] = [
  ["aliceblue","#f0f8ff"],["antiquewhite","#faebd7"],["aqua","#00ffff"],["aquamarine","#7fffd4"],
  ["azure","#f0ffff"],["beige","#f5f5dc"],["bisque","#ffe4c4"],["black","#000000"],
  ["blanchedalmond","#ffebcd"],["blue","#0000ff"],["blueviolet","#8a2be2"],["brown","#a52a2a"],
  ["burlywood","#deb887"],["cadetblue","#5f9ea0"],["chartreuse","#7fff00"],["chocolate","#d2691e"],
  ["coral","#ff7f50"],["cornflowerblue","#6495ed"],["cornsilk","#fff8dc"],["crimson","#dc143c"],
  ["cyan","#00ffff"],["darkblue","#00008b"],["darkcyan","#008b8b"],["darkgoldenrod","#b8860b"],
  ["darkgray","#a9a9a9"],["darkgreen","#006400"],["darkkhaki","#bdb76b"],["darkmagenta","#8b008b"],
  ["darkolivegreen","#556b2f"],["darkorange","#ff8c00"],["darkorchid","#9932cc"],["darkred","#8b0000"],
  ["darksalmon","#e9967a"],["darkseagreen","#8fbc8f"],["darkslateblue","#483d8b"],["darkslategray","#2f4f4f"],
  ["darkturquoise","#00ced1"],["darkviolet","#9400d3"],["deeppink","#ff1493"],["deepskyblue","#00bfff"],
  ["dimgray","#696969"],["dodgerblue","#1e90ff"],["firebrick","#b22222"],["floralwhite","#fffaf0"],
  ["forestgreen","#228b22"],["fuchsia","#ff00ff"],["gainsboro","#dcdcdc"],["ghostwhite","#f8f8ff"],
  ["gold","#ffd700"],["goldenrod","#daa520"],["gray","#808080"],["green","#008000"],
  ["greenyellow","#adff2f"],["honeydew","#f0fff0"],["hotpink","#ff69b4"],["indianred","#cd5c5c"],
  ["indigo","#4b0082"],["ivory","#fffff0"],["khaki","#f0e68c"],["lavender","#e6e6fa"],
  ["lawngreen","#7cfc00"],["lemonchiffon","#fffacd"],["lightblue","#add8e6"],["lightcoral","#f08080"],
  ["lightcyan","#e0ffff"],["lightgray","#d3d3d3"],["lightgreen","#90ee90"],["lightpink","#ffb6c1"],
  ["lightsalmon","#ffa07a"],["lightseagreen","#20b2aa"],["lightskyblue","#87cefa"],["lightsteelblue","#b0c4de"],
  ["lightyellow","#ffffe0"],["lime","#00ff00"],["limegreen","#32cd32"],["linen","#faf0e6"],
  ["magenta","#ff00ff"],["maroon","#800000"],["mediumblue","#0000cd"],["mediumorchid","#ba55d3"],
  ["mediumpurple","#9370db"],["mediumseagreen","#3cb371"],["mediumslateblue","#7b68ee"],["mediumturquoise","#48d1cc"],
  ["midnightblue","#191970"],["mintcream","#f5fffa"],["mistyrose","#ffe4e1"],["moccasin","#ffe4b5"],
  ["navy","#000080"],["oldlace","#fdf5e6"],["olive","#808000"],["olivedrab","#6b8e23"],
  ["orange","#ffa500"],["orangered","#ff4500"],["orchid","#da70d6"],["palegoldenrod","#eee8aa"],
  ["palegreen","#98fb98"],["paleturquoise","#afeeee"],["palevioletred","#db7093"],["papayawhip","#ffefd5"],
  ["peachpuff","#ffdab9"],["peru","#cd853f"],["pink","#ffc0cb"],["plum","#dda0dd"],
  ["powderblue","#b0e0e6"],["purple","#800080"],["red","#ff0000"],["rosybrown","#bc8f8f"],
  ["royalblue","#4169e1"],["saddlebrown","#8b4513"],["salmon","#fa8072"],["sandybrown","#f4a460"],
  ["seagreen","#2e8b57"],["seashell","#fff5ee"],["sienna","#a0522d"],["silver","#c0c0c0"],
  ["skyblue","#87ceeb"],["slateblue","#6a5acd"],["slategray","#708090"],["snow","#fffafa"],
  ["springgreen","#00ff7f"],["steelblue","#4682b4"],["tan","#d2b48c"],["teal","#008080"],
  ["thistle","#d8bfd8"],["tomato","#ff6347"],["turquoise","#40e0d0"],["violet","#ee82ee"],
  ["wheat","#f5deb3"],["white","#ffffff"],["whitesmoke","#f5f5f5"],["yellow","#ffff00"],
  ["yellowgreen","#9acd32"],
];

export default defineTool({
  id: "color-names",
  title: "CSS Color Names",
  titleDe: "CSS-Farbnamen",
  description: "Look up CSS color names and their hex values, or find the nearest named color for a hex code.",
  descriptionDe: "CSS-Farbnamen und ihre Hex-Werte nachschlagen oder den nächsten Farbnamen für einen Hex-Code finden.",
  explanation: "Enter a color name (e.g. 'coral'), a hex code (#ff7f50), or 'all' for all colors.",
  explanationDe: "Farbnamen eingeben (z.B. 'coral'), einen Hex-Code (#ff7f50) oder 'all' für alle Farben.",
  category: "Web",
  keywords: ["color","farbe","css","name","hex","named","lookup","web","palette"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "coral",
  example: "#4682b4",
  useCasesDe: ["CSS-Farbnamen lernen","Farbton-Alternativen finden","Hex → Name übersetzen"],
  run: (input) => {
    const t = input.trim().toLowerCase().replace(/\s+/g,"");
    if (t==="all") return { output: CSS_COLORS.map(([n,h])=>`${h}  ${n}`).join("\n") };
    if (t.startsWith("#")) {
      const hexToRgb = (h: string): [number,number,number] => {
        const s = h.replace("#",""); const f = s.length===3?s.split("").map(c=>c+c).join(""):s;
        return [parseInt(f.slice(0,2),16),parseInt(f.slice(2,4),16),parseInt(f.slice(4,6),16)];
      };
      const [r,g,b] = hexToRgb(t);
      const dist = ([,h]: [string,string]) => { const [r2,g2,b2]=hexToRgb(h); return Math.sqrt((r-r2)**2+(g-g2)**2+(b-b2)**2); };
      const sorted = [...CSS_COLORS].sort((a,b)=>dist(a)-dist(b)).slice(0,5);
      return { output: [`Nächste CSS-Farbnamen für ${t}:`,``,...sorted.map(([n,h])=>`${h}  ${n}`)].join("\n") };
    }
    const exact = CSS_COLORS.find(([n])=>n===t);
    if (exact) return { output: `${exact[0]}  →  ${exact[1]}` };
    const fuzzy = CSS_COLORS.filter(([n])=>n.includes(t));
    if (!fuzzy.length) throw new Error(`Keine CSS-Farbe für '${input}' gefunden`);
    return { output: fuzzy.map(([n,h])=>`${h}  ${n}`).join("\n") };
  },
});
