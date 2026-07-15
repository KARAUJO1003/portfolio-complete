"use client";

import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import { createQueryClient } from "@/core/cache/query-client";
import { AuthProvider } from "@/core/auth/contexts/auth-context";
import { ModalProvider } from "@/core/modal/modal-context";

export function RootProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <ModalProvider>
            <AuthProvider>{children}</AuthProvider>
          </ModalProvider>
        </NuqsAdapter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <Toaster richColors visibleToasts={3} />
    </ThemeProvider>
  );
}
