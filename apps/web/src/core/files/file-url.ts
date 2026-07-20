import { env } from "@/core/config/env";

const legacyStaticMediaHosts: Record<string, string> = {
  "portfolio.kaesyo.com": "www.kaesyo.com",
};

export function resolveFileUrl(path?: string) {
  if (!path) {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return resolveLegacyStaticMediaUrl(path);
  }

  const normalizedBase = env.baseUrlFiles.replace(/\/$/, "");
  const normalizedPath = path.replace(/^\//, "");

  return `${normalizedBase}/${normalizedPath}`;
}

function resolveLegacyStaticMediaUrl(path: string) {
  try {
    const url = new URL(path);
    const replacementHost = legacyStaticMediaHosts[url.hostname];

    if (replacementHost && url.pathname.startsWith("/_next/static/media/")) {
      url.hostname = replacementHost;
      return url.toString();
    }
  } catch {
    return path;
  }

  return path;
}
