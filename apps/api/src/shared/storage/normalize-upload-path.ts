import path from "node:path";

export function normalizeUploadPath(input: {
  folder: string;
  filename: string;
}) {
  const safeFolder = input.folder
    .split(/[\\/]+/)
    .filter(Boolean)
    .map((part) => part.replace(/[^a-zA-Z0-9-_]/g, "-"))
    .join("/");

  const safeFile = input.filename.replace(/[^a-zA-Z0-9-_.]/g, "-");
  const relative = path.posix.join("/", safeFolder, safeFile);

  if (relative.includes("..")) {
    throw new Error("Invalid upload path");
  }

  return relative;
}
