import { resolveFileUrl } from "@/core/files/file-url";

export function getFileUrl(path: string | null | undefined) {
  if (!path) return null;
  return resolveFileUrl(path) || null;
}
