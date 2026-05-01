import { defineTool } from "../core";

export default defineTool({
  id: "wireguard-gen",
  title: "WireGuard Config Generator",
  titleDe: "WireGuard-Konfigurations-Generator",
  description: "Generate WireGuard server and client configuration templates.",
  descriptionDe: "WireGuard-Server- und Client-Konfigurationsvorlagen generieren.",
  explanation: "Enter: server or client. Optional: server-ip, port, dns, subnet, peer-public-key, endpoint.",
  explanationDe: "server oder client eingeben. Optional: server-ip, port, dns, subnet, peer-public-key, endpoint.",
  category: "ItsWeber Ops",
  keywords: ["wireguard","vpn","wg","tunnel","peer","config","server","client","network"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "server",
  example: "client",
  useCasesDe: ["WireGuard-Server konfigurieren","VPN-Client einrichten","Peer-Konfiguration erstellen"],
  run: (input) => {
    const lines = input.trim().split("\n");
    const role = lines[0].trim().toLowerCase();
    const kv: Record<string,string> = {};
    lines.slice(1).forEach(l=>{ const i=l.indexOf(":"); if(i>0) kv[l.slice(0,i).trim().toLowerCase()]=l.slice(i+1).trim(); });
    const port = kv.port || "51820";
    const subnet = kv.subnet || "10.0.0.0/24";
    const serverIp = kv["server-ip"] || kv.serverip || "YOUR_SERVER_IP";
    const dns = kv.dns || "1.1.1.1, 8.8.8.8";
    if (role==="server") return { output: [
      `# WireGuard Server (/etc/wireguard/wg0.conf)`,
      `# Vorher Keys generieren: wg genkey | tee server-private.key | wg pubkey > server-public.key`,``,
      `[Interface]`,
      `PrivateKey = <SERVER_PRIVATE_KEY>`,
      `Address = ${subnet.replace(/\d+\/\d+$/,"1/24")}`,
      `ListenPort = ${port}`,
      ``,
      `# PostUp/PostDown für NAT (optional):`,
      `PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE`,
      `PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE`,
      ``,
      `# Peer (Client):`,
      `[Peer]`,
      `PublicKey = <CLIENT_PUBLIC_KEY>`,
      `AllowedIPs = ${subnet.replace(/\.\d+\/\d+$/,".2/32")}`,
      ``,
      `# Starten:`,
      `wg-quick up wg0`,
      `systemctl enable wg-quick@wg0`,
    ].join("\n") };
    if (role==="client") return { output: [
      `# WireGuard Client (/etc/wireguard/wg0.conf)`,
      `# Vorher Keys generieren: wg genkey | tee client-private.key | wg pubkey > client-public.key`,``,
      `[Interface]`,
      `PrivateKey = <CLIENT_PRIVATE_KEY>`,
      `Address = ${subnet.replace(/\.\d+\/\d+$/,".2/32")}`,
      `DNS = ${dns}`,
      ``,
      `[Peer]`,
      `PublicKey = ${kv["peer-public-key"]||"<SERVER_PUBLIC_KEY>"}`,
      `Endpoint = ${serverIp}:${port}`,
      `AllowedIPs = 0.0.0.0/0, ::/0`,
      `PersistentKeepalive = 25`,
    ].join("\n") };
    throw new Error("'server' oder 'client' eingeben");
  },
});
