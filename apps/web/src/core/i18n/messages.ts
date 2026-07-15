import type { AppLocale } from "./config";

const messages = {
  "pt-BR": {
    common: { save: "Salvar", publish: "Publicar", cancel: "Cancelar", delete: "Excluir" },
  },
} as const;

export function getMessages(locale: AppLocale) { return messages[locale]; }
