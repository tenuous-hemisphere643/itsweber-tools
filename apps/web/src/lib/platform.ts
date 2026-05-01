export function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  // userAgentData is available in modern Chromium browsers
  const platform =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigator as any).userAgentData?.platform ?? navigator.platform ?? "";
  return /mac/i.test(platform);
}

export function modKey(): string {
  return isMac() ? "⌘" : "Ctrl";
}

export function modKeyLabel(key: string): string {
  return isMac() ? `⌘${key}` : `Ctrl+${key}`;
}
