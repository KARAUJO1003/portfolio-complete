import { api } from "@/core/api/axios-instance";

export async function generateClassicAtsPdf(input: { sections?: string[]; versionId?: string }) {
  const response = await api.post<Blob>(
    "/resume-pdf/classic-ats",
    input,
    { responseType: "blob" },
  );

  return response.data;
}

export async function generateResumePdf(template: "classic-ats" | "compact-ats", input: { sections?: string[]; versionId?: string }) {
  const response = await api.post<Blob>(`/resume-pdf/${template}`, input, { responseType: "blob" });
  return response.data;
}
