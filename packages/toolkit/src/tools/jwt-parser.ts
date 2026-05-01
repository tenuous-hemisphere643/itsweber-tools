import { defineTool } from "../core";
import { base64UrlDecode } from "../shared";

function parseJwt(value: string): string {
  const [header, payload] = value.trim().split(".");
  if (!header || !payload) {
    throw new Error("JWT must contain at least header and payload.");
  }
  return JSON.stringify(
    {
      header: JSON.parse(base64UrlDecode(header)),
      payload: JSON.parse(base64UrlDecode(payload)),
      note: "Signature is not verified by this parser.",
    },
    null,
    2,
  );
}

export default defineTool({
  id: "jwt-parser",
  title: "JWT Parser",
  titleDe: "JWT-Parser",
  description: "Decodes JWT header and payload without verification.",
  descriptionDe: "Dekodiert JWT-Header und Payload ohne Verifikation.",
  explanation:
    "JWTs often contain readable JSON inside. This parser helps inspect claims, but it does not prove that the token is valid.",
  explanationDe:
    "JWTs enthalten oft lesbares JSON. Dieser Parser hilft beim Prüfen der Claims, beweist aber nicht, dass der Token gültig ist.",
  category: "Web",
  keywords: ["jwt", "token", "decode"],
  status: "ready",
  privacyMode: "local-only",
  placeholder: "Paste JWT...",
  example: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpdHN3ZWJlciJ9.signature",
  run: (input) => ({ output: parseJwt(input) }),
});
