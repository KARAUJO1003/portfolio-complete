import { api } from "@/core/api/axios-instance";
import type { {{PASCAL}}Dto, {{PASCAL}}Input } from "../types/{{FEATURE}}";
export async function list{{PASCAL}}() { return (await api.get<{ items: {{PASCAL}}Dto[] }>("{{ENDPOINT}}")).data.items; }
export async function create{{PASCAL}}(input: {{PASCAL}}Input) { return (await api.post<{ item: {{PASCAL}}Dto }>("{{ENDPOINT}}",input)).data.item; }
export async function update{{PASCAL}}(id:string,input:Partial<{{PASCAL}}Input>) { return (await api.put<{ item: {{PASCAL}}Dto }>(`{{ENDPOINT}}/${id}`,input)).data.item; }
export async function delete{{PASCAL}}(id:string) { await api.delete(`{{ENDPOINT}}/${id}`); }
