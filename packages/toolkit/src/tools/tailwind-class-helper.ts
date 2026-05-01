import { defineTool } from "../core";

export default defineTool({
  id: "tailwind-class-helper",
  title: "Tailwind CSS Class Helper",
  titleDe: "Tailwind-CSS-Klassen-Helfer",
  description: "Look up Tailwind CSS utility classes by category or search term.",
  descriptionDe: "Tailwind-CSS-Utility-Klassen nach Kategorie oder Suchbegriff nachschlagen.",
  explanation: "Enter a category: spacing, typography, colors, flex, grid, sizing, borders, shadows. Or search for a property like 'padding'.",
  explanationDe: "Kategorie eingeben: spacing, typography, colors, flex, grid, sizing, borders, shadows. Oder nach Eigenschaft suchen: 'padding'.",
  category: "Web",
  keywords: ["tailwind","css","utility","class","helper","flex","grid","spacing","color","typography"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "spacing",
  example: "flex",
  useCasesDe: ["Tailwind-Klassen nachschlagen","CSS-Eigenschaften finden","Layout-Klassen lernen"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    const sections: Record<string,string[]> = {
      spacing: ["p-{0-96}  padding","px-{n}  padding-x","py-{n}  padding-y","pt/pr/pb/pl  padding-single","m-{0-96}  margin","mx-auto  zentrieren","gap-{n}  flex/grid gap","space-x-{n}  Abstand zwischen Kinder (x)","space-y-{n}  Abstand zwischen Kinder (y)"],
      typography: ["text-xs/sm/base/lg/xl/2xl..9xl  font-size","font-thin/light/normal/medium/semibold/bold/black","italic  font-style","tracking-tight/normal/wide/wider/widest  letter-spacing","leading-none/tight/normal/relaxed/loose  line-height","uppercase/lowercase/capitalize/normal-case","truncate  text overflow","text-left/center/right/justify"],
      colors: ["text-{color}-{50-950}  Textfarbe","bg-{color}-{50-950}  Hintergrundfarbe","border-{color}-{n}  Rahmenfarbe","Colors: slate,gray,zinc,red,orange,amber,yellow,lime,green,teal,cyan,sky,blue,indigo,violet,purple,fuchsia,pink,rose"],
      flex: ["flex  display:flex","flex-row/col/row-reverse/col-reverse","flex-wrap/nowrap/wrap-reverse","justify-start/end/center/between/around/evenly","items-start/end/center/baseline/stretch","flex-1/auto/none  flex","self-start/end/center/stretch"],
      grid: ["grid  display:grid","grid-cols-{1-12}/none  grid-template-columns","col-span-{1-12}  grid-column span","grid-rows-{1-6}  grid-template-rows","row-span-{n}  grid-row span","gap-{n}  grid-gap","place-items-center  shorthand"],
      sizing: ["w-{0-96/%/screen/full/auto}  width","h-{n}  height","min-w/max-w/min-h/max-h","w-full  100%","w-screen  100vw","aspect-square/video  aspect-ratio"],
      borders: ["border  1px border","border-{0,2,4,8}  border-width","border-{color}  border-color","rounded/rounded-{sm,md,lg,xl,2xl,3xl,full}","border-dashed/dotted/solid","outline-{n}  outline"],
      shadows: ["shadow/shadow-sm/md/lg/xl/2xl  box-shadow","shadow-inner  innerer Schatten","drop-shadow-{size}  filter drop-shadow","ring-{0-8}  outline-ring (focus)","ring-{color}","ring-offset-{n}"],
    };
    if (t in sections) return { output: sections[t].join("\n") };
    const allEntries = Object.entries(sections).flatMap(([cat,lines])=>lines.map(l=>[cat,l] as [string,string]));
    const matches = allEntries.filter(([,l])=>l.toLowerCase().includes(t));
    if (!matches.length) throw new Error(`Keine Klassen für '${input}'.\nKategorien: ${Object.keys(sections).join(", ")}`);
    return { output: matches.map(([cat,l])=>`[${cat}]  ${l}`).join("\n") };
  },
});
