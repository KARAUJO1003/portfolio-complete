import { env } from "@/core/config/env";

const legacyStaticMediaBaseUrl =
  "https://raw.githubusercontent.com/KARAUJO1003/portifolio.web.1.4.0/03789996fcb7a97e52324d1747d8398f772056b7/portifolio/public";

const legacyStaticMediaPaths: Record<string, string> = {
  "/_next/static/media/banner-buzzy.c1fb7a40.jpg": "buzzy/banner-buzzy.jpg",
  "/_next/static/media/bannerLight2.jpeg.05ee2be7.png": "rename-files/bannerLight2.jpeg.png",
  "/_next/static/media/conversor-app02.36efe9a1.png": "conversor-app02.png",
  "/_next/static/media/finance-bg.4d620d2f.png": "finance-bg.png",
  "/_next/static/media/ligth.ee121dc3.png": "kanban/ligth.png",
  "/_next/static/media/org-light.414bb07a.jpeg": "organograma/org-light.jpeg",
  "/_next/static/media/orion-tasks01.cb1c5d2d.png": "orion-tasks01.png",
  "/_next/static/media/portifolio-image01.a1f43567.png": "portifolio-image01.png",
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
    const replacementPath = legacyStaticMediaPaths[url.pathname];

    if (url.hostname === "portfolio.kaesyo.com" && replacementPath) {
      return `${legacyStaticMediaBaseUrl}/${replacementPath}`;
    }
  } catch {
    return path;
  }

  return path;
}
