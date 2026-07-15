export type {{PASCAL}}Dto = { id: string; ownerId?: string; createdAt?: string; updatedAt?: string;
{{FIELDS_TYPE}}
};
export type {{PASCAL}}Input = Omit<{{PASCAL}}Dto, "id" | "ownerId" | "createdAt" | "updatedAt">;
