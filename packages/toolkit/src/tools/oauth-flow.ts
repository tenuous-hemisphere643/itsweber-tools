import { defineTool } from "../core";

export default defineTool({
  id: "oauth-flow",
  title: "OAuth 2.0 URL Builder",
  titleDe: "OAuth-2.0-URL-Builder",
  description: "Build OAuth 2.0 authorization URLs (Authorization Code Flow) for common providers.",
  descriptionDe: "OAuth-2.0-Autorisierungs-URLs (Authorization Code Flow) für gängige Provider erstellen.",
  explanation: "Enter: provider (github, google, microsoft, custom), client_id, scope, redirect_uri, and optional state.",
  explanationDe: "Provider eingeben (github, google, microsoft, custom), client_id, scope, redirect_uri und optionalen state.",
  category: "Web",
  keywords: ["oauth","oauth2","auth","authorization","github","google","pkce","redirect","token"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "provider: github\nclient_id: abc123\nscope: read:user repo\nredirect_uri: http://localhost:3000/callback",
  example: "provider: google\nclient_id: 1234567890.apps.googleusercontent.com\nscope: openid email profile\nredirect_uri: https://myapp.com/callback",
  useCasesDe: ["OAuth-URLs testen","Auth-Flows implementieren","Social-Login einrichten"],
  run: (input) => {
    const kv: Record<string,string> = {};
    input.split("\n").forEach(l=>{ const i=l.indexOf(":"); if(i>0) kv[l.slice(0,i).trim().toLowerCase()]=l.slice(i+1).trim(); });
    const provider = kv.provider?.toLowerCase() || "custom";
    const clientId = kv.client_id || kv.clientid || "";
    if (!clientId) throw new Error("'client_id' ist erforderlich");
    const scope = kv.scope || "";
    const redirectUri = kv.redirect_uri || kv.redirecturi || "";
    const state = kv.state || crypto.randomUUID().slice(0,8);
    const endpoints: Record<string,string> = {
      github: "https://github.com/login/oauth/authorize",
      google: "https://accounts.google.com/o/oauth2/v2/auth",
      microsoft: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
      custom: kv.endpoint || "https://provider.example.com/oauth/authorize",
    };
    const base = endpoints[provider] || kv.endpoint || endpoints.custom;
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      ...(scope ? { scope } : {}),
      ...(redirectUri ? { redirect_uri: redirectUri } : {}),
      state,
    });
    const url = `${base}?${params.toString()}`;
    return { output: [
      `Authorization URL:`,url,``,
      `Parameter:`,
      `  client_id:     ${clientId}`,
      `  response_type: code`,
      `  scope:         ${scope||"(keine)"}`,
      `  redirect_uri:  ${redirectUri||"(keine)"}`,
      `  state:         ${state}`,``,
      `Nächste Schritte:`,
      `  1. User auf URL weiterleiten`,
      `  2. Code aus Redirect-URL extrahieren`,
      `  3. Code gegen Token tauschen (POST ${provider==="github"?"https://github.com/login/oauth/access_token":base.replace("/authorize","/token")})`,
    ].join("\n") };
  },
});
