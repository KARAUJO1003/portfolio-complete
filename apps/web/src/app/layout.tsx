import type { Metadata } from "next";
import { Geist_Mono, Oxanium, Raleway } from "next/font/google";
import { RootProviders } from "@/providers/root-providers";
import "@/themes/globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Portfolio Admin",
  description: "Portfolio dinamico integrado ao builder de curriculo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${raleway.variable} ${oxanium.variable} ${geistMono.variable}`} lang="pt-BR" suppressHydrationWarning>
      <body>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
