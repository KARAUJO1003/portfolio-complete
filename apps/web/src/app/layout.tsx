import type { Metadata } from "next";
import { RootProviders } from "@/providers/root-providers";
import "@/themes/globals.css";

export const metadata: Metadata = {
  title: "Portfolio Admin",
  description: "Portfolio dinamico integrado ao builder de curriculo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
