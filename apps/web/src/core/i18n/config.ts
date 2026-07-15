export const i18nConfig = {
  defaultLocale: "pt-BR",
  locales: ["pt-BR"],
} as const;

export type AppLocale = (typeof i18nConfig.locales)[number];
