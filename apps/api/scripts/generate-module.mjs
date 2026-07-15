import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

async function readStdin() { let value = ""; for await (const chunk of process.stdin) value += chunk; return value; }
const pipedAnswers = process.stdin.isTTY ? [] : (await readStdin()).split(/\r?\n/);
const rl = process.stdin.isTTY ? createInterface({ input: process.stdin, output: process.stdout }) : null;
const ask = async (label, fallback = "") => {
  const answer = rl ? await rl.question(`${label}${fallback ? ` (${fallback})` : ""}: `) : pipedAnswers.shift() ?? "";
  return answer.trim() || fallback;
};
const kebab = (value) => value.trim().replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase().replace(/^-|-$/g, "");
const pascal = (value) => kebab(value).split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("");
const camel = (value) => { const name = pascal(value); return name[0].toLowerCase() + name.slice(1); };
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const outputRoot = process.env.GENERATOR_OUTPUT_ROOT ? path.resolve(process.env.GENERATOR_OUTPUT_ROOT) : root;
const templates = path.join(scriptDir, "templates", "module");

try {
  const name = kebab(await ask("Nome do modulo"));
  if (!name) throw new Error("Nome do modulo e obrigatorio.");
  const route = kebab(await ask("Endpoint base", name));
  const collection = await ask("Collection Mongo", pascal(name));
  const rawFields = await ask("Campos (nome:string,ordem:number,ativo:boolean)", "name:string");
  const fields = rawFields.split(",").map((entry) => { const [field, type = "string"] = entry.trim().split(":"); return { name: camel(field), type: ["string", "number", "boolean"].includes(type) ? type : "string" }; }).filter((field) => field.name);
  const values = {
    MODULE: name,
    ROUTE: route,
    COLLECTION: collection,
    PASCAL: pascal(name),
    CAMEL: camel(name),
    FIELDS_TYPE: fields.map((field) => `  ${field.name}: ${field.type};`).join("\n"),
    FIELDS_MODEL: fields.map((field) => `    ${field.name}: { type: ${field.type === "string" ? "String" : field.type === "number" ? "Number" : "Boolean"}, ${field.name === fields[0].name ? "required: true" : `default: ${field.type === "string" ? '\"\"' : field.type === "number" ? "0" : "false"}`} },`).join("\n"),
    FIELDS_ZOD: fields.map((field) => `  ${field.name}: z.${field.type}()${field.name === fields[0].name ? ".min(1)" : `.default(${field.type === "string" ? '\"\"' : field.type === "number" ? "0" : "false"})`},`).join("\n"),
  };
  const destination = path.join(outputRoot, "src", "modules", name);
  await fs.mkdir(destination, { recursive: true });
  const templateFiles = await fs.readdir(templates);
  for (const templateFile of templateFiles) {
    let content = await fs.readFile(path.join(templates, templateFile), "utf8");
    for (const [key, value] of Object.entries(values)) content = content.replaceAll(`{{${key}}}`, value);
    await fs.writeFile(path.join(destination, templateFile.replace(/\.tpl$/, "").replaceAll("module", name)), content);
  }
  if (outputRoot === root) {
    const appPath = path.join(root, "src", "app.ts");
    let app = await fs.readFile(appPath, "utf8");
    const importLine = `import { ${camel(name)}Routes } from "./modules/${name}/${name}.routes";`;
    const routeLine = `  app.use("/${route}", ${camel(name)}Routes);`;
    if (!app.includes(importLine)) app = app.replace("// <generated-module-imports>", `${importLine}\n// <generated-module-imports>`);
    if (!app.includes(routeLine)) app = app.replace("  // <generated-module-routes>", `${routeLine}\n  // <generated-module-routes>`);
    await fs.writeFile(appPath, app);
    console.log(`Modulo criado em src/modules/${name} e registrado em /${route}.`);
  } else {
    console.log(`Modulo de teste criado em ${destination}.`);
  }
} finally {
  rl?.close();
}
