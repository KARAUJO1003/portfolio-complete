export type ContentVariable = {
  key: string;
  label: string;
};

export const CONTENT_VARIABLES: ContentVariable[] = [
  { key: "profile.name", label: "Nome" },
  { key: "profile.headline", label: "Headline" },
  { key: "profile.email", label: "Email" },
  { key: "profile.phone", label: "Telefone" },
  { key: "profile.website", label: "Website" },
  { key: "profile.github", label: "GitHub" },
  { key: "profile.linkedin", label: "LinkedIn" },
  { key: "year", label: "Ano atual" },
];
