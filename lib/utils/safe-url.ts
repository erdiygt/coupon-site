const BLOCKED_PROTOCOLS = /^(javascript|data|vbscript|file|blob):/i;

function isPrivateOrLoopbackHost(hostname: string): boolean {
  const host = hostname.toLowerCase();

  if (host === "localhost" || host.endsWith(".localhost")) return true;
  if (host === "0.0.0.0") return true;

  if (host.startsWith("127.")) return true;
  if (host.startsWith("10.")) return true;
  if (host.startsWith("192.168.")) return true;

  const match = /^172\.(\d+)\./.exec(host);
  if (match) {
    const second = Number(match[1]);
    if (second >= 16 && second <= 31) return true;
  }

  if (host.includes(":")) {
    if (host === "::1" || host.startsWith("fc") || host.startsWith("fd")) return true;
  }

  return false;
}

/** Yalnızca güvenli https URL'leri kabul eder. */
export function assertSafeHttpsUrl(raw: string | null | undefined): URL | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("//")) return null;
  if (BLOCKED_PROTOCOLS.test(trimmed)) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (url.protocol !== "https:") return null;
  if (!url.hostname) return null;
  if (isPrivateOrLoopbackHost(url.hostname)) return null;

  return url;
}

export function safeHttpsUrlString(raw: string | null | undefined): string {
  return assertSafeHttpsUrl(raw)?.toString() ?? "";
}

export function redirectNoIndexHeaders(): HeadersInit {
  return { "X-Robots-Tag": "noindex, nofollow" };
}
