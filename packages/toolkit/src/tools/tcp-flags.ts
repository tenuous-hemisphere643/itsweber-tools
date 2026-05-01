import { defineTool } from "../core";

export default defineTool({
  id: "tcp-flags",
  title: "TCP Flags Decoder",
  titleDe: "TCP-Flags-Decoder",
  description: "Decode TCP flags from a hex byte or flag names and explain their meaning.",
  descriptionDe: "TCP-Flags aus einem Hex-Byte oder Flag-Namen dekodieren und deren Bedeutung erklären.",
  explanation: "Enter a hex value (e.g. 0x18 or 18) or flag names (SYN, ACK, FIN, RST, PSH, URG, ECE, CWR).",
  explanationDe: "Hex-Wert eingeben (z.B. 0x18 oder 18) oder Flag-Namen (SYN, ACK, FIN, RST, PSH, URG, ECE, CWR).",
  category: "Network",
  keywords: ["tcp","flags","syn","ack","fin","rst","psh","urg","wireshark","packet","protocol"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "0x18",
  example: "SYN ACK",
  useCasesDe: ["Wireshark-Pakete verstehen","TCP-Handshake debuggen","Netzwerk-Analyse"],
  run: (input) => {
    const FLAGS = [
      {bit:0x01,name:"FIN",desc:"Verbindungsende (letzte Daten)"},
      {bit:0x02,name:"SYN",desc:"Verbindungsaufbau"},
      {bit:0x04,name:"RST",desc:"Verbindungs-Reset (Fehler)"},
      {bit:0x08,name:"PSH",desc:"Daten sofort weiterleiten"},
      {bit:0x10,name:"ACK",desc:"Bestätigung"},
      {bit:0x20,name:"URG",desc:"Urgent-Daten"},
      {bit:0x40,name:"ECE",desc:"ECN-Echo"},
      {bit:0x80,name:"CWR",desc:"Congestion Window Reduced"},
    ];
    const t = input.trim().toUpperCase();
    let byte: number;
    if (/^0?X?[0-9A-F]{1,2}$/i.test(t.replace("0X",""))) {
      byte = parseInt(t.replace("0X",""), 16);
    } else {
      const names = t.split(/[\s,|]+/);
      byte = 0;
      for (const n of names) {
        const f = FLAGS.find(f=>f.name===n);
        if (!f) throw new Error(`Unbekanntes Flag: ${n}. Erlaubt: ${FLAGS.map(f=>f.name).join(", ")}`);
        byte |= f.bit;
      }
    }
    const active = FLAGS.filter(f=>(byte & f.bit) !== 0);
    const inactive = FLAGS.filter(f=>(byte & f.bit) === 0);
    return { output: [
      `Byte:  0x${byte.toString(16).padStart(2,"0").toUpperCase()} (${byte})`,
      `Binär: ${byte.toString(2).padStart(8,"0")}`,``,
      active.length ? `Gesetzt (${active.length}):` : "Keine Flags gesetzt",
      ...active.map(f=>`  ✓ ${f.name.padEnd(4)}  ${f.desc}`),
      inactive.length && active.length ? `` : "",
      ...(active.length ? [`Nicht gesetzt:`,...inactive.map(f=>`  ✗ ${f.name}`)] : []),``,
      active.length===2 && active.find(f=>f.name==="SYN") && active.find(f=>f.name==="ACK") ? "→ TCP-Handshake Schritt 2 (SYN-ACK)" : "",
      active.length===1 && active[0].name==="SYN" ? "→ TCP-Handshake Schritt 1 (SYN)" : "",
      active.length===1 && active[0].name==="ACK" ? "→ TCP-Handshake Schritt 3 oder Datenübertragung" : "",
      active.length===1 && active[0].name==="FIN" ? "→ Verbindungsabbau eingeleitet" : "",
      active.length===1 && active[0].name==="RST" ? "→ Verbindung abgebrochen (Fehler/Reject)" : "",
    ].filter(l=>l!=="").join("\n") };
  },
});
