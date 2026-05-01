import { defineTool } from "../core";

const EMOJIS: [string,string,string][] = [
  ["😀","Grinning Face","grin lachen happy"],["😂","Face with Tears of Joy","lol crying laugh"],
  ["🥹","Face Holding Back Tears","emotional touching"],["😍","Heart Eyes","love heart verliebt"],
  ["🤔","Thinking Face","thinking denken hmm"],["😎","Cool Sunglasses","cool sunglasses"],
  ["🤯","Exploding Head","mind blown wow"],["😴","Sleeping Face","sleep müde tired"],
  ["👍","Thumbs Up","ok good daumen hoch"],["👎","Thumbs Down","bad nein daumen runter"],
  ["👋","Waving Hand","hello hi hallo bye"],["🙏","Folded Hands","please thank you danke"],
  ["👏","Clapping Hands","applause klatschen bravo"],["🔥","Fire","fire hot trend trending"],
  ["✨","Sparkles","new shine glitter sparkle"],["💡","Light Bulb","idea idee tipp tip"],
  ["⚠️","Warning","warn warning vorsicht"],["❌","Cross Mark","no error wrong fehler"],
  ["✅","Check Mark","yes ok done fertig"],["🔒","Locked","security secure locked"],
  ["🔓","Unlocked","open unlock offen"],["🐛","Bug","bug fehler issue"],
  ["🚀","Rocket","launch deploy ship fast"],["🎉","Party Popper","celebrate done release"],
  ["📦","Package","package deploy bundle"],["🔧","Wrench","fix repair tool werkzeug"],
  ["🔨","Hammer","build hammer build"],["📋","Clipboard","copy paste list"],
  ["📝","Memo","note write notiz"],["🗂️","Card Index Dividers","folder organize"],
  ["💻","Laptop","computer dev developer"],["🖥️","Desktop","server desktop monitor"],
  ["📱","Mobile Phone","mobile phone ios android"],["⌨️","Keyboard","keyboard tastatur typing"],
  ["🐳","Whale","docker container whale"],["🐧","Penguin","linux penguin ubuntu"],
  ["🍎","Apple","mac macos apple"],["🪟","Window","windows microsoft"],
  ["☁️","Cloud","cloud server aws azure"],["🌐","Globe","web internet network"],
  ["🔑","Key","key schlüssel auth password"],["🗝️","Old Key","key api access token"],
  ["🔐","Locked with Key","secure auth protected"],["🛡️","Shield","security shield protect"],
  ["⚡","Lightning","fast speed performance"],["🎯","Target","goal ziel focus"],
  ["📊","Bar Chart","chart stats metrics"],["📈","Chart Up","growth wachstum increase"],
  ["🕐","One O'Clock","time uhrzeit clock"],["⏰","Alarm Clock","deadline reminder alarm"],
];

export default defineTool({
  id: "emoji-lookup",
  title: "Emoji Lookup",
  titleDe: "Emoji-Nachschlagewerk",
  description: "Search and copy emojis by name or keyword — perfect for commit messages and docs.",
  descriptionDe: "Emojis nach Name oder Schlüsselwort suchen und kopieren — ideal für Commit-Messages und Docs.",
  explanation: "Enter a keyword to search (e.g. 'fire', 'docker', 'error'). Or 'all' for all available emojis.",
  explanationDe: "Schlüsselwort eingeben (z.B. 'fire', 'docker', 'fehler'). Oder 'all' für alle verfügbaren Emojis.",
  category: "Text",
  keywords: ["emoji","search","find","kopieren","commit","message","icon","symbol"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "rocket",
  example: "docker",
  useCasesDe: ["Commit-Messages aufwerten","README-Emojis finden","Kommunikation aufhellen"],
  run: (input) => {
    const t = input.trim().toLowerCase();
    if (t==="all") return { output: EMOJIS.map(([e,n])=>`${e}  ${n}`).join("\n") };
    const results = EMOJIS.filter(([e,n,k])=>n.toLowerCase().includes(t)||k.toLowerCase().includes(t)||e===input.trim());
    if (!results.length) return { output: `Kein Emoji für '${input}' gefunden.\n\nVerfügbare Kategorien: docker, security, fire, check, error, deploy, time, chart...` };
    return { output: results.map(([e,n])=>`${e}  ${n}`).join("\n") };
  },
});
