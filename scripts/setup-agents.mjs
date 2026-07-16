// Liga `.claude/skills` a `.agents/skills` para que Claude Code e Codex leiam
// as mesmas skills. `.agents/skills` e a fonte unica versionada; o link nao vai
// para o Git porque `core.symlinks` esta desligado neste repositorio.
import { existsSync, lstatSync, mkdirSync, readlinkSync, rmSync, symlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, ".agents", "skills");
const link = join(root, ".claude", "skills");

if (!existsSync(source)) {
  console.error(`[setup-agents] fonte nao encontrada: ${source}`);
  process.exit(1);
}

if (existsSync(link) || lstatSync(link, { throwIfNoEntry: false })) {
  const stats = lstatSync(link);

  if (stats.isSymbolicLink()) {
    if (resolve(dirname(link), readlinkSync(link)) === source) {
      console.log("[setup-agents] link ja aponta para .agents/skills");
      process.exit(0);
    }
    rmSync(link, { recursive: true, force: true });
  } else {
    console.error(
      `[setup-agents] ${link} existe como diretorio real. Mova o conteudo para .agents/skills e rode de novo.`,
    );
    process.exit(1);
  }
}

mkdirSync(dirname(link), { recursive: true });
// "junction" evita exigir modo desenvolvedor/admin no Windows.
symlinkSync(source, link, process.platform === "win32" ? "junction" : "dir");
console.log("[setup-agents] .claude/skills -> .agents/skills");
