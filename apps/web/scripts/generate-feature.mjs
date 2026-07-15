import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
async function readStdin() { let value = ""; for await (const chunk of process.stdin) value += chunk; return value; }
const pipedAnswers = process.stdin.isTTY ? [] : (await readStdin()).split(/\r?\n/);
const rl = process.stdin.isTTY ? createInterface({ input: process.stdin, output: process.stdout }) : null;
const ask = async (label, fallback="") => {
  const answer = rl ? await rl.question(`${label}${fallback ? ` (${fallback})` : ""}: `) : pipedAnswers.shift() ?? "";
  return answer.trim() || fallback;
};
const kebab = (value) => value.trim().replace(/([a-z])([A-Z])/g,"$1-$2").replace(/[^a-zA-Z0-9]+/g,"-").toLowerCase().replace(/^-|-$/g,"");
const pascal = (value) => kebab(value).split("-").map((part)=>part[0].toUpperCase()+part.slice(1)).join("");
const camel = (value) => { const name=pascal(value); return name[0].toLowerCase()+name.slice(1); };
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const outputRoot = process.env.GENERATOR_OUTPUT_ROOT ? path.resolve(process.env.GENERATOR_OUTPUT_ROOT) : root;
const templates = path.join(scriptDir, "templates", "feature");
async function walk(directory, base = directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute, base));
    else files.push(path.relative(base, absolute));
  }
  return files;
}
try {
  const name = kebab(await ask("Nome da feature"));
  if (!name) throw new Error("Nome da feature e obrigatorio.");
  const route = kebab(await ask("Rota admin", name));
  const endpoint = `/${kebab(await ask("Endpoint da API", name))}`;
  const label = await ask("Titulo exibido", pascal(name));
  const rawFields = await ask("Campos (nome:string,ordem:number,ativo:boolean)", "name:string");
  const fields = rawFields.split(",").map((entry)=>{const [field,type="string"]=entry.trim().split(":");return{name:camel(field),type:["string","number","boolean"].includes(type)?type:"string"};}).filter((field)=>field.name);
  const values = {
    FEATURE:name, ROUTE:route, ENDPOINT:endpoint, LABEL:label, PASCAL:pascal(name), CAMEL:camel(name),
    FIELDS_TYPE: fields.map((field)=>`  ${field.name}: ${field.type};`).join("\n"),
    FIELDS_ZOD: fields.map((field)=>`  ${field.name}: z.${field.type === "number" ? "coerce.number" : field.type}()${field.name===fields[0].name && field.type === "string" ? ".min(1)" : ""},`).join("\n"),
    DEFAULT_VALUES: fields.map((field)=>`  ${field.name}: ${field.type === "string" ? '\"\"' : field.type === "number" ? "0" : "false"},`).join("\n"),
    FORM_FIELDS: fields.map((field)=>field.type === "boolean" ? `        <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("${field.name}")} />${field.name}</label>` : `        <FormField><FormLabel htmlFor="${field.name}">${field.name}</FormLabel><Input id="${field.name}" type="${field.type === "number" ? "number" : "text"}" {...form.register("${field.name}")} /></FormField>`).join("\n"),
    TABLE_COLUMNS: fields.map((field)=>`    { accessorKey: "${field.name}", header: "${field.name}" },`).join("\n"),
  };
  const destination=path.join(outputRoot,"src","features",name);
  await fs.mkdir(destination,{recursive:true});
  for(const templateFile of await walk(templates)){
    let content=await fs.readFile(path.join(templates,templateFile),"utf8");
    for(const [key,value] of Object.entries(values)) content=content.replaceAll(`{{${key}}}`,value);
    const relative=templateFile.replace(/\.tpl$/,"").replaceAll("feature",name).replace(`${name}-${name}`, `${name}-feature`);
    const output=path.join(destination,relative);
    await fs.mkdir(path.dirname(output),{recursive:true});
    await fs.writeFile(output,content);
  }
  const routeDir=path.join(outputRoot,"src","app","admin",route);
  await fs.mkdir(routeDir,{recursive:true});
  let routeTemplate=await fs.readFile(path.join(scriptDir,"templates","route.tsx.tpl"),"utf8");
  for(const [key,value] of Object.entries(values)) routeTemplate=routeTemplate.replaceAll(`{{${key}}}`,value);
  await fs.writeFile(path.join(routeDir,"page.tsx"),routeTemplate);
  if (outputRoot === root) {
    const shellPath=path.join(root,"src","components","layout","admin-shell.tsx");
    let shell=await fs.readFile(shellPath,"utf8");
    const link=`  { href: "/admin/${route}", label: "${label}" },`;
    if(!shell.includes(link)) shell=shell.replace("  // <generated-admin-links>",`${link}\n  // <generated-admin-links>`);
    await fs.writeFile(shellPath,shell);
    console.log(`Feature criada em src/features/${name} e rota /admin/${route}.`);
  } else {
    console.log(`Feature de teste criada em ${destination}.`);
  }
} finally { rl?.close(); }
