import { defineTool } from "../core";

export default defineTool({
  id: "api-mock",
  title: "API Mock Generator",
  titleDe: "API-Mock-Generator",
  description: "Generate mock API responses in JSON from a simple schema description.",
  descriptionDe: "Mock-API-Antworten als JSON aus einer einfachen Schema-Beschreibung generieren.",
  explanation: "Describe fields one per line: fieldName:type. Types: string, number, boolean, email, uuid, date, name, ip, url, lorem.",
  explanationDe: "Felder je Zeile beschreiben: Feldname:Typ. Typen: string, number, boolean, email, uuid, date, name, ip, url, lorem.",
  category: "Development",
  keywords: ["mock","api","json","faker","test","dummy","data","generate","schema"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "id:uuid\nname:name\nemail:email\nage:number\nactive:boolean\ncreatedAt:date",
  example: "id:uuid\nusername:string\nemail:email\nrole:string\ncreatedAt:date",
  useCasesDe: ["API-Tests schreiben","Frontend ohne Backend entwickeln","Fixtures generieren"],
  run: (input) => {
    const lines = input.trim().split("\n").filter(l=>l.trim()&&l.includes(":"));
    if (!lines.length) throw new Error("Format: feldName:typ (je Zeile)");
    const count = Math.min(5, parseInt(lines.find(l=>l.startsWith("count:"))?.split(":")[1]||"3"));
    const fields = lines.filter(l=>!l.startsWith("count:"));
    const NAMES = ["Alice","Bob","Carol","Dave","Eve","Frank","Grace","Heidi","Ivan","Judy"];
    const DOMAINS = ["gmail.com","example.com","test.org","company.de"];
    const WORDS = ["Lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do"];
    const generate = (type: string, idx: number): unknown => {
      switch(type.toLowerCase()) {
        case "uuid": return `${Math.random().toString(36).slice(2,10)}-${Math.random().toString(36).slice(2,6)}-4${Math.random().toString(36).slice(2,5)}-${Math.random().toString(36).slice(2,6)}-${Math.random().toString(36).slice(2,14)}`;
        case "number": case "int": return Math.floor(Math.random()*100)+1;
        case "float": return parseFloat((Math.random()*100).toFixed(2));
        case "boolean": case "bool": return idx % 2 === 0;
        case "email": return `${NAMES[idx%NAMES.length].toLowerCase()}@${DOMAINS[idx%DOMAINS.length]}`;
        case "name": return NAMES[idx%NAMES.length];
        case "date": return new Date(Date.now() - Math.random()*1e10).toISOString().slice(0,10);
        case "datetime": return new Date(Date.now() - Math.random()*1e10).toISOString();
        case "ip": return `192.168.${idx+1}.${Math.floor(Math.random()*254)+1}`;
        case "url": return `https://example.com/${WORDS[idx%WORDS.length].toLowerCase()}`;
        case "lorem": return WORDS.slice(0,5+idx%5).join(" ").toLowerCase();
        case "null": return null;
        default: return `${type}_${idx+1}`;
      }
    };
    const records = Array.from({length:count},(_,i)=>{
      const obj: Record<string,unknown> = {};
      fields.forEach(line=>{ const [k,...rest]=line.split(":"); obj[k.trim()]=generate(rest.join(":").trim(),i); });
      return obj;
    });
    return { output: JSON.stringify(records.length===1?records[0]:records, null, 2) };
  },
});
