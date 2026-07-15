import type { CreateCustomSectionRequest, CustomSectionDto, UpdateCustomSectionRequest } from "@portfolio/contracts";
import { api } from "@/core/api/axios-instance";
export async function listCustomSections() { return (await api.get<{ sections: CustomSectionDto[] }>("/custom-sections")).data.sections; }
export async function createCustomSection(input: CreateCustomSectionRequest) { return (await api.post<{ section: CustomSectionDto }>("/custom-sections", input)).data.section; }
export async function updateCustomSection(id: string, input: UpdateCustomSectionRequest) { return (await api.put<{ section: CustomSectionDto }>(`/custom-sections/${id}`, input)).data.section; }
export async function deleteCustomSection(id: string) { await api.delete(`/custom-sections/${id}`); }
