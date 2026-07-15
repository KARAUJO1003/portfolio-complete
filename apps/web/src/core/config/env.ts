export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3333",
  baseUrlFiles: process.env.NEXT_PUBLIC_BASE_URL_FILES ?? "http://localhost:3333/files",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  authEnabled: process.env.NEXT_PUBLIC_AUTH_ENABLED === "true",
};
